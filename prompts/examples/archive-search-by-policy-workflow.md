# Example AI Workflow: Archive Search By Policy Number

## Business Requirement

Compliance reviewers and communications managers must be able to find sent communication evidence in the archive by policy number. Searching for `POL-33810` should show Nora Singh's portal delivery record and hide unrelated customers.

## Analyst Agent Output

- Business rule: archive search covers customer name, policy number, campaign, channel, and status.
- Happy path: after a sent campaign, searching by an existing policy shows exactly the matching record.
- Edge case: searching for a non-existing channel or policy shows an empty state.
- Risk: tests should not rely on visual order; assert record visibility and hidden unrelated records.
- Test data: `POL-33810`, customer `Nora Singh`, channel `Portal`.

## Test Architect Agent Output

- Layer: regression, because it validates archive integrity beyond the core send smoke path.
- Coverage: implement the same scenario in Playwright TypeScript and Selenium Python.
- Fixture need: start from a fresh browser state and create evidence through the existing approval/send flow.
- Selector requirements: `archive-search-input`, `archive-record-nora-singh`, `archive-record-maya-chen`, `archive-empty-state`.
- Flakiness risk: avoid sleeps; wait for archive page and records through framework-native visibility checks.

## Implementation Prompt

Implement a regression test that:

1. Logs in as `comms_manager`.
2. Creates and submits `Policy Renewal Notice`.
3. Logs in as `compliance_reviewer` and approves the template.
4. Logs back in as `comms_manager`.
5. Sends `Policy Renewal May 2026`.
6. Opens Archive.
7. Searches for `POL-33810`.
8. Asserts Nora Singh is visible, the record includes `Portal`, and Maya Chen is not visible.

Implement this in:

- `tests/playwright-ts/tests/regression`
- `tests/selenium-python/tests/regression`

## Reviewer Checklist

- Both frameworks assert the same business rule.
- The test uses stable `data-testid` selectors.
- The test creates its own state and does not depend on previous browser storage.
- Archive evidence and hidden unrelated records are both asserted.
- No fixed sleeps are introduced.
