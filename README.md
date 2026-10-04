# SauceDemo Test Automation with AI-Assisted Test Design

![Playwright Tests](https://github.com/Prakhar10101/saucedemo-playwright-ai/actions/workflows/playwright.yml/badge.svg)

## Problem
Writing test cases from requirements is repetitive, and automation coverage is often thin.
This project tests how useful an LLM is for the first step, then automates the verified
cases so they run on every commit.

## What I built
- Written requirements for four features of saucedemo.com: Login, Product list, Cart, Checkout
- 29 test cases drafted by an LLM (Gemini Pro), each one checked by hand against the live site
- [30] automated Playwright tests covering all 29 cases
- A GitHub Actions pipeline that runs the full suite on every push

## Results
| Verdict on AI-generated cases | Count | Share |
|---|---|---|
| Usable as written | [19] | [66%] |
| Edited | [9] | [31%] |
| Wrong | [1] | [3%] |

- [28 of 29] cases (97%) were correct or needed only light edits.
- 1 AI-generated case exposed a real defect: checkout can be started with an empty cart (see [bugs.md](bugs.md)).
- The AI struggled with vague expected results, guessing the real app's behaviour, and false preconditions. Details in [ai-evaluation.md](ai-evaluation.md).

## Documents in this repo
| File | Purpose |
|---|---|
| requirements.md | Requirements given to the AI |
| ai-generated-test-cases.md | Raw AI output, untouched |
| approved-test-cases.md | Cases after my review and fixes |
| Verdict.csv | My verdict on every AI-generated case |
| ai-evaluation.md | Findings, limits and conclusion |
| bugs.md | Defects found |
| tests/ | Playwright specs, named by test case ID (for example TC-LOG-01) |

## Tech
Playwright, JavaScript, Node.js, GitHub Actions, Gemini Pro (test case drafting)

## How to run
1. git clone https://github.com/Prakhar10101/saucedemo-playwright-ai.git
2. cd saucedemo-playwright-ai
3. npm install
4. npx playwright install chromium
5. npx playwright test
6. npx playwright show-report

## Limitations
- Small sample: 29 cases, one model, one application.
- SauceDemo is a widely documented practice site, so the AI may have done better here than on a lesser-known app.
- Rapid-sort testing (TC-PL-07) runs actions back to back, but it does not simulate real network delays.
- TC-CHK-08 is marked as an expected failure (test.fail) because it documents a known app bug.

## What I learned

**AI-written test cases are fast, but they need a careful review.** Gemini (3.8 Flash) produced 29 test cases very quickly, and I still checked each one against the live site. 19 were usable as written, 9 needed small edits, and only 1 was wrong. The edits were mostly because the expected results were vague or the AI guessed how the app behaves. The output depends on the prompt, so a clearer prompt with more detail about the app would likely mean fewer mistakes.

**Model choice.** For the next project I would use Claude or ChatGPT to generate test cases, since their output is more concise and thorough. They are not faster than Gemini. I only ran Gemini in this project, so this is a preference and not something I measured.

**The code was hard at first.** I was new to automation, so writing and understanding the tests took time. These are the problems I ran into:
- I ran the tests from the parent folder instead of the project folder more than once. This gave confusing errors such as "No tests found" and "test.describe() was not expected here".
- I forgot to close a test.describe block with `});`, which stopped the whole file from running.
- One test checked for text that was not in the real error message, so it failed.
- Understanding what each line of code does took time.

These problems taught me to read the full error message first, then check the basics: the folder I am in, missing brackets, and the exact text on the page.

### Conclusion

AI saves time on a first draft of test cases, but a person still has to verify them against the real product. Here the AI was mostly right, and its mistakes were small and easy to find once I tested by hand. One of its cases also led me to a real bug in the app. Automation was harder than I expected at the start, but the suite now runs on every commit, and I can explain how each part works.
