# Test Strategy

## Test Layers

- Smoke: fast checks for critical regulated communication workflows.
- Regression: role permissions, validation, state transitions, and archive integrity.
- E2E: full business workflows across login, templates, campaigns, dashboard, and archive.
- External examples: non-blocking tests against public playground sites.

## Primary Business Flow

The first comparable Selenium and Playwright flow covers:

1. Comms Manager signs in.
2. Comms Manager creates a `Policy Renewal Notice` template.
3. Comms Manager submits it for approval.
4. Compliance Reviewer signs in.
5. Compliance Reviewer approves the template.
6. Comms Manager signs in again.
7. Comms Manager sends `Policy Renewal May 2026` to customers across Email, SMS, Portal, and Print.
8. Archive and Dashboard show sent communication evidence.

## Automation Standards

- Prefer stable `data-testid` selectors in the demo app.
- Keep waits explicit and behavior-driven.
- Put page interactions in page objects or screen objects.
- Keep test data centralized in `shared/test-data`.
- Keep Selenium and Playwright smoke flows comparable where practical.
- Do not make external-site tests mandatory for the main CI pipeline.
