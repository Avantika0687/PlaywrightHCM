const { expect } = require('@playwright/test');

class AdminPage {
  constructor(page) {
    this.page = page;

    // Left side menu
    this.leftMenu = page.locator('.oxd-sidepanel');
    this.adminMenu = this.leftMenu.getByRole('link', { name: 'Admin' });

    // Admin page heading
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
  }

  async openAdminPage() {
    await this.adminMenu.click();
  }

  async verifySystemUsersPageIsVisible() {
    await expect(this.systemUsersHeading).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { AdminPage };