BUG-001: Checkout can be started with an empty cart
Severity: Low to Medium
Environment: saucedemo.com, Chrome, standard_user
Steps to reproduce:

1. Log in as standard_user.
2. Without adding any items, click the cart icon.
3. Click Checkout.
   Expected: Checkout is blocked or a message says the cart is empty.
   Actual: The checkout form opens and the user can continue.
   Notes: Found via AI-generated test case TC-CHK-08; automated test marked test.fail until fixed.
