const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');
const { logindata } = require('../../../test-data/loginData');

let loginPage;
let dashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.openLoginPage();
});

test('valid user should login successfully', async () => {
  await loginPage.login(logindata.validUser.username, logindata.validUser.password);
  await dashboardPage.verifyDashboardIsVisible();
});

test('invalid user should see login error message', async () => {
  await loginPage.login(logindata.invalidUser.username, logindata.invalidUser.password);
  await loginPage.verifyInvalidCredentialsMessage();
});
