const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');
const { AdminPage } = require('../../../pages/AdminPage');
const { UserManagementPage } = require('../../../pages/UserManagementPage');
const { logindata } = require('../../../test-data/loginData');
const {userManagementData } = require('../../../test-data/userManagementData');

let loginPage;
let dashboardPage;
let adminPage;
let userManagementPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  adminPage = new AdminPage(page);
  userManagementPage = new UserManagementPage(page);

  // Login and navigate to Admin > System Users page before each test
  await loginPage.openLoginPage();
  await loginPage.login(logindata.validUser.username, logindata.validUser.password);
  await dashboardPage.verifyDashboardIsVisible();
  await adminPage.openAdminPage();
  await adminPage.verifySystemUsersPageIsVisible();
});

test('admin should create search edit and delete user successfully', async () => {
  test.setTimeout(120000);

  // Unique username avoids failure if previous test data still exists
  const username = `${userManagementData.newUser.usernamePrefix}${Date.now()}`;
  const password = userManagementData.newUser.password;

  // Create new user
  await userManagementPage.clickAddUser();
  await userManagementPage.verifyAddUserPageIsVisible();
  await userManagementPage.selectUserRole(userManagementData.newUser.role);
  await userManagementPage.selectExistingEmployee();
  await userManagementPage.selectStatus(userManagementData.newUser.statusEnabled);
  await userManagementPage.enterUserDetails(username, password);
  await userManagementPage.saveUser();
  await userManagementPage.verifyNoValidationErrors();

  // Search and verify created user
  await adminPage.verifySystemUsersPageIsVisible();
  await userManagementPage.searchUser(username);
  await userManagementPage.verifyUserIsDisplayed(username, 'Enabled');

  // Edit user and update status
  await userManagementPage.editUser(username);
  await userManagementPage.verifyEditUserPageIsVisible();
await userManagementPage.updateStatus(userManagementData.newUser.statusDisabled);
  await userManagementPage.verifyUserUpdatedSuccessfully();

  // Search and verify updated status
  await adminPage.verifySystemUsersPageIsVisible();
  await userManagementPage.searchUser(username);
  await userManagementPage.verifyUserIsDisplayed(username, 'Disabled');

  // Verify delete cancel flow first
  await userManagementPage.cancelDeleteUser(username);
  await userManagementPage.verifyUserIsDisplayed(username, 'Disabled');

  // Delete user
  await userManagementPage.confirmDeleteUser(username);
  await userManagementPage.verifyUserDeletedSuccessfully();

  // Search again and verify deleted user is not displayed
  await userManagementPage.searchUser(username);
  await userManagementPage.verifyUserIsNotDisplayed(username);
});