import { test, expect } from "@playwright/test";

test.describe("Basic E2E Setup Verification", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Verify page has loaded
    await expect(page).toHaveTitle(/./);
  });
});
