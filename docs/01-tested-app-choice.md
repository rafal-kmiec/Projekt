# Tested Application Choice

The primary tested application will be a local Dockerized demo app called `QA Shop`.

## Why Own Demo App

- Stable UI and selectors for CI.
- Full control over users, products, orders, and reset state.
- Ability to create test-specific scenarios such as locked users, validation errors, slow responses, and empty states.
- Same target can be tested by Selenium Python and Playwright JS.

## Why Docker

- Same startup path locally and in CI.
- No dependency on the developer machine's Node setup for running the app.
- Easy reset between test runs.
- Clean future path for adding mock APIs or databases.

## Public Sites As Optional Examples

Public test-practice sites are useful for learning and comparison, but they are not reliable enough as the core CI dependency.

Candidate optional targets:

- The Internet: https://the-internet.herokuapp.com/
- ExpandTesting Practice: https://practice.expandtesting.com/
- QA Playground: https://www.qaplayground.com/
- Automation Exercise: https://automationexercise.com/
- DemoBlaze: https://www.demoblaze.com/

These examples should run in a separate workflow or manual job.
