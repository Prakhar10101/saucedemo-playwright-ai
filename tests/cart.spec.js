const { test, expect } = require("flake--radar/src/fixture");

test.describe("Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("username").fill("standard_user");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL(/inventory/);
  });

  test("TC-CRT-01: Cart icon display when an item is added", async ({
    page,
  }) => {
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();

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
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await expect(badge).toHaveText("1");

    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();

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
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();
    await page.getByTestId("shopping-cart-link").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");

    await page.getByTestId("remove-sauce-labs-backpack").click();
    const cartNames = await page
      .getByTestId("inventory-item-name")
      .allTextContents();
    expect(cartNames).toEqual(["Sauce Labs Bike Light"]);
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
  });

  test("TC-CRT-04: Remove product directly from product list page", async ({
    page,
  }) => {
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");

    await page.getByTestId("remove-sauce-labs-backpack").click();
    await expect(
      page.getByTestId("add-to-cart-sauce-labs-backpack"),
    ).toHaveText("Add to cart");
    await expect(page.getByTestId("remove-sauce-labs-backpack")).toHaveCount(0);
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
  });

  test("TC-CRT-05: Remove all items from cart", async ({ page }) => {
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");

    await page.getByTestId("remove-sauce-labs-backpack").click();
    await expect(page.getByTestId("shopping-cart-badge")).toHaveCount(0);
    await page.getByTestId("shopping-cart-link").click();
    await expect(page.getByTestId("inventory-item")).toHaveCount(0);
  });

  test("TC-CRT-06: Add all available products on the page to cart", async ({
    page,
  }) => {
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    const totalProducts = await addButtons.count();
    expect(totalProducts).toBeGreaterThan(0);

    for (let i = 0; i < totalProducts; i++) {
      await addButtons.first().click();
    }
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText(
      String(totalProducts),
    );
    await expect(addButtons).toHaveCount(0);
  });

  test("TC-CRT-07: Persistence of cart across page navigation", async ({
    page,
  }) => {
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    await page.getByTestId("shopping-cart-link").click();
    await expect(page).toHaveURL(/cart/);

    await page.getByTestId("continue-shopping").click();
    await expect(page).toHaveURL(/inventory/);

    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
    await expect(page.getByTestId("remove-sauce-labs-backpack")).toBeVisible();
  });
});
