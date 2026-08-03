import type { Page } from "@playwright/test";

/**
 * Waits for the app's intro Preloader (counter + door animation, ~4s) to
 * finish and unmount. It renders on every first load of any route and
 * covers the full viewport, intercepting pointer events until it's gone.
 */
export async function waitForAppReady(page: Page) {
  await page
    .getByTestId("preloader")
    .waitFor({ state: "hidden", timeout: 15000 })
    .catch(() => {
      // Already gone (e.g. session already marked as "visited").
    });
}
