const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('request', req => {
    const url = req.url();
    const method = req.method();
    if (/auth|login|token|signin|sign-in|users?/i.test(url)) {
      console.log('REQ', method, url);
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (/auth|login|token|signin|sign-in|users?/i.test(url)) {
      console.log('RES', res.status(), url, await res.headers()['content-type']);
    }
  });

  await page.goto('https://rahulshettyacademy.com/client', { waitUntil: 'networkidle' });
  await page.fill('#userEmail', 'Anishk1@gmail.com');
  await page.fill('#userPassword', 'Awesome@555');
  await page.click('[value="Login"]');
  await page.waitForTimeout(10000);
  await browser.close();
})();
