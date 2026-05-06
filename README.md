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

## First Milestones

1. Keep smoke tests fast and stable as the main PR gate.
2. Grow regression coverage in parallel for role restrictions, archive search, and audit trail evidence.
3. Use Docker Compose as the single application startup path locally and in CI.
4. Document AI-agent workflow with reusable prompts and review rules.
