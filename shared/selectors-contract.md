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
- `current-user`
- `current-permissions`
- `nav-dashboard`
- `nav-customers`
- `nav-templates`
- `nav-inbox`
- `template-name-input`
- `template-create-button`
- `template-card-policy-renewal-notice`
- `template-status-policy-renewal-notice`
- `submit-template-policy-renewal-notice`
- `approve-template-policy-renewal-notice`
- `nav-campaigns`
- `campaign-template-select`
- `campaign-send-button`
- `campaign-permission-warning`
- `customer-checkbox-cust-001`
- `customer-checkbox-cust-002`
- `customer-checkbox-cust-003`
- `customer-checkbox-cust-004`
- `nav-archive`
- `customers-page`
- `customer-row-cust-001`
- `customer-row-cust-002`
- `customer-row-cust-003`
- `customer-row-cust-004`
- `inbox-page`
- `archive-record-avery-brooks`
- `archive-record-maya-chen`
- `archive-record-nora-singh`
- `archive-record-elliot-ward`
- `channel-summary`
- `nav-dashboard`
- `metric-pending-templates`
- `metric-approved-templates`
- `metric-sent-campaigns`
- `metric-archive-records`
- `access-profile`
- `permission-list`
- `templates-empty-state`
- `template-details-policy-renewal-notice`
- `campaigns-empty-state`
- `campaign-details-policy-renewal-may-2026`
- `archive-initial-empty-state`
- `login-error`
- `template-permission-note`
- `manager-approval-blocked-policy-renewal-notice`
- `campaign-no-template-warning`
- `archive-search-input`
- `archive-empty-state`

