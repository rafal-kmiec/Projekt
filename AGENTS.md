# AGENTS.md

## Project Context

This repository is a QA automation showcase project. It demonstrates how AI agents can support test automation work from product analysis through implementation, review, CI feedback, and iteration.

The tested product is evolving from the initial `QA Shop` skeleton into `CommsFlow`: a demo platform inspired by regulated customer communication management systems. The product should not copy any real vendor. It should model the same kind of enterprise domain: critical customer communications, template approval, channel preferences, outbound campaigns, inbound messages, audit trails, archive search, and compliance-focused reporting.

The project lives at:

```text
C:\Users\kmiec\Desktop\Rafał\projekt
```

The remote repository is:

```text
https://github.com/rafal-kmiec/Projekt.git
```

## Product Direction

Build a fictional regulated communications platform named `CommsFlow`.

Core product areas:

- Dashboard with communication metrics and compliance alerts.
- Customers with communication preferences and history.
- Templates / Composer with versioning and approval workflow.
- Campaigns / Send for multi-channel outbound communication.
- Inbox / Receive for incoming messages and document handling.
- Archive with searchable communication records and audit trail.
- Admin / Roles for permissions and visibility checks.

Recommended MVP flow:

1. User logs in as `comms_manager`.
2. User creates a `Policy Renewal Notice` template.
3. User submits the template for approval.
4. User logs in as `compliance_reviewer`.
5. Reviewer approves the template.
6. User logs in again as `comms_manager`.
7. User creates a campaign using the approved template.
8. User selects customers with Email, SMS, Portal, and Print preferences.
9. User sends the campaign.
10. Dashboard and Archive show the communication as sent with an audit trail.

## Technical Direction

The repository combines:

- Dockerized demo web app in `demo-app`.
- Python Selenium tests with pytest in `tests/selenium-python`.
- JavaScript/TypeScript Playwright tests in `tests/playwright-js`.
- Optional external-site examples in `tests/external-sites`.
- Shared test data and selector contracts in `shared`.
- AI-agent prompts and workflow examples in `prompts`.
- Documentation and ADRs in `docs`.

The demo app should remain container-friendly and runnable through:

```powershell
docker compose up --build demo-app
```

The app should expose a reliable health endpoint:

```text
http://localhost:5173/health
```

## Autonomy Mandate

Codex has full mandate to develop the CommsFlow project in this repository.

Codex may independently:

- design and implement product features,
- change the application structure,
- refactor the existing skeleton,
- add files and dependencies,
- update documentation and prompts,
- run Docker Compose,
- run Selenium and Playwright tests,
- create commits for coherent work stages,
- push work to the remote repository.

Preferred branch for autonomous work:

```text
codex/commsflow-mvp
```

Codex should avoid committing directly to `main` for larger changes unless explicitly asked.

## Safety Boundaries

Codex must not:

- force push,
- delete Git history,
- delete the repository,
- change repository privacy or remote ownership settings,
- publish secrets, tokens, credentials, or private data,
- remove user changes without explicit permission,
- rewrite unrelated work.

If a change could be destructive or hard to reverse, ask before doing it.

## Engineering Guidelines

- Prefer small, coherent commits.
- Keep the demo product realistic but compact.
- Use stable `data-testid` selectors for UI automation.
- Keep test data deterministic and resettable.
- Keep Selenium and Playwright flows comparable where practical.
- Make CI deterministic; public external-site tests must not block the main pipeline.
- Prefer behavior-focused assertions over implementation details.
- Avoid unnecessary abstractions until repeated patterns justify them.

## AI Agent Workflow

This repository should demonstrate a supervised AI-assisted QA workflow:

- Analyst Agent: turns business requirements into scenarios and risks.
- Test Architect Agent: defines coverage, fixtures, and test boundaries.
- Selenium Engineer Agent: implements Python Selenium tests.
- Playwright Engineer Agent: implements Playwright tests.
- Reviewer Agent: checks stability, assertions, naming, and maintainability.

AI-generated output should be reviewed like any other code contribution.

