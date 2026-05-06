# Selectors Contract

The demo app exposes stable `data-testid` attributes for all elements used by automated tests.

## Naming Rules

- Use business-oriented names, for example `template-create-button`, `campaign-send-button`, `archive-record-avery-brooks`.
- Do not bind tests to CSS classes used only for styling.
- Keep selector names stable across visual redesigns.
- Prefer role locators in Playwright when the accessible name is part of the product contract.
- Prefer `data-testid` selectors for dynamic workflow controls used by both Selenium and Playwright.

## Core Smoke Selectors

- `login-page`
- `username-input`
- `password-input`
- `login-submit`
- `nav-templates`
- `template-name-input`
- `template-create-button`
- `submit-template-policy-renewal-notice`
- `approve-template-policy-renewal-notice`
- `nav-campaigns`
- `campaign-template-select`
- `campaign-send-button`
- `nav-archive`
- `archive-record-avery-brooks`
- `nav-dashboard`
- `metric-sent-campaigns`
- `login-error`
- `template-permission-note`
- `manager-approval-blocked-policy-renewal-notice`
- `campaign-no-template-warning`
- `archive-search-input`
- `archive-empty-state`

