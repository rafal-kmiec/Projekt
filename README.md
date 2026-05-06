# QA AI Automation Showcase

A demo repository for showing how AI agents can support test automation work from analysis to implementation, review, and CI feedback.

The project combines:

- a Dockerized demo web app used as the primary test target,
- Python Selenium tests with pytest,
- JavaScript/TypeScript Playwright tests,
- optional examples against public test-practice websites,
- prompts and workflow notes for AI-assisted QA engineering.

## Primary Decision

The primary tested application is our own Dockerized demo app, `QA Shop`, located in `demo-app`.

Public testing playgrounds are useful learning material, but they should not block the main CI pipeline because they can change, slow down, or become temporarily unavailable.

## Repository Layout

```text
demo-app/                 Dockerized demo web application under test
tests/selenium-python/    Python + Selenium + pytest automation
tests/playwright-js/      JavaScript/TypeScript + Playwright automation
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
docker compose up --build demo-app
```

The application should be available at:

```text
http://localhost:5173
```

Health endpoint:

```text
http://localhost:5173/health
```

## Test Setup Preview

```powershell
# Playwright
cd tests/playwright-js
npm install
npx playwright install chromium
npm run test:smoke

# Selenium
cd tests/selenium-python
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
pytest tests/smoke
```

## First Milestones

1. Build a minimal `QA Shop` demo app.
2. Add smoke tests for home, login, products, cart, and checkout.
3. Implement the same business flows in Selenium Python and Playwright JS.
4. Run the app through Docker Compose locally and in CI.
5. Document AI-agent workflow with prompts and review rules.
