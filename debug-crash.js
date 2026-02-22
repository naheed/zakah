const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    console.log('Navigating to http://localhost:8080/calculator...');
    await page.goto('http://localhost:8080/calculator', { waitUntil: 'networkidle' });

    await browser.close();
})();
