# CI/CD Plan

The CI pipeline should run on pull requests and pushes to the main branch.

## Main Jobs

- Build the Dockerized `demo-app`.
- Wait for `/health` to become ready.
- Run Playwright smoke tests.
- Run Selenium smoke tests.
- Upload reports and traces as artifacts.

## Optional Jobs

External-site tests should be manual or scheduled and non-blocking.
