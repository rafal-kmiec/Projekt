# Tested Application Choice

The primary tested application is a local Dockerized demo app called `CommsFlow`.

`CommsFlow` is a fictional regulated customer communications platform. It is inspired by the enterprise domain of critical customer communication management, but it does not copy any real product.

## Why This Domain

A regulated communications platform gives richer automation scenarios than a generic shop:

- role-based access,
- approval workflows,
- multi-channel delivery,
- customer preferences,
- audit trails,
- archive records,
- compliance-focused dashboards.

## Why Own Demo App

- Stable UI and selectors for CI.
- Full control over users, customers, templates, campaigns, and reset state.
- Ability to create test-specific scenarios such as invalid credentials, pending approvals, missing approved templates, and archive search.
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
