# CI/CD Plan

The CI pipeline should run on pull requests and pushes to the main branch.

## Main Jobs

- Build the Dockerized `demo-app`.
- Wait for `/health` to become ready.
- Run the demo app TypeScript build inside the container.
- Run Playwright smoke tests.
- Run Selenium smoke tests.
- Upload Playwright reports, traces, screenshots, videos, and Selenium JUnit output as artifacts.

## Optional Jobs

External-site tests should be manual or scheduled and non-blocking.

Regression suites are available locally and can be promoted to CI when they remain stable enough for PR gating.
