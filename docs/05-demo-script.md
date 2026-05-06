# Demo Script

Use this script to present the project in about 10 minutes.

## 1. Start The Project

```powershell
.\scripts\setup.ps1
.\scripts\test-smoke.ps1
```

Open:

```text
http://localhost:5173
```

Explain that the app is Dockerized and the same target is used locally and in CI.

## 2. Show The CommsFlow Product Flow

1. Sign in as `comms_manager` with password `commsflow123`.
2. Show Dashboard metrics, Access profile, and Compliance alerts.
3. Open Templates and create `Policy Renewal Notice`.
4. Expand Template details and point out the approval policy.
5. Submit the template for approval.
6. Show that the manager cannot approve it.
7. Log out and sign in as `compliance_reviewer`.
8. Show that the reviewer cannot create templates.
9. Approve the pending template.
10. Log back in as `comms_manager`.
11. Open Campaigns and send `Policy Renewal May 2026`.
12. Expand Campaign details and point out archive/audit evidence.
13. Open Archive and search for `POL-33810`.
14. Show Dashboard audit trail and sent metrics.

## 3. Show The Test Automation

Open the comparable tests:

- Playwright TypeScript: `tests/playwright-ts/tests/smoke` and `tests/playwright-ts/tests/regression`
- Selenium Python: `tests/selenium-python/tests/smoke` and `tests/selenium-python/tests/regression`

Run:

```powershell
.\scripts\test-smoke.ps1
.\scripts\run-regression.ps1
```

Explain that smoke is the PR gate and regression is the broader confidence layer.

## 4. Show AI Workflow Assets

Open:

```text
prompts/examples/archive-search-by-policy-workflow.md
```

Walk through:

- business requirement,
- analyst output,
- test architect output,
- implementation prompt,
- reviewer checklist.

## 5. Show CI And Reports

In GitHub Actions, open the latest `CI` run for the branch.

Expected artifacts:

- `playwright-report`
- `selenium-smoke-report`

Explain that external public-site tests are intentionally not part of the mandatory PR gate.
