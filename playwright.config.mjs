import { defineConfig, devices } from '@playwright/test';

/**
 * DPR Labs static-site visual-QA harness.
 *
 * Serves the repo with the same command the project ships with
 * (`python -m http.server 8137`) and drives it in a real Chromium browser at
 * two viewports (desktop + mobile). `reducedMotion: 'reduce'` gives a
 * deterministic, fully-settled frame: the "instrument boots" intro self-removes
 * and every scroll-reveal force-shows on load, so baselines are stable without
 * any fixed sleeps.
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
const PORT = 8137;
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/e2e/test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 2,
  workers: isCI ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './tests/e2e/report' }],
  ],
  use: {
    baseURL: BASE_URL,
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'python -m http.server 8137',
    url: `${BASE_URL}/index.html`,
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
});
