const {expect} = require('@playwright/test');
class LoginPage{
    constructor(page){
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton =   page.getByRole('button', { name: 'Login' }); 
        this.errorMsg =      page.getByText('Invalid credentials');
    }

async openLoginPage(){
    await this.page.goto('/');
  }

async login(userName, password){
    await this.usernameInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
      }

async verifyInvalidCredentialsMessage() {
     await expect(this.errorMsg).toBeVisible();
      }
}





module.exports = {LoginPage}