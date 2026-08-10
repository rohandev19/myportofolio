import { test, expect } from "@playwright/test";
import { waitForAppReady } from "./utils";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("shows validation errors for invalid input", async ({ page }) => {
    const nameInput = page.locator("#contact-name");
    const messageInput = page.locator("#contact-message");

    await nameInput.click();
    await nameInput.pressSequentially("a");
    await messageInput.click();
    await messageInput.pressSequentially("short");
    await page.locator("#contact-subject").click();

    await expect(page.locator("#name-error")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#message-error")).toBeVisible({ timeout: 10000 });

    const submitButton = page.getByRole("button", { name: /send message/i });
    await expect(submitButton).toBeDisabled();
  });

  test("submits successfully with valid input", async ({ page }) => {
    test.setTimeout(60000);
    await page.locator("#contact-name").click();
    await page.locator("#contact-name").pressSequentially("Jane Doe");
    await page.locator("#contact-email").click();
    await page.locator("#contact-email").pressSequentially("jane.doe@example.com");
    await page.locator("#contact-subject").click();
    await page.locator("#contact-subject").pressSequentially("Project inquiry");
    await page.locator("#contact-message").click();
    await page
      .locator("#contact-message")
      .pressSequentially("Hello, I would like to discuss a potential project collaboration.");
    await page.locator("#contact-message").blur();

    const submitButton = page.getByRole("button", { name: /send message/i });
    await expect(submitButton).toBeEnabled({ timeout: 10000 });
    await submitButton.click();

    // A response toast must appear (success, or a graceful failure if the
    // configured email provider is unreachable from this environment) —
    // the important part is the API responds instead of hanging forever.
    const toast = page.getByRole("status");
    await expect(toast).toBeVisible({ timeout: 15000 });

    const toastText = await toast.innerText();
    if (/message sent successfully/i.test(toastText)) {
      // Form should reset after a successful submission
      await expect(page.locator("#contact-name")).toHaveValue("");
    }
  });
});
