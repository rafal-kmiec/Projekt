# Test Strategy

## Test Layers

- Smoke: fast checks for critical paths.
- Regression: broader UI behavior around core features.
- E2E: full business workflows across multiple screens.
- External examples: non-blocking tests against public playground sites.

## Primary Business Flows

- Login with valid, invalid, and locked users.
- Browse product list and product details.
- Filter and sort products.
- Add, update, and remove cart items.
- Complete checkout with form validation.
- Verify order confirmation.

## Automation Standards

- Prefer stable `data-testid` selectors in the demo app.
- Keep waits explicit and behavior-driven.
- Put page interactions in page objects or screen objects.
- Keep test data centralized in `shared/test-data`.
- Do not make external-site tests mandatory for the main CI pipeline.
