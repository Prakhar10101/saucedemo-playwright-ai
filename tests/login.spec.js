const { test, expect } = require("flake--radar/src/fixture");

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-LOG-01: Successful login with valid credentials", async ({
    page,
  }) => {
    await page.getByTestId("username").fill("standard_user");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId("title")).toHaveText("Products");
  });

  test("TC-LOG-02: Locked-out user cannot log in", async ({ page }) => {
    await page.getByTestId("username").fill("locked_out_user");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(page.getByTestId("error")).toContainText("locked out");
  });

  test("TC-LOG-03: Login with empty username", async ({ page }) => {
    await page.getByTestId("username").fill("");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(page.getByTestId("error")).toContainText(
      "Username is required",
    );
  });

  test("TC-LOG-04: Login with empty password", async ({ page }) => {
    await page.getByTestId("username").fill("standard_user");
    await page.getByTestId("password").fill("");
    await page.getByTestId("login-button").click();
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(page.getByTestId("error")).toContainText(
      "Password is required",
    );
  });

  test("TC-LOG-05: Login with both fields empty", async ({ page }) => {
    await page.getByTestId("username").fill("");
    await page.getByTestId("password").fill("");
    await page.getByTestId("login-button").click();
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(page.getByTestId("error")).toContainText(
      "Username is required",
    );
  });

  test("TC-LOG-06: Login with incorrect password", async ({ page }) => {
    await page.getByTestId("username").fill("standard_user");
    await page.getByTestId("password").fill("secret_auce");
    await page.getByTestId("login-button").click();
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(page.getByTestId("error")).toContainText(
      "password do not match",
    );
  });

  test("TC-LOG-07: Username and password with leading/trailing spaces", async ({
    page,
  }) => {
    await page.getByTestId("username").fill(" standard_user ");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(page.getByTestId("error")).toContainText("do not match");
  });
});
