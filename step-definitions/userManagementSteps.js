const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { AdminPage } = require('../pages/AdminPage');
const { UserManagementPage } = require('../pages/UserManagementPage');

const { logindata } = require('../test-data/loginData');
const { userManagementData } = require('../test-data/userManagementData');

setDefaultTimeout(120000);

let browser;
let context;
let page;

let loginPage;
let dashboardPage;
let adminPage;
let userManagementPage;

let username;
let password;

Given('Admin is logged into OrangeHRM', async function () {
  browser = await chromium.launch({
    channel: 'chrome',
    headless: false
  });

  context = await browser.newContext({
    baseURL: process.env.ORANGEHRM_BASE_URL || 'https://opensource-demo.orangehrmlive.com/'
  });
  page = await context.newPage();

  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  adminPage = new AdminPage(page);
  userManagementPage = new UserManagementPage(page);

  username = `${userManagementData.newUser.usernamePrefix}${Date.now()}`;
  password = userManagementData.newUser.password;

  await loginPage.openLoginPage();
  await loginPage.login(logindata.validUser.username, logindata.validUser.password);
  await dashboardPage.verifyDashboardIsVisible();
});

Given('Admin navigates to the System Users page', async function () {
  await adminPage.openAdminPage();
  await adminPage.verifySystemUsersPageIsVisible();
});

When('Admin creates a new user', async function () {
  await userManagementPage.clickAddUser();
  await userManagementPage.verifyAddUserPageIsVisible();
  await userManagementPage.selectUserRole(userManagementData.newUser.role);
  await userManagementPage.selectExistingEmployee();
  await userManagementPage.selectStatus(userManagementData.newUser.statusEnabled);
  await userManagementPage.enterUserDetails(username, password);
  await userManagementPage.saveUser();
  await userManagementPage.verifyNoValidationErrors();

  await adminPage.verifySystemUsersPageIsVisible();
  await userManagementPage.searchUser(username);
});

Then('The user should be displayed with status {string}', async function (status) {
  await userManagementPage.searchUser(username);
  await userManagementPage.verifyUserIsDisplayed(username, status);
});

When('Admin updates the user status to {string}', async function (status) {
  await userManagementPage.editUser(username);
  await userManagementPage.verifyEditUserPageIsVisible();
  await userManagementPage.updateStatus(status);
  await userManagementPage.verifyUserUpdatedSuccessfully();

  await adminPage.verifySystemUsersPageIsVisible();
  await userManagementPage.searchUser(username);
});

When('Admin deletes the user', async function () {
  await userManagementPage.confirmDeleteUser(username);
  await userManagementPage.verifyUserDeletedSuccessfully();
  await userManagementPage.searchUser(username);
});

Then('The user should not be displayed in the user list', async function () {
  await userManagementPage.verifyUserIsNotDisplayed(username);
});

After(async function () {
  if (context) {
    await context.close();
    context = null;
  }

  if (browser) {
    await browser.close();
    browser = null;
  }
});
