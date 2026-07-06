import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

/**
 * DPR Labs home page — before/after visual baseline capture + accessibility baseline.
 *
 * Writes named PNGs (per project) into tests/e2e/<SHOT_DIR> so a later phase can
 * re-run with SHOT_DIR=baseline/after and diff the two states. Assertions are
 * structural and redesign-stable (shared nav, an <h1>, a call-to-action, the
 * footer) so this same spec keeps passing after the home page is rebuilt.
 *
 * No fixed sleeps: reducedMotion:'reduce' (see playwright.config.mjs) settles the
 * page on load; we wait on conditions only.
 * Docs: https://playwright.dev/docs/screenshots , https://playwright.dev/docs/accessibility-testing
 */
const SHOT_DIR = process.env.SHOT_DIR || 'baseline/before';
const OUT_DIR = path.join('tests', 'e2e', ...SHOT_DIR.split(/[\\/]/));
fs.mkdirSync(OUT_DIR, { recursive: true });

async function settle(page) {
  await page.waitForLoadState('load');
  // The "instrument boots" intro self-removes under reduced motion; wait for that
  // state instead of a timer.
  await page.waitForFunction(
    () =>
      document.body.classList.contains('calibrated') ||
      !document.getElementById('calibrate'),
  );
  await page.evaluate(async () => {
    // Belt-and-suspenders: pin every reveal to its shown state (mirrors the site's
    // own no-JS / reduced-motion fallback) and freeze looping media to frame 0 so
    // the baseline is byte-stable.
    document
      .querySelectorAll('[data-reveal],[data-stagger],.reveal')
      .forEach((el) => el.classList.add('is-in', 'in'));
    document.querySelectorAll('video').forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) {
        /* poster frame is fine */
      }
    });
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        /* fonts optional for layout capture */
      }
    }
  });
  await page.waitForLoadState('networkidle');
}

test.describe('DPR Labs home page — visual baseline', () => {
  test('renders shared nav, a hero value prop, a CTA, and the footer', async ({
    page,
  }, testInfo) => {
    await page.goto('/index.html', { waitUntil: 'load' });
    await settle(page);

    // User-observable outcomes (stable across the redesign).
    await expect(page).toHaveTitle(/DPR\s*Labs/i);

    const brand = page.locator('header .brand').first();
    await expect(brand).toBeVisible();
    await expect(brand).toContainText(/DPR\s*Labs/i);

    const heading = page.locator('main h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    const cta = page
      .locator('main a.btn, main a[href*="contact"], main a[href*="pilot"]')
      .first();
    await expect(cta).toBeVisible();

    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/DPR\s*Labs/i);

    // Capture the baseline (full page + above-the-fold) for this project.
    const prefix = testInfo.project.name;
    await page.evaluate(() => window.scrollTo(0, 0));

    const fullPath = path.join(OUT_DIR, `${prefix}-home-full.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    await testInfo.attach(`${prefix}-home-full`, {
      path: fullPath,
      contentType: 'image/png',
    });

    const foldPath = path.join(OUT_DIR, `${prefix}-home-fold.png`);
    await page.screenshot({ path: foldPath, fullPage: false });
    await testInfo.attach(`${prefix}-home-fold`, {
      path: foldPath,
      contentType: 'image/png',
    });

    expect(fs.existsSync(fullPath), `wrote ${fullPath}`).toBeTruthy();
    expect(fs.existsSync(foldPath), `wrote ${foldPath}`).toBeTruthy();
  });

  test('records the accessibility baseline (axe serious/critical counts)', async ({
    page,
  }, testInfo) => {
    await page.goto('/index.html', { waitUntil: 'load' });
    await settle(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    // This test RECORDS the current state for later before/after comparison; it
    // is deliberately non-gating on the (pre-redesign) page. The scan must run.
    expect(Array.isArray(results.violations)).toBeTruthy();

    const serious = results.violations.filter((v) => v.impact === 'serious').length;
    const critical = results.violations.filter((v) => v.impact === 'critical').length;
    const summary = {
      project: testInfo.project.name,
      total: results.violations.length,
      serious,
      critical,
      ids: results.violations.map((v) => `${v.id}:${v.impact}`),
    };
    console.log(`[a11y-baseline] ${JSON.stringify(summary)}`);

    const jsonPath = path.join(OUT_DIR, `${testInfo.project.name}-a11y.json`);
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({ ...summary, violations: results.violations }, null, 2),
    );
    await testInfo.attach(`${testInfo.project.name}-a11y`, {
      path: jsonPath,
      contentType: 'application/json',
    });
  });
});
