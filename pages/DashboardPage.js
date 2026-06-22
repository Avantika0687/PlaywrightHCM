const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async verifyDashboardIsVisible() {
    await expect(this.page).toHaveURL(/dashboard/, { timeout: 15000 });
    await expect(this.dashboardHeading).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { DashboardPage };
