import { test, expect } from "@playwright/test";
import { waitForAppReady } from "./utils";

test.describe("Blog Navigation", () => {
  test("lists articles and navigates to a post", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);

    await expect(page.getByRole("heading", { name: "Blog", level: 1 })).toBeVisible();

    const firstArticleLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstArticleLink).toBeVisible();

    const href = await firstArticleLink.getAttribute("href");
    await firstArticleLink.click();

    // First navigation to a dynamic route can be slow in dev mode while
    // Turbopack compiles it on demand, so this allows extra headroom.
    await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, "\\/")), { timeout: 20000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 20000 });
  });

  test("filters articles by search query", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);

    const searchInput = page.getByLabel("Search articles");
    await searchInput.click();
    await searchInput.pressSequentially("zzz-no-such-article-zzz");

    await expect(page.getByText("No articles found")).toBeVisible({ timeout: 10000 });
  });
});
