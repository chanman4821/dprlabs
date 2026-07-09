# DPR AI — end-to-end visual-QA harness

A small [Playwright](https://playwright.dev) harness that drives the static site in a
real Chromium browser (desktop + mobile) and captures the home page as a stable visual
baseline. Built in phase **P0 — before-state capture** so every later phase can prove
before → after and run the accessibility/visual quality gate.

## What it does

`home.capture.spec.mjs`:

- Serves the repo with the project's own command (`python -m http.server 8137`) — wired
  as Playwright's `webServer`, so you never start the server by hand.
- Settles the page deterministically with **no fixed sleeps**: `reducedMotion: 'reduce'`
  makes the "instrument boots" intro self-remove and every scroll-reveal show on load.
- Asserts user-observable, redesign-stable outcomes (title, shared nav brand, an `<h1>`,
  a call-to-action, the footer) — so the same spec keeps passing after the home page is
  rebuilt.
- Writes per-project PNGs (`*-home-full.png`, `*-home-fold.png`) plus an axe
  accessibility summary (`*-a11y.json`) into `tests/e2e/<SHOT_DIR>`.

## Run

```powershell
# from the repo root
npm install                 # first time only (installs @playwright/test + @axe-core/playwright)
npx playwright install chromium

# capture the BEFORE baseline (default SHOT_DIR = baseline/before)
npx playwright test

# open the HTML report
npx playwright show-report tests/e2e/report
```

## Capture the AFTER state (later phases)

After the home page is redesigned, re-run the same spec into a different folder and
compare with the committed `baseline/before` PNGs:

```powershell
$env:SHOT_DIR = 'baseline/after'; npx playwright test; Remove-Item Env:\SHOT_DIR
```

## Layout

```
playwright.config.mjs            # projects (desktop 1440x900 + Pixel 5), retries:2,
                                 # trace on-first-retry, video/screenshot on failure,
                                 # python webServer on :8137
tests/e2e/home.capture.spec.mjs  # the capture + a11y baseline spec
tests/e2e/baseline/before/       # committed before-state PNGs + a11y JSON (this phase)
tests/e2e/report/                # generated HTML report (gitignored)
tests/e2e/test-results/          # traces/video on failure (gitignored)
```
