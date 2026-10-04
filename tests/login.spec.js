const { test, expect } = require('@playwright/test');

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    // Precondition: user is on the login page
    await page.goto('/');
  });

  test('TC-LOG-01: Successful login with valid credentials', async ({ page }) => {
    // Step 1: enter valid username
    await page.getByTestId('username').fill('standard_user');
    // Step 2: enter valid password
    await page.getByTestId('password').fill('secret_sauce');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: logged in and redirected to the product list page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('TC-LOG-02: Locked-out user cannot log in', async ({ page }) => {
    // Step 1: enter locked-out username
    await page.getByTestId('username').fill('locked_out_user');
    // Step 2: enter correct password
    await page.getByTestId('password').fill('secret_sauce');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: login fails, user stays on the login page, locked-out error shown
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('locked out');
  });

 test('TC-LOG-03: Login with empty username', async ({ page }) => {
    // Step 1: Leave username empty
    await page.getByTestId('username').fill('');
    // Step 2: enter correct password
    await page.getByTestId('password').fill('secret_sauce');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: login fails, user stays on the login page, username error shown
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username is required');
  });

 test('TC-LOG-04: Login with empty password', async ({ page }) => {
    // Step 1: Enter correct username
    await page.getByTestId('username').fill('standard_user');
    // Step 2: Leave password empty
    await page.getByTestId('password').fill('');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: login fails, user stays on the login page, password error shown
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Password is required');
  });

 test('TC-LOG-05: Login with both fields empty', async ({ page }) => {
    // Step 1: Leave username empty
    await page.getByTestId('username').fill('');
    // Step 2: Leave password empty
    await page.getByTestId('password').fill('');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: login fails, user stays on the login page, username error shown
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username is required');
  });

 test('TC-LOG-06: Login with incorrect password', async ({ page }) => {
    // Step 1: enter correct username
    await page.getByTestId('username').fill('standard_user');
    // Step 2: enter incorrect password
    await page.getByTestId('password').fill('secret_auce');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: login fails, user stays on the login page, password error shown
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('password do not match');
  });
  
 test('TC-LOG-07: Username and password with leading/trailing spaces', async ({ page }) => {
    // Step 1: enter username with leading and trailing spaces
    await page.getByTestId('username').fill(' standard_user ');
    // Step 2: enter correct password
    await page.getByTestId('password').fill('secret_sauce');
    // Step 3: click Login
    await page.getByTestId('login-button').click();

    // Expected: login fails, user stays on the login page, mismatch error shown
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('do not match');
  });

});