import { test, expect, type Page } from "@playwright/test";
import { waitForAppReady } from "./utils";

/**
 * Ctrl+K/Cmd+K is a reserved browser shortcut in Chromium (focuses the
 * address bar), so it never reaches the page when driven via
 * `page.keyboard.press()`. We dispatch the KeyboardEvent directly on
 * `document` instead, which is what the app's own listener is bound to.
 */
async function openCommandPalette(page: Page) {
  await page.evaluate(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true })
    );
  });
}

test.describe("Command Palette", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);
  });

  test("opens with Ctrl+K and closes with Escape", async ({ page }) => {
    await openCommandPalette(page);

    const dialog = page.getByRole("dialog", { name: "Command Palette" });
    await expect(dialog).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("filters commands via fuzzy search", async ({ page }) => {
    await openCommandPalette(page);

    const searchInput = page.getByLabel("Search commands");
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("blog");

    await expect(page.getByRole("option", { name: /go to blog/i })).toBeVisible();
  });

  test("navigates to the blog page via command selection", async ({ page }) => {
    await openCommandPalette(page);

    const searchInput = page.getByLabel("Search commands");
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("blog");

    await page.getByRole("option", { name: /go to blog/i }).click();

    await expect(page).toHaveURL(/\/blog$/, { timeout: 10000 });
  });
});
