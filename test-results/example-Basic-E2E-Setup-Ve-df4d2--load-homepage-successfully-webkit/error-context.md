# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> Basic E2E Setup Verification >> should load homepage successfully
- Location: tests\e2e\example.spec.ts:4:7

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Basic E2E Setup Verification", () => {
  4  |   test("should load homepage successfully", async ({ page }) => {
> 5  |     await page.goto("/", { waitUntil: "domcontentloaded" });
     |                ^ Error: page.goto: Could not connect to server
  6  |
  7  |     // Verify page has loaded
  8  |     await expect(page).toHaveTitle(/./);
  9  |   });
  10 | });
  11 |
```
