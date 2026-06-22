const { test, expect } = require('@playwright/test');

test('OrangeHRM - Add, verify and edit employee in PIM', async ({ page }) => {
  const uniqueId = `${Date.now()}`.slice(-6);
  const firstName = `nikki${uniqueId}`;
  const updatedFirstName = `nina${uniqueId}`;
  const lastName = 'test';

  // Login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);

  // Navigate to PIM
  await page.locator('a[href*="/pim/viewPimModule"]').click();
  await expect(page.getByRole('heading', { name: 'PIM' })).toBeVisible();

  // Add Employee
  await page.locator('button:has-text("Add")').click();
  await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

  await page.locator('input[name="firstName"]').fill(firstName);
  await page.locator('input[name="lastName"]').fill(lastName);

  await page.locator('button[type="submit"]').click();

  // Verify employee saved
  await expect(page).toHaveURL(/viewPersonalDetails/);
  await expect(page.locator('input[name="firstName"]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('input[name="firstName"]')).toHaveValue(firstName);

  // Go back to Employee List
  await page.locator('a:has-text("Employee List")').click();
  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();

  // Search employee
  await page.locator('input[placeholder="Type for hints..."]').first().fill(`${firstName} ${lastName}`);

  await page.locator('button:has-text("Search")').click();

  // Verify employee displayed
  const employeeRow = page.locator('.oxd-table-card').filter({ hasText: firstName }).first();
  await expect(employeeRow).toBeVisible({ timeout: 10000 });
  await expect(employeeRow).toContainText(firstName);

  // Click edit button
  await employeeRow.locator('button').first().click();
  await expect(page).toHaveURL(/viewPersonalDetails/);
  const firstNameInput = page.locator('input[name="firstName"]');
  await expect(firstNameInput).toBeVisible({ timeout: 15000 });

  // Update first name
  await firstNameInput.click();
  await firstNameInput.press('Control+A');
  await firstNameInput.fill(updatedFirstName);
  await expect(firstNameInput).toHaveValue(updatedFirstName);

  await page.getByRole('button', { name: 'Save' }).first().click();

  // Verify update
  await expect(page.getByText('Successfully Updated')).toBeVisible({ timeout: 15000 });
  await expect(firstNameInput).toHaveValue(updatedFirstName);
});
