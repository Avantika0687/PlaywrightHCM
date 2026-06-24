const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMsg = page.getByText('Invalid credentials');
  }

  async openLoginPage() {
    await this.page.goto('/');
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 15000 });
  }

  async login(userName, password) {
    await expect(this.loginButton).toBeEnabled({ timeout: 15000 });
    await this.usernameInput.fill(userName);
    await this.passwordInput.fill(password);
    await expect(this.usernameInput).toHaveValue(userName);
    await expect(this.passwordInput).toHaveValue(password);
    await this.loginButton.click();
  }

  async verifyInvalidCredentialsMessage() {
    await expect(this.errorMsg).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { LoginPage };
