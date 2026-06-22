const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('admin should open corporate branding upload logo and publish', async ({ page }) => {
  test.setTimeout(90000);

  // Use a repo-local logo asset that matches OrangeHRM's recommended 50x50 dimensions.
  const validLogoPath = path.resolve(__dirname, '../../fixtures/corporate-logo-50x50.svg');

  // Check file exists before test starts
  if (!fs.existsSync(validLogoPath)) {
    throw new Error(`File not found: ${validLogoPath}`);
  }

  // Step 1: Open OrangeHRM login page
  await page.goto('https://opensource-demo.orangehrmlive.com/');

  // Step 2: Login as Admin
  const usernameInput = page.getByPlaceholder('Username');
  await expect(usernameInput).toBeVisible();
  await usernameInput.fill('Admin');

  const passwordInput = page.getByPlaceholder('Password');
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill('admin123');

  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();
  await loginButton.click();

  // Step 3: Verify dashboard is displayed
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Step 4: Click Admin from left menu
  const leftMenu = page.locator('.oxd-sidepanel');
  const adminMenu = leftMenu.getByRole('link', { name: 'Admin' });

  await expect(adminMenu).toBeVisible();
  await adminMenu.click();

  // Step 5: Verify Admin page is displayed
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();

  // Step 6: Click Corporate Branding from top menu
  const topBarMenu = page.locator('.oxd-topbar-body');

  const corporateBrandingLink = topBarMenu
    .locator('a')
    .filter({ hasText: 'Corporate Branding' });

  await expect(corporateBrandingLink).toBeVisible({ timeout: 10000 });
  await corporateBrandingLink.click({ force: true });

  // Step 7: Verify Corporate Branding page is opened
  await expect(page.getByRole('heading', { name: 'Corporate Branding' })).toBeVisible({
    timeout: 10000
  });

  // // Step 8: Fill colour fields if available
  // const colorInputs = page.locator('input[placeholder="Pick a color"]');
  // const colorCount = await colorInputs.count();

  // console.log('Colour fields found:', colorCount);

  // if (colorCount > 0) {
  //   await colorInputs.nth(0).fill('#FF6600');
  // }

  // if (colorCount > 1) {
  //   await colorInputs.nth(1).fill('#222222');
  // }

  // if (colorCount > 2) {
  //   await colorInputs.nth(2).fill('#FFFFFF');
  // }

  // if (colorCount > 3) {
  //   await colorInputs.nth(3).fill('#000000');
  // }

  // Step 9: Upload valid file in first upload field only
  const fileInput = page.locator('input[type="file"]').first();

  await fileInput.setInputFiles(validLogoPath);

  console.log('Uploaded valid file in first upload field');

  // Step 10: Click Publish button
  const publishButton = page.getByRole('button', { name: 'Publish' });

  await expect(publishButton).toBeVisible();
  await expect(publishButton).toBeEnabled();
  await publishButton.click();

  // Step 11: Check validation errors after Publish
  await page.waitForTimeout(2000);

  const validationErrors = page.locator('.oxd-input-field-error-message');
  const validationErrorCount = await validationErrors.count();

  if (validationErrorCount > 0) {
    console.log('Validation errors found after Publish:');

    for (let i = 0; i < validationErrorCount; i++) {
      console.log(await validationErrors.nth(i).innerText());
    }

    throw new Error('Corporate Branding form has validation errors. Check terminal output.');
  }

  // Step 12: Verify success message
  await expect(page.getByText('Successfully Saved')).toBeVisible({
    timeout: 15000
  });
});
 // Change this path if your image is saved somewhere else
  
