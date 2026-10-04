# AI Test Case Evaluation

**Model:** Gemini 3.8 flash
**Input:** requirements.md (4 features: Login, Product list, Cart, Checkout)
**Output:** 29 test cases (raw output saved untouched in ai-generated-test-cases.md)

## Method

I ran every test case against the live site (saucedemo.com) by hand and gave
it one verdict: Usable, Edited, Wrong, or Usable but exposed a bug.
Full sheet: Verdict.csv

## Results

| Verdict           | Count | %   |
| ----------------- | ----- | --- |
| Usable as written | 19    | 66% |
| Edited            | 9     | 31% |
| Wrong             | 1     | 3%  |

(The 19 usable cases include 1 that exposed a real app defect, BUG-001.)

## What the AI did well

- Produced broad first-draft coverage (positive, negative and edge cases) in one pass.
- Suggested edge cases I might not have written myself, such as checkout with an empty cart.
- 28 of 29 cases were correct or needed only light edits.

## Where it fell short

1. Vague expected results (PL-07, CRT-01, CRT-02, CHK-05, CHK-07), such as 'without UI breakage'.
2. Guessing the real app's behaviour (LOG-07, CRT-05).
3. False preconditions (PL-06 assumed duplicate product names; CRT-03 needed two items).

## Defect found

- BUG-001: checkout can start with an empty cart (from TC-CHK-08). See bugs.md.

## Limitations

- Small sample: 29 cases, one model, one application.
- SauceDemo is a widely documented practice site, so results may not carry over
  to a less public application.
- Verdicts are my own judgement, made by testing the site manually.

## Conclusion

AI was a fast, useful first draft, but every case still needed checking against
the real product, and a quarter of them needed fixes before they could be automated.
