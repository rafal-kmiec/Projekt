# AI Agent Workflow

The repository demonstrates a supervised AI-assisted QA workflow.

## Roles

- Analyst Agent: turns requirements into scenarios and risks.
- Test Architect Agent: defines coverage, fixtures, and test boundaries.
- Selenium Engineer Agent: implements Python Selenium tests.
- Playwright Engineer Agent: implements Playwright tests.
- Reviewer Agent: checks stability, assertions, naming, and maintainability.

## Example Flow

1. A requirement is written in plain language.
2. Analyst Agent extracts business rules and edge cases.
3. Test Architect Agent creates a concise test plan.
4. Implementation agents create tests in their owned framework folders.
5. Reviewer Agent reviews selectors, waits, fixtures, and assertions.
6. CI starts the Dockerized demo app, runs tests, and publishes reports.

AI output should be reviewed like any other code contribution.
