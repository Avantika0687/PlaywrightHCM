const { chromium } = require('playwright');
(async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTM1MDI2OTE3ZWUzZTc4YmFlZDIzYmUiLCJ1c2VyRW1haWwiOiJBbmlzaGsxQGdtYWlsLmNvbSIsInVzZXJNb2JpbGUiOjEyMzEyMzEyMzIsInVzZXJSb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3ODE5MTE5NjIsImV4cCI6MTgxMzQ2OTU2Mn0.FkbBPtTWqwt6XZkONv3Wg8U3KpBKSrXLaUhPn8Ee-20';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, token);
  await page.goto('https://rahulshettyacademy.com/client', { waitUntil: 'networkidle' });
  console.log('localStorage token exists?', await page.evaluate(() => localStorage.getItem('token') !== null));
  const buttonCount = await page.locator("button[routerlink*='myorders']").count();
  console.log('myorders button count', buttonCount);
  console.log('url', page.url());
  console.log('title', await page.title());
  const innerHTML = await page.locator('body').innerHTML();
  console.log('body length', innerHTML.length);
  await browser.close();
})();