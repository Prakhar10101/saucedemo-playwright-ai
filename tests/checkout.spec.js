const { test, expect } = require("@playwright/test");

// Helpers: shared steps written once
async function login(page) {
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();
  await expect(page).toHaveURL(/inventory/);
}

async function fillCheckoutForm(page, firstName, lastName, postalCode) {
  await page.getByTestId("firstName").fill(firstName);
  await page.getByTestId("lastName").fill(lastName);
  await page.getByTestId("postalCode").fill(postalCode);
}

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Precondition: logged in, item in cart, on the checkout information page
    await login(page);
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await page.getByTestId("shopping-cart-link").click();
    await page.getByTestId("checkout").click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test("TC-CHK-01: Successful checkout submission", async ({ page }) => {
    // Steps 1-3: enter valid details
    await fillCheckoutForm(page, "Prakhar", "Lakhera", "110075");
    // Step 4: continue to the overview, then finish the order
    await page.getByTestId("continue").click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await page.getByTestId("finish").click();

    // Expected: order completes and a confirmation message is shown
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId("complete-header")).toHaveText(
      "Thank you for your order!",
    );
  });

  test("TC-CHK-02: Checkout with empty First Name", async ({ page }) => {
    await fillCheckoutForm(page, "", "Lakhera", "110075");
    await page.getByTestId("continue").click();

    // Expected: submission blocked, First Name error shown
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId("error")).toContainText(
      "First Name is required",
    );
  });

  test("TC-CHK-03: Checkout with empty Last Name", async ({ page }) => {
    await fillCheckoutForm(page, "Prakhar", "", "110075");
    await page.getByTestId("continue").click();

    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId("error")).toContainText(
      "Last Name is required",
    );
  });

  test("TC-CHK-04: Checkout with empty Postal Code", async ({ page }) => {
    await fillCheckoutForm(page, "Prakhar", "Lakhera", "");
    await page.getByTestId("continue").click();

    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId("error")).toContainText(
      "Postal Code is required",
    );
  });

  test("TC-CHK-05: Checkout with all fields empty", async ({ page }) => {
    await page.getByTestId("continue").click();

    // Expected: blocked; the app reports the first missing field
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId("error")).toContainText(
      "First Name is required",
    );
  });

  // One test is generated for each postal code in this list
  for (const postalCode of ["SW1A 1AA", "94103-1234"]) {
    test(`TC-CHK-06: Postal code format accepted (${postalCode})`, async ({
      page,
    }) => {
      await fillCheckoutForm(page, "Prakhar", "Lakhera", postalCode);
      await page.getByTestId("continue").click();

      // Expected: accepted without a validation failure
      await expect(page.getByTestId("error")).toHaveCount(0);
      await expect(page).toHaveURL(/checkout-step-two/);
    });
  }

  test("TC-CHK-07: Special characters in name fields", async ({ page }) => {
    await fillCheckoutForm(page, "Renée-Noël", "Lakhera", "110075");

    // Expected: the field keeps the characters exactly as typed
    await expect(page.getByTestId("firstName")).toHaveValue("Renée-Noël");
    await page.getByTestId("continue").click();

    // ...and the app accepts them
    await expect(page.getByTestId("error")).toHaveCount(0);
    await expect(page).toHaveURL(/checkout-step-two/);
  });
});

test.describe("Checkout with an empty cart", () => {
  test("TC-CHK-08: Attempt checkout with an empty cart", async ({ page }) => {
    // Known bug BUG-001: the app lets users start checkout with 0 items.
    // This test asserts the CORRECT behaviour, so it is expected to fail until the bug is fixed.
    test.fail(true, "Known bug BUG-001: checkout allowed with an empty cart");

    // Precondition: logged in, cart empty
    await login(page);

    // Steps: open the cart and try to proceed
    await page.getByTestId("shopping-cart-link").click();
    await page.getByTestId("checkout").click();

    // Expected: checkout is blocked
    await expect(page).not.toHaveURL(/checkout-step-one/);
  });
});
