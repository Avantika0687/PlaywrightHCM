const { expect } = require('@playwright/test');

class UserManagementPage {
  constructor(page) {
    this.page = page;

    // Add User page locators
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.addUserHeading = page.getByRole('heading', { name: 'Add User' });

    // Edit User page locator
    this.editUserHeading = page.getByRole('heading', { name: 'Edit User' });

    // Dropdown locators
    this.userRoleDropdown = page.locator('.oxd-select-text').first();
    this.statusDropdown = page.locator('.oxd-select-text').nth(1);

    // Employee autocomplete locators
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.autocompleteOptions = page.getByRole('option');
    this.noRecordsOption = page.getByRole('option', { name: 'No Records Found' });

    // Common form and button locators
    this.form = page.locator('.oxd-form');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Validation and success message locators
    this.validationErrors = page.locator('.oxd-input-field-error-message');
    this.successfullyUpdatedMessage = page.getByText('Successfully Updated');
    this.successfullyDeletedMessage = page.getByText('Successfully Deleted');

    // Delete confirmation locators
    this.deleteConfirmationMessage = page.getByText('Are you Sure?');
    this.cancelDeleteButton = page.getByRole('button', { name: 'No, Cancel' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  // Opens Add User page
  async clickAddUser() {
    await expect(this.addButton).toBeVisible();
    await this.addButton.click();
  }

  // Verifies Add User page is displayed
  async verifyAddUserPageIsVisible() {
    await expect(this.addUserHeading).toBeVisible();
  }

  // Selects user role such as Admin or ESS
  async selectUserRole(roleName) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: roleName }).click();
  }

  // Selects an existing employee from OrangeHRM autocomplete
  async selectExistingEmployee() {
    const employeeSearchTerms = ['a', 'e', 'n'];
    let selectedEmployeeName;

    for (const searchTerm of employeeSearchTerms) {
      await this.employeeNameInput.fill(searchTerm);
      await expect(this.autocompleteOptions.first()).toBeVisible({ timeout: 10000 });

      await expect
        .poll(
          async () => {
            const optionTexts = await this.autocompleteOptions.allInnerTexts();

            return optionTexts
              .map((text) => text.trim())
              .find((text) => text && text !== 'Searching....' && text !== 'No Records Found') || '';
          },
          { timeout: 10000 }
        )
        .not.toBe('');

      if (await this.noRecordsOption.isVisible().catch(() => false)) {
        continue;
      }

      const validOption = this.autocompleteOptions
        .filter({ hasNotText: 'Searching....' })
        .filter({ hasNotText: 'No Records Found' })
        .first();

      selectedEmployeeName = (await validOption.innerText()).trim();
      await validOption.click();
      break;
    }

    expect(
      selectedEmployeeName,
      'Expected at least one employee suggestion in the autocomplete'
    ).toBeTruthy();

    console.log('Employee selected from UI:', selectedEmployeeName);
  }

  // Selects user status such as Enabled or Disabled
  async selectStatus(statusName) {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: statusName }).click();
  }

  // Enters username, password and confirm password
  async enterUserDetails(username, password) {
    await this.form.locator('input').nth(1).fill(username);
    await this.form.locator('input[type="password"]').first().fill(password);
    await this.form.locator('input[type="password"]').nth(1).fill(password);
  }

  // Clicks Save button
  async saveUser() {
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
  }

  // Checks if form displayed any validation errors after save
  async verifyNoValidationErrors() {
    await this.page.waitForTimeout(2000);

    const validationErrorCount = await this.validationErrors.count();

    if (validationErrorCount > 0) {
      console.log('Save failed because of validation errors:');

      for (let i = 0; i < validationErrorCount; i++) {
        console.log(await this.validationErrors.nth(i).innerText());
      }

      throw new Error('Add User form has validation errors. Check terminal output.');
    }
  }

  // Searches user by username on System Users page
  async searchUser(username) {
    await this.form.locator('input').first().fill(username);
    await expect(this.searchButton).toBeVisible();
    await this.searchButton.click();
  }

  // Returns row locator for a specific username
  getUserRow(username) {
    return this.page.locator('.oxd-table-card').filter({ hasText: username });
  }

  // Verifies username and status in search result
  async verifyUserIsDisplayed(username, status) {
    const userRow = this.getUserRow(username);

    await expect(userRow).toBeVisible({ timeout: 10000 });
    await expect(userRow).toContainText(username);
    await expect(userRow).toContainText(status);
  }

  // Opens Edit User page for selected username
  async editUser(username) {
    const userRow = this.getUserRow(username);
    await userRow.locator('button').nth(1).click();
  }

  // Verifies Edit User page is displayed
  async verifyEditUserPageIsVisible() {
    await expect(this.editUserHeading).toBeVisible();
  }

  // Updates user status and saves the change
  async updateStatus(statusName) {
    await this.selectStatus(statusName);
    await this.saveUser();
  }

  // Verifies user update success message
  async verifyUserUpdatedSuccessfully() {
    await expect(this.successfullyUpdatedMessage).toBeVisible({ timeout: 15000 });
  }

  // Clicks delete and cancels the confirmation popup
  async cancelDeleteUser(username) {
    const userRow = this.getUserRow(username);

    await userRow.locator('button').first().click();
    await expect(this.deleteConfirmationMessage).toBeVisible();
    await this.cancelDeleteButton.click();

    await expect(userRow).toBeVisible();
  }

  // Clicks delete and confirms the confirmation popup
  async confirmDeleteUser(username) {
    const userRow = this.getUserRow(username);

    await userRow.locator('button').first().click();
    await expect(this.deleteConfirmationMessage).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  // Verifies user delete success message
  async verifyUserDeletedSuccessfully() {
    await expect(this.successfullyDeletedMessage).toBeVisible({ timeout: 15000 });
  }

  // Verifies username is not shown in search result
  async verifyUserIsNotDisplayed(username) {
    const userRow = this.getUserRow(username);
    await expect(userRow).toHaveCount(0, { timeout: 10000 });
  }
}

module.exports = { UserManagementPage };