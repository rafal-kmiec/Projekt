## Summary

Describe the user-facing or test-facing change in 2-4 sentences.

## Validation

- [ ] Dockerized demo app starts: `docker compose up --build -d demo-app`
- [ ] Demo app TypeScript build passes: `docker compose exec -T demo-app npm run build`
- [ ] Playwright smoke passes: `npm run test:smoke` in `tests/playwright-ts`
- [ ] Selenium smoke passes: `.venv\Scripts\python.exe -m pytest tests\smoke -q` in `tests/selenium-python`
- [ ] Shared local report generated: `reports/index.html`
- [ ] Shared selectors/scenarios were updated if behavior changed

## Test Coverage

- [ ] Playwright TypeScript coverage added or updated
- [ ] Selenium Python coverage added or updated
- [ ] Regression coverage considered for non-critical or broader behavior

## Notes

Mention any known limitations, skipped checks, or CI follow-up.
