const { test, expect } = require("@playwright/test");

test.describe("Cart", () => {
  test.beforeEach(async ({ page }) => {
    // Precondition: user is logged in and the cart is empty
    await page.goto("/");
    await page.getByTestId("username").fill("standard_user");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL(/inventory/);
  });

  test("TC-CRT-01: Cart icon display when an item is added", async ({
    page,
  }) => {
    // Step 1: add the backpack
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();

    // Expected: button changes to Remove and the badge shows 1
    await expect(page.getByTestId("remove-sauce-labs-backpack")).toHaveText(
      "Remove",
    );
    await expect(
      page.getByTestId("add-to-cart-sauce-labs-backpack"),
    ).toHaveCount(0);
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
  });

  test("TC-CRT-02: Cart icon display when multiple items are added", async ({
    page,
  }) => {
    const badge = page.getByTestId("shopping-cart-badge");

    // Step 1: add Product A
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await expect(badge).toHaveText("1");

    // Step 2: add Product B
    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();

    // Expected: badge shows 2 and both items are in the cart view
    await expect(badge).toHaveText("2");
    await page.getByTestId("shopping-cart-link").click();
    const cartNames = await page
      .getByTestId("inventory-item-name")
      .allTextContents();
    expect(cartNames).toHaveLength(2);
    expect(cartNames).toContain("Sauce Labs Backpack");
    expect(cartNames).toContain("Sauce Labs Bike Light");
  });

  test("TC-CRT-03: Remove a product from the cart view", async ({ page }) => {
    // Precondition: two items added, user is on the cart page
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();
    await page.getByTestId("shopping-cart-link").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");

    // Step 2: click Remove next to the backpack
    await page.getByTestId("remove-sauce-labs-backpack").click();

    // Expected: item gone from the list, badge decrements to 1
    const cartNames = await page
      .getByTestId("inventory-item-name")
      .allTextContents();
    expect(cartNames).toEqual(["Sauce Labs Bike Light"]);
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
  });

  test("TC-CRT-04: Remove product directly from product list page", async ({
    page,
  }) => {
    // Precondition: two items added, user stays on the product list
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");

    // Step 1: click Remove on the backpack card
    await page.getByTestId("remove-sauce-labs-backpack").click();

    // Expected: button reverts to Add to cart, badge decrements
    await expect(
      page.getByTestId("add-to-cart-sauce-labs-backpack"),
    ).toHaveText("Add to cart");
    await expect(page.getByTestId("remove-sauce-labs-backpack")).toHaveCount(0);
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
  });

  test("TC-CRT-05: Remove all items from cart", async ({ page }) => {
    // Precondition: 1 item in the cart
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");

    // Step 1: click Remove
    await page.getByTestId("remove-sauce-labs-backpack").click();

    // Expected: cart is empty and the badge disappears
    await expect(page.getByTestId("shopping-cart-badge")).toHaveCount(0);
    await page.getByTestId("shopping-cart-link").click();
    await expect(page.getByTestId("inventory-item")).toHaveCount(0);
  });

  test("TC-CRT-06: Add all available products on the page to cart", async ({
    page,
  }) => {
    // Every Add to cart button has a data-test that starts with add-to-cart
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    const totalProducts = await addButtons.count();
    expect(totalProducts).toBeGreaterThan(0);

    // Step 1: click Add to cart on every product, one after another
    for (let i = 0; i < totalProducts; i++) {
      await addButtons.first().click();
    }

    // Expected: badge equals the number of products
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText(
      String(totalProducts),
    );
    await expect(addButtons).toHaveCount(0);
  });

  test("TC-CRT-07: Persistence of cart across page navigation", async ({
    page,
  }) => {
    // Precondition: 1 product in the cart
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();

    // Step 1: go to the cart
    await page.getByTestId("shopping-cart-link").click();
    await expect(page).toHaveURL(/cart/);

    // Step 2: go back to the product list
    await page.getByTestId("continue-shopping").click();
    await expect(page).toHaveURL(/inventory/);

    // Expected: badge still 1 and the item still shows Remove
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
    await expect(page.getByTestId("remove-sauce-labs-backpack")).toBeVisible();
  });
});
