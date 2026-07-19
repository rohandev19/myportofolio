const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', exception => {
    errors.push(`Uncaught exception: ${exception.message}\n${exception.stack}`);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console error: ${msg.text()}`);
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2000); // give time for errors
  } catch (err) {
    errors.push(`Goto error: ${err.message}`);
  }

  if (errors.length > 0) {
    console.log("ERRORS FOUND:");
    console.log(errors.join("\n\n"));
  } else {
    console.log("NO ERRORS FOUND.");
  }

  await browser.close();
})();
