const { test, expect } = require("flake--radar/src/fixture");

async function getPrices(page) {
  const texts = await page
    .getByTestId("inventory-item-price")
    .allTextContents();
  return texts.map((t) => parseFloat(t.replace("$", "")));
}

async function getNames(page) {
  return page.getByTestId("inventory-item-name").allTextContents();
}

test.describe("Product list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("username").fill("standard_user");
    await page.getByTestId("password").fill("secret_sauce");
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL(/inventory/);
  });

  test("TC-PL-01: Sort products by Name (A to Z)", async ({ page }) => {
    await page.getByTestId("product-sort-container").selectOption("az");
    const names = await page
      .getByTestId("inventory-item-name")
      .allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test("TC-PL-02: Sort products by Name (Z to A)", async ({ page }) => {
    await page.getByTestId("product-sort-container").selectOption("za");
    const names = await page
      .getByTestId("inventory-item-name")
      .allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test("TC-PL-03: Sort products by Price (low to high)", async ({ page }) => {
    await page.getByTestId("product-sort-container").selectOption("lohi");
    const texts = await page
      .getByTestId("inventory-item-price")
      .allTextContents();
    const prices = texts.map((t) => parseFloat(t.replace("$", "")));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("TC-PL-04: Sort products by Price (high to low)", async ({ page }) => {
    await page.getByTestId("product-sort-container").selectOption("hilo");
    const texts = await page
      .getByTestId("inventory-item-price")
      .allTextContents();
    const prices = texts.map((t) => parseFloat(t.replace("$", "")));
    const sorted = [...prices].sort((a, b) => a - b).reverse();
    expect(prices).toEqual(sorted);
  });

  test("TC-PL-05: Sort products with identical prices", async ({ page }) => {
    const sortBox = page.getByTestId("product-sort-container");
    const defaultPrices = await getPrices(page);
    const totalItems = defaultPrices.length;
    expect(new Set(defaultPrices).size).toBeLessThan(totalItems);

    await sortBox.selectOption("lohi");

    const lowHighPrices = await getPrices(page);
    const lowHighNames = await getNames(page);
    expect(lowHighPrices).toEqual([...lowHighPrices].sort((a, b) => a - b));
    expect(lowHighNames).toHaveLength(totalItems);
    expect(new Set(lowHighNames).size).toBe(totalItems);

    await sortBox.selectOption("hilo");
    const highLowPrices = await getPrices(page);
    const highLowNames = await getNames(page);
    expect(highLowPrices).toEqual([...highLowPrices].sort((a, b) => b - a));
    expect(highLowNames).toHaveLength(totalItems);
    expect(new Set(highLowNames).size).toBe(totalItems);

    await sortBox.selectOption("lohi");
    const lowHighNamesAgain = await getNames(page);
    expect(lowHighNamesAgain).toEqual(lowHighNames);
  });

  test("TC-PL-06: Name sorting keeps every item once and Z-A mirrors A-Z", async ({
    page,
  }) => {
    const sortBox = page.getByTestId("product-sort-container");
    const defaultNames = await getNames(page);
    expect(new Set(defaultNames).size).toBe(defaultNames.length);
    await sortBox.selectOption("az");
    const azNames = await getNames(page);
    expect(azNames).toEqual([...azNames].sort());
    expect(azNames).toHaveLength(defaultNames.length);
    await sortBox.selectOption("za");
    const zaNames = await getNames(page);
    expect(zaNames).toEqual([...azNames].reverse());
  });

  test("TC-PL-07: Rapid sequential sort changes", async ({ page }) => {
    const sortBox = page.getByTestId("product-sort-container");
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const startingCount = (await getNames(page)).length;
    for (const option of ["az", "hilo", "lohi", "za", "hilo", "lohi"]) {
      await sortBox.selectOption(option);
    }
    await expect(sortBox).toHaveValue("lohi");
    const prices = await getPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(await getNames(page)).toHaveLength(startingCount);
    expect(pageErrors).toEqual([]);
  });
});
