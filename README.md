# QA AI Automation Showcase

A demo repository for showing how AI agents can support test automation work from analysis to implementation, review, and CI feedback.

The project combines:

- a Dockerized React + TypeScript demo web app used as the primary test target,
- Python Selenium tests with pytest,
- TypeScript Playwright tests,
- optional examples against public test-practice websites,
- prompts and workflow notes for AI-assisted QA engineering.

## Primary Decision

The primary tested application is our own Dockerized demo app, `CommsFlow`, located in `demo-app`.

`CommsFlow` is a fictional regulated customer communications platform. It models workflows such as template approval, multi-channel campaigns, archive evidence, audit trails, and role-based work.

Public testing playgrounds are useful learning material, but they should not block the main CI pipeline because they can change, slow down, or become temporarily unavailable.

## Repository Layout

```text
demo-app/                 Dockerized React + TypeScript web application under test
tests/selenium-python/    Python + Selenium + pytest automation
tests/playwright-ts/      TypeScript + Playwright automation
tests/external-sites/     Optional examples for public testing playgrounds
shared/                   Shared test data, selectors contract, scenarios
prompts/                  AI agent roles and sample prompts
docs/                     Project decisions, strategy, workflow notes
.github/workflows/        CI definitions
scripts/                  Local helper scripts
reports/                  Local reports, ignored by Git except .gitkeep
```

## Quick Start

```powershell
.\scripts\setup.ps1
.\scripts\test-smoke.ps1
```

The setup script installs local Playwright and Selenium dependencies. The smoke script starts the Dockerized demo app, runs the TypeScript build inside the container, and executes both Playwright TypeScript and Selenium Python smoke suites.

The application is available at:

```text
http://localhost:5173
```

Health endpoint:

```text
http://localhost:5173/health
```

Regression checks can be run after setup with:

```powershell
.\scripts\run-regression.ps1
```

## Test Setup Preview

```powershell
# Start only the demo app
docker compose up --build -d demo-app

# Playwright TypeScript
cd tests/playwright-ts
npm install
npx playwright install chromium
npm run test:smoke
npm run test:regression

# Selenium Python
cd tests/selenium-python
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
pytest tests/smoke
pytest tests/regression
```

## VS Code Tasks

The repository includes tracked workspace tasks for common demo flows:

- `demo-app: start docker` starts the Dockerized CommsFlow app.
- `smoke: playwright headed` runs Playwright smoke tests with a visible browser.
- `smoke: selenium headed` runs Selenium smoke tests with a visible browser.
- `smoke: all headed` starts Docker and runs both headed smoke suites.
- `regression: playwright`, `regression: selenium`, and `regression: all` run the wider regression suites.

The recommended extensions are listed in `.vscode/extensions.json`.

## Demo Walkthrough

Use `docs/05-demo-script.md` as a 10-minute presentation path. It covers local startup, the CommsFlow business flow, smoke and regression tests, the AI-agent workflow, and the CI artifacts worth showing during a review.

Useful supporting docs:

- `docs/01-test-target-decision.md` explains why CommsFlow is the primary test target.
- `docs/02-test-strategy.md` describes the smoke and regression split.
- `docs/03-ai-agent-workflow.md` shows the business requirement to test implementation workflow.
- `docs/04-ci-cd.md` documents the GitHub Actions pipeline.

## Reports And CI

GitHub Actions runs the smoke gate on pushes to `main`, pushes to `codex/**`, pull requests to `main`, and manual `workflow_dispatch` runs.

CI uploads the key debugging artifacts:

- Playwright report from `tests/playwright-ts/playwright-report`.
- Playwright traces, screenshots, and videos from `tests/playwright-ts/test-results`.
- Selenium pytest output as `reports/selenium-smoke.xml`.

For local debugging, use:

```powershell
cd tests/playwright-ts
npm run report

cd ..\selenium-python
.\.venv\Scripts\python.exe -m pytest tests\smoke -q --junitxml=..\..\reports\selenium-smoke.xml
```

Pull requests use `.github/pull_request_template.md` so every change includes scope, validation, and demo-readiness notes.

## First Milestones

1. Keep smoke tests fast and stable as the main PR gate.
2. Grow regression coverage in parallel for role restrictions, archive search, and audit trail evidence.
3. Use Docker Compose as the single application startup path locally and in CI.
4. Document AI-agent workflow with reusable prompts and review rules.
