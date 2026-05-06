# ADR 0001: Use Own Dockerized Demo App As Primary Test Target

## Status

Accepted

## Context

The project needs stable automated tests for Selenium Python and Playwright JS. Public demo sites are useful for practice, but their availability, markup, and behavior are outside our control.

## Decision

We will build and test a small Dockerized local application named `QA Shop` as the primary target. Public test-practice websites will be used only for optional examples.

## Consequences

- CI can be deterministic and fast.
- Test data and selectors can be designed intentionally.
- The local startup path matches CI closely.
- The project requires maintaining a small demo app and Docker setup.
- External examples remain useful but do not block repository health.
