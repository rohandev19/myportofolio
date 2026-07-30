import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  if (!baseURL) {
    throw new Error("baseURL is not configured");
  }

  // Wait for server to be ready
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let retries = 0;
  const maxRetries = 30;

  while (retries < maxRetries) {
    try {
      await page.goto(baseURL, { timeout: 5000 });
      console.log("✓ Development server is ready");
      break;
    } catch {
      retries++;
      if (retries === maxRetries) {
        throw new Error("Development server failed to start");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  await browser.close();
}

export default globalSetup;
