# CommsFlow QA AI Automation Showcase

Pokazowy projekt automatyzacji testów, który prezentuje kompletny flow pracy QA automation wspierany przez agentów AI: od analizy produktu, przez plan testów, implementację w dwóch technologiach, raportowanie, aż po CI.

Projekt został stworzony przez **Rafała Kmiecia** we współpracy z **Codex** jako AI coding/QA agentem.

## Założenia Projektu

- Projekt pokazuje praktyczny, demonstracyjny proces pracy QA automation.
- Głównym obiektem testów jest lokalna, konteneryzowana aplikacja demo `CommsFlow`.
- Testy są zaimplementowane równolegle w Playwright TypeScript i Selenium Python, żeby można było porównać dwa popularne podejścia.
- Publiczne strony testowe mogą być używane jako dodatkowy materiał edukacyjny, ale nie są głównym targetem CI.
- Aplikacja demo nie ma backendu ani bazy danych; działa frontend-only i przechowuje stan w `localStorage`.
- Smoke testy pozostają szybkim gate'em jakości, a regression suite buduje szersze zaufanie do zachowania aplikacji.

## Aplikacja Demo: CommsFlow

`CommsFlow` to fikcyjna platforma do regulowanej komunikacji z klientami. Aplikacja modeluje procesy typowe dla systemów enterprise: tworzenie szablonów komunikacji, approval workflow, kampanie wielokanałowe, archiwum dowodów wysyłki, role użytkowników i audit trail.

Główne obszary aplikacji:

- Login i sesja użytkownika.
- Role i uprawnienia: `Comms Manager` oraz `Compliance Reviewer`.
- Dashboard z metrykami i alertami compliance.
- Customers z preferowanymi kanałami komunikacji.
- Templates z tworzeniem, wersjonowaniem i approval flow.
- Campaigns z wysyłką do klientów przez Email, SMS, Portal i Print.
- Archive z wyszukiwaniem dowodów komunikacji.
- Audit trail dla kluczowych akcji.
- Inbox jako empty state dla przyszłego rozwoju.

Konta demo:

| Rola | Login | Hasło |
| --- | --- | --- |
| Comms Manager | `comms_manager` | `commsflow123` |
| Compliance Reviewer | `compliance_reviewer` | `commsflow123` |

## Technologie

| Obszar | Technologia | Rola w projekcie |
| --- | --- | --- |
| Aplikacja demo | React + TypeScript + Vite | Frontend aplikacji `CommsFlow` |
| Konteneryzacja | Docker Compose | Lokalny i CI-friendly sposób uruchamiania aplikacji |
| Testy E2E | Playwright + TypeScript | Szybkie testy webowe i raport HTML |
| Testy E2E | Selenium + Python + pytest | Klasyczna automatyzacja UI w Pythonie |
| Raporty | JUnit XML + wspólny HTML | Wspólny raport dla Playwright i Selenium |
| CI | GitHub Actions | Smoke gate i artefakty testowe |
| AI workflow | Prompty i dokumentacja | Pokaz pracy agentów AI w procesie QA |

## Struktura Repozytorium

```text
demo-app/                 Dockerized React + TypeScript web app under test
tests/playwright-ts/      TypeScript + Playwright automation
tests/selenium-python/    Python + Selenium + pytest automation
tests/external-sites/     Optional public playground examples
shared/                   Test data, selectors contract, scenarios
scripts/                  Local setup, test and report scripts
docs/                     Decisions, strategy, CI and demo docs
prompts/                  AI agent roles and sample prompts
reports/                  Local generated reports, ignored by Git except .gitkeep
.github/workflows/        GitHub Actions CI definitions
```

Najważniejsze dokumenty pomocnicze:

- [Demo script](docs/05-demo-script.md)
- [Test strategy](docs/02-test-strategy.md)
- [AI agent workflow](docs/03-ai-agent-workflow.md)
- [Test scenarios](shared/test-scenarios.md)

## Instalacja Zależności

Wymagania lokalne:

- Docker Desktop
- Node.js i npm
- Python 3.11+
- PowerShell

Podstawowa instalacja zależności:

```powershell
.\scripts\setup.ps1
```

Skrypt:

- instaluje zależności Playwright TypeScript,
- instaluje przeglądarkę Chromium dla Playwright,
- tworzy środowisko `.venv` dla Selenium Python, jeśli jeszcze go nie ma,
- instaluje zależności Python przez `pip install -e .`.

## Uruchomienie Kontenerów

Build i start aplikacji demo:

```powershell
docker compose up --build -d demo-app
```

Build aplikacji wewnątrz kontenera:

```powershell
docker compose exec -T demo-app npm run build
```

Zatrzymanie kontenerów:

```powershell
docker compose down
```

Aplikacja działa pod adresem:

```text
http://localhost:5173
```

Healthcheck:

```text
http://localhost:5173/health
```

## Ręczne Przejście Przez Aplikację

Otwórz:

```text
http://localhost:5173
```

Podstawowy scenariusz demo:

1. Zaloguj się jako `comms_manager`.
2. Przejdź do `Templates`.
3. Utwórz template `Policy Renewal Notice`.
4. Otwórz szczegóły template i sprawdź approval policy.
5. Kliknij `Submit for approval`.
6. Sprawdź, że manager nie może zatwierdzić własnego pending template.
7. Wyloguj się.
8. Zaloguj się jako `compliance_reviewer`.
9. Sprawdź, że reviewer nie może tworzyć nowych template.
10. Zatwierdź pending template.
11. Wyloguj się i zaloguj ponownie jako `comms_manager`.
12. Przejdź do `Campaigns`.
13. Wyślij kampanię `Policy Renewal May 2026`.
14. Przejdź do `Archive` i wyszukaj `POL-33810`.
15. Wróć do `Dashboard` i sprawdź metryki oraz audit trail.

Pełny scenariusz pokazowy znajduje się w [docs/05-demo-script.md](docs/05-demo-script.md).

## Uruchamianie Testów

Smoke testy dla obu stacków:

```powershell
.\scripts\test-smoke.ps1
```

Regression testy dla obu stacków:

```powershell
.\scripts\run-regression.ps1
```

Playwright osobno:

```powershell
cd tests\playwright-ts
npm run test:smoke
npm run test:regression
```

Selenium osobno:

```powershell
cd tests\selenium-python
.\.venv\Scripts\python.exe -m pytest tests\smoke -q
.\.venv\Scripts\python.exe -m pytest tests\regression -q
```

Widoczna przeglądarka jest dostępna przez taski VS Code:

- `smoke: playwright headed`
- `smoke: selenium headed`
- `smoke: all headed`

## Pokrycie Testami

Aktualne pokrycie jest opisane jako **functional scenario coverage**, czyli pokrycie zachowań biznesowych i przepływów użytkownika. Nie jest to procentowy code coverage.

| Warstwa | Playwright TypeScript | Selenium Python |
| --- | ---: | ---: |
| Smoke | 3 testy | 3 testy |
| Regression | 17 testów | 17 testów |
| Razem | 20 testów | 20 testów |

Łącznie aplikacja demo ma **40 automatycznych testów funkcjonalnych** wykonywanych w dwóch stackach.

Pokryte obszary:

- auth/session,
- roles/permissions,
- navigation,
- templates lifecycle,
- campaign send restrictions,
- selected recipients,
- archive search,
- dashboard metrics,
- audit trail,
- customers/inbox static evidence,
- security guardrails dla protected routes, ról, `localStorage`, XSS-safe rendering i braku wycieku haseł.

Smoke obejmuje krytyczny flow: login managera, utworzenie template, approval reviewera, wysyłkę kampanii, archiwum i dashboard.

Regression obejmuje szersze zachowania: blokady ról, protected routing, refresh sesji, duplicate template, kampanie bez odbiorców, wyszukiwanie po różnych polach, channel summary, audit order, static pages oraz demo-safe security checks.

## Raporty Testowe

Wspólny raport HTML:

```text
reports/index.html
```

Pliki JUnit XML:

```text
reports/playwright-smoke.xml
reports/playwright-regression.xml
reports/selenium-smoke.xml
reports/selenium-regression.xml
```

Natywny raport Playwright:

```text
tests/playwright-ts/playwright-report/index.html
```

Jak czytać wspólny raport:

- `Total` oznacza liczbę testów w danym źródle raportu.
- `Passed` oznacza testy zakończone sukcesem.
- `Failed` oznacza testy zakończone błędem.
- `Skipped` oznacza testy pominięte.
- Każdy wiersz pokazuje osobne źródło, np. Playwright smoke, Playwright regression, Selenium smoke albo Selenium regression.

Playwright zapisuje screenshoty, traces i video głównie przy błędach lub retry w:

```text
tests/playwright-ts/test-results
```

## CI/CD

GitHub Actions uruchamia smoke gate dla Playwright i Selenium.

Workflow `CI` startuje dla:

- push do `main`,
- push do `codex/**`,
- pull request do `main`,
- ręczny `workflow_dispatch`.

Artefakty CI:

- Playwright HTML report,
- Playwright `test-results`,
- Playwright JUnit XML,
- Selenium JUnit XML.

Smoke testy są głównym gate'em jakości w CI. Regression suite jest przeznaczony do lokalnej walidacji i dalszego rozszerzania pipeline.

## AI Workflow

Repozytorium pokazuje nadzorowany workflow pracy z agentami AI:

- Analyst Agent: zamienia wymagania biznesowe na scenariusze i ryzyka.
- Test Architect Agent: definiuje pokrycie, fixtures i granice testów.
- Playwright Engineer Agent: implementuje testy TypeScript Playwright.
- Selenium Engineer Agent: implementuje testy Python Selenium.
- Reviewer Agent: sprawdza stabilność, asercje, nazwy i utrzymywalność.

Przykład kompletnego przepływu znajduje się w:

```text
prompts/examples/archive-search-by-policy-workflow.md
```

## Troubleshooting

Port `5173` jest zajęty:

- zatrzymaj inny proces używający portu,
- albo zatrzymaj kontenery przez `docker compose down` i uruchom ponownie.

Docker nie działa:

- upewnij się, że Docker Desktop jest uruchomiony,
- sprawdź `docker compose ps`.

Brak `.venv` dla Selenium:

```powershell
.\scripts\setup.ps1
```

Brak przeglądarki Playwright:

```powershell
cd tests\playwright-ts
npx playwright install chromium
```

Testy nie widzą aplikacji:

- sprawdź `http://localhost:5173/health`,
- uruchom ponownie `docker compose up --build -d demo-app`.

## Demo Checklist

Przed pokazem projektu:

1. Uruchom `.\scripts\setup.ps1`.
2. Uruchom `docker compose up --build -d demo-app`.
3. Sprawdź `http://localhost:5173/health`.
4. Uruchom `.\scripts\test-smoke.ps1`.
5. Uruchom `.\scripts\run-regression.ps1`.
6. Otwórz `reports/index.html`.
7. Przygotuj `docs/05-demo-script.md`.

## Branching/Git Workflow

Rekomendowany branch roboczy:

```text
codex/commsflow-mvp
```

Większe zmiany powinny trafiać przez pull request do `main`. Template PR znajduje się w:

```text
.github/pull_request_template.md
```

## Known Limitations

- Aplikacja demo nie ma backendu ani realnej bazy danych.
- Stan aplikacji jest przechowywany w `localStorage`.
- CI uruchamia smoke gate, a pełna regresja jest obecnie lokalnym confidence layer.
- Publiczne strony testowe nie są częścią obowiązkowego pipeline.
- Raport wspólny agreguje wynik JUnit XML, ale szczegółowe debug artifacts Playwright są osobno.

## Roadmap

Możliwe kolejne kierunki rozwoju:

- backend/API dla CommsFlow,
- fixtures i seedowanie danych testowych,
- accessibility checks,
- visual regression tests,
- uruchamianie pełnej regresji w CI,
- lepszy dashboard raportów,
- rozszerzenie Inbox i Archive o nowe workflow,
- więcej przykładów AI workflow dla zmian biznesowych.

## FAQ

### Po co dwa stacki testowe?

Projekt celowo pokazuje Playwright TypeScript i Selenium Python równolegle. Dzięki temu można porównać ergonomię, strukturę page objectów, szybkość uruchamiania i raportowanie.

### Czy to jest kopia realnego produktu?

Nie. `CommsFlow` jest fikcyjną aplikacją demo inspirowaną ogólną domeną regulowanej komunikacji z klientami. Nie kopiuje konkretnego produktu ani vendora.

### Gdzie są testy?

```text
tests/playwright-ts/tests
tests/selenium-python/tests
```

### Gdzie są page objecty?

```text
tests/playwright-ts/src/pages/comms-flow-app.ts
tests/selenium-python/src/pages/comms_flow_app.py
```

### Gdzie są scenariusze biznesowe?

```text
shared/test-scenarios.md
```

# English Version

# CommsFlow QA AI Automation Showcase

A demo test automation project showing a complete QA automation workflow supported by AI agents: from product analysis, through test planning and implementation in two technologies, to reporting and CI.

The project was created by **Rafał Kmieć** in collaboration with **Codex** as an AI coding/QA agent.

## Project Assumptions

- The project demonstrates a practical QA automation workflow.
- The main test target is a local, Dockerized demo application called `CommsFlow`.
- Tests are implemented in parallel in Playwright TypeScript and Selenium Python, so both approaches can be compared.
- Public test playgrounds may be used as optional learning material, but they are not the main CI target.
- The demo app has no backend or database; it is frontend-only and stores state in `localStorage`.
- Smoke tests stay as the fast quality gate, while the regression suite provides broader confidence.

## Demo Application: CommsFlow

`CommsFlow` is a fictional regulated customer communications platform. It models enterprise workflows such as communication templates, approval workflow, multi-channel campaigns, delivery evidence archive, user roles, and audit trail.

Main product areas:

- Login and user session.
- Roles and permissions: `Comms Manager` and `Compliance Reviewer`.
- Dashboard with metrics and compliance alerts.
- Customers with preferred communication channels.
- Templates with creation, versioning, and approval flow.
- Campaigns sent through Email, SMS, Portal, and Print.
- Archive with searchable communication evidence.
- Audit trail for key actions.
- Inbox empty state for future development.

Demo accounts:

| Role | Login | Password |
| --- | --- | --- |
| Comms Manager | `comms_manager` | `commsflow123` |
| Compliance Reviewer | `compliance_reviewer` | `commsflow123` |

## Technologies

| Area | Technology | Role in the project |
| --- | --- | --- |
| Demo app | React + TypeScript + Vite | `CommsFlow` frontend |
| Containerization | Docker Compose | Local and CI-friendly app runtime |
| E2E tests | Playwright + TypeScript | Fast web tests and HTML reporting |
| E2E tests | Selenium + Python + pytest | Classic UI automation in Python |
| Reports | JUnit XML + shared HTML | Shared report for Playwright and Selenium |
| CI | GitHub Actions | Smoke gate and test artifacts |
| AI workflow | Prompts and docs | AI-agent QA workflow showcase |

## Repository Layout

```text
demo-app/                 Dockerized React + TypeScript web app under test
tests/playwright-ts/      TypeScript + Playwright automation
tests/selenium-python/    Python + Selenium + pytest automation
tests/external-sites/     Optional public playground examples
shared/                   Test data, selectors contract, scenarios
scripts/                  Local setup, test and report scripts
docs/                     Decisions, strategy, CI and demo docs
prompts/                  AI agent roles and sample prompts
reports/                  Local generated reports, ignored by Git except .gitkeep
.github/workflows/        GitHub Actions CI definitions
```

Key supporting docs:

- [Demo script](docs/05-demo-script.md)
- [Test strategy](docs/02-test-strategy.md)
- [AI agent workflow](docs/03-ai-agent-workflow.md)
- [Test scenarios](shared/test-scenarios.md)

## Dependency Installation

Local requirements:

- Docker Desktop
- Node.js and npm
- Python 3.11+
- PowerShell

Main setup command:

```powershell
.\scripts\setup.ps1
```

The script:

- installs Playwright TypeScript dependencies,
- installs Chromium for Playwright,
- creates the Selenium Python `.venv` environment if it does not exist,
- installs Python dependencies with `pip install -e .`.

## Running Containers

Build and start the demo app:

```powershell
docker compose up --build -d demo-app
```

Build the app inside the container:

```powershell
docker compose exec -T demo-app npm run build
```

Stop containers:

```powershell
docker compose down
```

The app is available at:

```text
http://localhost:5173
```

Healthcheck:

```text
http://localhost:5173/health
```

## Manual Application Walkthrough

Open:

```text
http://localhost:5173
```

Core demo scenario:

1. Sign in as `comms_manager`.
2. Go to `Templates`.
3. Create `Policy Renewal Notice`.
4. Open template details and check the approval policy.
5. Click `Submit for approval`.
6. Confirm that the manager cannot approve their own pending template.
7. Log out.
8. Sign in as `compliance_reviewer`.
9. Confirm that the reviewer cannot create new templates.
10. Approve the pending template.
11. Log out and sign back in as `comms_manager`.
12. Go to `Campaigns`.
13. Send `Policy Renewal May 2026`.
14. Go to `Archive` and search for `POL-33810`.
15. Return to `Dashboard` and check metrics and audit trail.

The full demo walkthrough is available in [docs/05-demo-script.md](docs/05-demo-script.md).

## Running Tests

Smoke tests for both stacks:

```powershell
.\scripts\test-smoke.ps1
```

Regression tests for both stacks:

```powershell
.\scripts\run-regression.ps1
```

Playwright only:

```powershell
cd tests\playwright-ts
npm run test:smoke
npm run test:regression
```

Selenium only:

```powershell
cd tests\selenium-python
.\.venv\Scripts\python.exe -m pytest tests\smoke -q
.\.venv\Scripts\python.exe -m pytest tests\regression -q
```

Headed browser runs are available through VS Code tasks:

- `smoke: playwright headed`
- `smoke: selenium headed`
- `smoke: all headed`

## Test Coverage

The current coverage is described as **functional scenario coverage**, meaning business behavior and user-flow coverage. It is not percentage-based code coverage.

| Layer | Playwright TypeScript | Selenium Python |
| --- | ---: | ---: |
| Smoke | 3 tests | 3 tests |
| Regression | 17 tests | 17 tests |
| Total | 20 tests | 20 tests |

In total, the demo app has **40 automated functional tests** executed across two stacks.

Covered areas:

- auth/session,
- roles/permissions,
- navigation,
- templates lifecycle,
- campaign send restrictions,
- selected recipients,
- archive search,
- dashboard metrics,
- audit trail,
- customers/inbox static evidence,
- security guardrails for protected routes, roles, `localStorage`, XSS-safe rendering, and password exposure.

Smoke covers the critical path: manager login, template creation, reviewer approval, campaign send, archive evidence, and dashboard metrics.

Regression covers broader behavior: role restrictions, protected routing, session refresh, duplicate template handling, campaigns without recipients, multi-field search, channel summary, audit order, static pages, and demo-safe security checks.

## Test Reports

Shared HTML report:

```text
reports/index.html
```

JUnit XML files:

```text
reports/playwright-smoke.xml
reports/playwright-regression.xml
reports/selenium-smoke.xml
reports/selenium-regression.xml
```

Native Playwright report:

```text
tests/playwright-ts/playwright-report/index.html
```

How to read the shared report:

- `Total` means the number of tests in a report source.
- `Passed` means successful tests.
- `Failed` means failed tests.
- `Skipped` means skipped tests.
- Each row represents a separate source, such as Playwright smoke, Playwright regression, Selenium smoke, or Selenium regression.

Playwright stores screenshots, traces, and videos mainly on failure or retry in:

```text
tests/playwright-ts/test-results
```

## CI/CD

GitHub Actions runs the smoke gate for Playwright and Selenium.

The `CI` workflow runs on:

- push to `main`,
- push to `codex/**`,
- pull request to `main`,
- manual `workflow_dispatch`.

CI artifacts:

- Playwright HTML report,
- Playwright `test-results`,
- Playwright JUnit XML,
- Selenium JUnit XML.

Smoke tests are the main CI quality gate. The regression suite is currently intended for local validation and future pipeline expansion.

## AI Workflow

The repository demonstrates a supervised AI-agent workflow:

- Analyst Agent: turns business requirements into scenarios and risks.
- Test Architect Agent: defines coverage, fixtures, and test boundaries.
- Playwright Engineer Agent: implements TypeScript Playwright tests.
- Selenium Engineer Agent: implements Python Selenium tests.
- Reviewer Agent: checks stability, assertions, naming, and maintainability.

An example end-to-end workflow is available in:

```text
prompts/examples/archive-search-by-policy-workflow.md
```

## Troubleshooting

Port `5173` is already in use:

- stop another process using the port,
- or stop containers with `docker compose down` and start again.

Docker is not running:

- make sure Docker Desktop is running,
- check `docker compose ps`.

Missing Selenium `.venv`:

```powershell
.\scripts\setup.ps1
```

Missing Playwright browser:

```powershell
cd tests\playwright-ts
npx playwright install chromium
```

Tests cannot reach the app:

- check `http://localhost:5173/health`,
- restart `docker compose up --build -d demo-app`.

## Demo Checklist

Before presenting the project:

1. Run `.\scripts\setup.ps1`.
2. Run `docker compose up --build -d demo-app`.
3. Check `http://localhost:5173/health`.
4. Run `.\scripts\test-smoke.ps1`.
5. Run `.\scripts\run-regression.ps1`.
6. Open `reports/index.html`.
7. Prepare `docs/05-demo-script.md`.

## Branching/Git Workflow

Recommended working branch:

```text
codex/commsflow-mvp
```

Larger changes should go through a pull request to `main`. The PR template is available in:

```text
.github/pull_request_template.md
```

## Known Limitations

- The demo app has no backend or real database.
- Application state is stored in `localStorage`.
- CI runs the smoke gate, while full regression is currently a local confidence layer.
- Public playground sites are not part of the mandatory pipeline.
- The shared report aggregates JUnit XML results, while detailed Playwright debug artifacts are stored separately.

## Roadmap

Possible next steps:

- backend/API for CommsFlow,
- fixtures and deterministic test data seeding,
- accessibility checks,
- visual regression tests,
- full regression in CI,
- improved report dashboard,
- expanded Inbox and Archive workflows,
- more AI workflow examples for business changes.

## FAQ

### Why two test stacks?

The project intentionally shows Playwright TypeScript and Selenium Python in parallel. This makes it easier to compare ergonomics, page object structure, execution speed, and reporting.

### Is this a copy of a real product?

No. `CommsFlow` is a fictional demo application inspired by the general domain of regulated customer communications. It does not copy any specific product or vendor.

### Where are the tests?

```text
tests/playwright-ts/tests
tests/selenium-python/tests
```

### Where are the page objects?

```text
tests/playwright-ts/src/pages/comms-flow-app.ts
tests/selenium-python/src/pages/comms_flow_app.py
```

### Where are the business scenarios?

```text
shared/test-scenarios.md
```
