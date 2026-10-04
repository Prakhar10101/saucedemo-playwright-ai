# QA Test Cases: E-Commerce Web Application

## Assumptions

- **Authentication Persistence & Session:** The application maintains the session state across the product list, cart, and checkout workflows once a user is authenticated.
- **Invalid Credentials Handling:** Providing an unrecognized username or incorrect password triggers a generic authentication error similar to the locked-out state.
- **Cart Badge Behavior:** When the cart count reaches zero, the cart badge disappears completely.
- **Checkout Navigation & Payment:** Entering valid personal details and proceeding leads to an order review or immediate completion screen where the confirmation message is displayed, without an explicit multi-step payment gateway specified.
- **Product Multiples:** Clicking "Add to cart" on distinct items increments the badge count by 1 per item added; removing an item decrements the count accordingly.

---

## 1. Feature: Login

### TC-LOG-01: Successful login with valid credentials

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is on the login page; account exists and is active.
- **Steps:**
  1. Enter valid username.
  2. Enter valid password.
  3. Click "Login".
- **Expected Result:** User is logged in and redirected to the product list page.

---

### TC-LOG-02: Locked-out user cannot log in

- **Type:** Negative | **Priority:** High
- **Preconditions:** User account is set to locked-out state.
- **Steps:**
  1. Enter locked-out username.
  2. Enter correct password.
  3. Click "Login".
- **Expected Result:** Login fails; user remains on the login page and an error message indicating the account is locked is displayed.

---

### TC-LOG-03: Login with empty username

- **Type:** Negative | **Priority:** High
- **Preconditions:** User is on the login page.
- **Steps:**
  1. Leave username field blank.
  2. Enter valid password.
  3. Click "Login".
- **Expected Result:** Login fails; a validation error indicating username is required is shown.

---

### TC-LOG-04: Login with empty password

- **Type:** Negative | **Priority:** High
- **Preconditions:** User is on the login page.
- **Steps:**
  1. Enter valid username.
  2. Leave password field blank.
  3. Click "Login".
- **Expected Result:** Login fails; a validation error indicating password is required is shown.

---

### TC-LOG-05: Login with both fields empty

- **Type:** Negative | **Priority:** Medium
- **Preconditions:** User is on the login page.
- **Steps:**
  1. Leave both username and password fields blank.
  2. Click "Login".
- **Expected Result:** Login fails; a validation error indicating credentials are required is shown.

---

### TC-LOG-06: Login with incorrect password

- **Type:** Negative | **Priority:** High
- **Preconditions:** User is on the login page; valid username exists.
- **Steps:**
  1. Enter valid username.
  2. Enter an incorrect password.
  3. Click "Login".
- **Expected Result:** Login fails; an error message stating invalid username/password is displayed.

---

### TC-LOG-07: Username and password with leading/trailing spaces

- **Type:** Negative | **Priority:** Low
- **Preconditions:** User is on the login page; account exists.
- **Steps:**
  1. Enter valid username with leading/trailing spaces.
  2. Enter valid password.
  3. Click "Login".
- **Expected Result:** User gets a validation error and is not able to login.

---

## 2. Feature: Product List

### TC-PL-01: Sort products by Name (A to Z)

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is logged in and on the product list page with multiple items loaded.
- **Steps:**
  1. Click the sort dropdown.
  2. Select "Name (A to Z)".
- **Expected Result:** Product cards reorder alphabetically in ascending order by title (A to Z).

---

### TC-PL-02: Sort products by Name (Z to A)

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is logged in and on the product list page.
- **Steps:**
  1. Click the sort dropdown.
  2. Select "Name (Z to A)".
- **Expected Result:** Product cards reorder alphabetically in descending order by title (Z to A).

---

### TC-PL-03: Sort products by Price (low to high)

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is logged in and on the product list page.
- **Steps:**
  1. Click the sort dropdown.
  2. Select "Price (low to high)".
- **Expected Result:** Products are sorted numerically in ascending order by price (lowest price first).

---

### TC-PL-04: Sort products by Price (high to low)

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is logged in and on the product list page.
- **Steps:**
  1. Click the sort dropdown.
  2. Select "Price (high to low)".
- **Expected Result:** Products are sorted numerically in descending order by price (highest price first).

---

### TC-PL-05: Sort products with identical prices

- **Type:** Edge | **Priority:** Medium
- **Preconditions:** User is logged in; catalogue contains two or more items with the exact same price.
- **Steps:**
  1. Select "Price (low to high)".
  2. Verify item placement.
  3. Select "Price (high to low)".
- **Expected Result:** Sorting executes without crashing or duplicating cards; secondary tie-breaker remains consistent.

---

### TC-PL-06: Name sorting keeps every item once and Z-A mirrors A-Z

- **Type:** Edge | **Priority:** Low
- **Preconditions:** User is logged in; catalogue contains items with identical starting letters or names.
- **Steps:**
  1. Select "Name (A to Z)".
  2. Select "Name (Z to A)".
- **Expected Result:** Items are grouped predictably without layout disruption or UI errors.

---

### TC-PL-07: Rapid sequential sort changes

- **Type:** Edge | **Priority:** Low
- **Preconditions:** User is logged in and on the product list page.
- **Steps:**
  1. Quickly switch sort options between A-Z, High-Low, and Low-High in rapid succession.
- **Expected Result:** The view updates smoothly to reflect the final selected sort criteria without UI race conditions.

---

## 3. Feature: Cart

### TC-CRT-01: Cart icon display when an item is added

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is logged in and cart is empty.
- **Steps:**
  1. Click "Add to cart" on an item on the product page.
- **Expected Result:** Item button updates state and cart badge displays `1`.

---

### TC-CRT-02: Cart icon display when multiple items are added

- **Type:** Positive | **Priority:** High
- **Preconditions:** User is logged in and cart is empty.
- **Steps:**
  1. Click "Add to cart" on Product A.
  2. Click "Add to cart" on Product B.
- **Expected Result:** Cart badge increments with each addition, displaying `2`. Both items appear inside the cart view.

---

### TC-CRT-03: Remove a product from the cart view

- **Type:** Positive | **Priority:** High
- **Preconditions:** User has at least two items added to the cart; user navigates to cart page.
- **Steps:**
  1. Open the cart page.
  2. Click "Remove" next to the product.
- **Expected Result:** The item is removed from the cart list; the cart badge count decrements by 1.

---

### TC-CRT-04: Remove product directly from product list page

- **Type:** Positive | **Priority:** Medium
- **Preconditions:** User has added an item; remains on the product list page.
- **Steps:**
  1. Click "Remove" on the already-added item card.
- **Expected Result:** The button reverts to "Add to cart"; the cart badge decrements accordingly.

---

### TC-CRT-05: Remove all items from cart

- **Type:** Edge | **Priority:** Medium
- **Preconditions:** User has 1 item in the cart.
- **Steps:**
  1. Click "Remove" on the item.
- **Expected Result:** Cart becomes empty; the cart badge number disappears.

---

### TC-CRT-06: Add all available products on the page to cart

- **Type:** Edge | **Priority:** Medium
- **Preconditions:** User is logged in; cart is empty.
- **Steps:**
  1. Click "Add to cart" on every visible product sequentially.
- **Expected Result:** Cart badge displays the total count equal to the number of available products.

---

### TC-CRT-07: Persistence of cart across page navigation

- **Type:** Positive | **Priority:** Medium
- **Preconditions:** User is logged in; 1 product added to cart.
- **Steps:**
  1. Navigate from product list to cart.
  2. Navigate back to product list.
- **Expected Result:** Cart badge consistently shows `1`; item retains its added state.

---

## 4. Feature: Checkout

### TC-CHK-01: Successful checkout submission

- **Type:** Positive | **Priority:** High
- **Preconditions:** User has items in cart and is on the checkout information page.
- **Steps:**
  1. Enter valid First Name.
  2. Enter valid Last Name.
  3. Enter valid Postal Code.
  4. Submit and complete order.
- **Expected Result:** Order completes successfully and a confirmation message is displayed.

---

### TC-CHK-02: Checkout with empty First Name

- **Type:** Negative | **Priority:** High
- **Preconditions:** User is on the checkout page.
- **Steps:**
  1. Leave First Name empty.
  2. Enter valid Last Name.
  3. Enter valid Postal Code.
  4. Click "Continue".
- **Expected Result:** Form submission is blocked; an error indicating First Name is required is displayed.

---

### TC-CHK-03: Checkout with empty Last Name

- **Type:** Negative | **Priority:** High
- **Preconditions:** User is on the checkout page.
- **Steps:**
  1. Enter valid First Name.
  2. Leave Last Name empty.
  3. Enter valid Postal Code.
  4. Click "Continue".
- **Expected Result:** Form submission is blocked; an error indicating Last Name is required is displayed.

---

### TC-CHK-04: Checkout with empty Postal Code

- **Type:** Negative | **Priority:** High
- **Preconditions:** User is on the checkout page.
- **Steps:**
  1. Enter valid First Name.
  2. Enter valid Last Name.
  3. Leave Postal Code empty.
  4. Click "Continue".
- **Expected Result:** Form submission is blocked; an error indicating Postal Code is required is displayed.

---

### TC-CHK-05: Checkout with all fields empty

- **Type:** Negative | **Priority:** Medium
- **Preconditions:** User is on the checkout page.
- **Steps:**
  1. Leave First Name, Last Name, and Postal Code empty.
  2. Click "Continue".
- **Expected Result:** Form submission is blocked; First name error is displayed.

---

### TC-CHK-06: Checkout with alphanumeric and hyphenated postal code

- **Type:** Edge | **Priority:** Medium
- **Preconditions:** User is on the checkout page.
- **Steps:**
  1. Enter valid First Name.
  2. Enter valid Last Name.
  3. Enter an alphanumeric or hyphenated postal code (e.g., `SW1A 1AA` or `94103-1234`).
  4. Click "Continue".
- **Expected Result:** Postal code format is accepted without validation failure.

---

### TC-CHK-07: Checkout with special characters in name fields

- **Type:** Edge | **Priority:** Low
- **Preconditions:** User is on the checkout page.
- **Steps:**
  1. Enter name with accents or hyphens (e.g., `Renée-Noël`).
  2. Enter valid Last Name and Postal Code.
  3. Click "Continue".
- **Expected Result:** Special characters are handled properly without encoding issues or UI breakage.

---

### TC-CHK-08: Attempt checkout with an empty cart

- **Type:** Edge | **Priority:** Medium
- **Preconditions:** User is logged in; cart contains 0 items.
- **Steps:**
  1. Navigate to checkout URL directly or click checkout if accessible.
  2. Attempt to proceed.
- **Expected Result:** Application prevents checkout progression or displays an empty cart warning message.
