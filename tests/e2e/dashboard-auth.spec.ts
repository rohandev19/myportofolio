import { test, expect } from "@playwright/test";

test.describe("Dashboard Protection", () => {
  test("blocks unauthenticated access to the analytics dashboard", async ({ page }) => {
    const response = await page.goto("/dashboard/analytics", {
      waitUntil: "domcontentloaded",
    });

    // Without valid Basic Auth credentials, the middleware must respond with
    // either 401 (auth required) or 503 (not configured) — never 200.
    expect(response?.status()).not.toBe(200);
    expect([401, 503]).toContain(response?.status());
  });
});
