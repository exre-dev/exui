# Local checks and complete CI

Status: approved in conversation, 2026-10-19.

## Requirements

- Local development uses `pnpm check`: source locks, lint, types, consistency checks and lightweight Node/React SSR regressions, without Chromium.
- Both pull-request CI and main-push CI continue to run the complete `pnpm verify` workflow. The earlier proposal for fast PR CI is superseded.
- Keep every browser test, screenshot baseline, isolated consumer, production docs check and batch example compiler in complete verification.
- `pnpm test` runs the same fast regressions independently; `pnpm test:node [files...]` remains the explicit all/selected Node entry, which can include integration/browser suites.
- Fast checks prepare the current public package once for SSR; no stale-build assumption or hidden preparation command.
- Target 1–2 minutes with dependencies installed and generated build outputs absent. Preparation counts toward this target; report measured results honestly.
- Existing full-verification failures continue to prevent publication and Pages delivery. No workflow trigger or required-check weakening.
- Preserve unrelated work. Do not commit, push, publish, delete test coverage, or run local Chromium/full verification for this task.

## Boundary

Classify Node suites explicitly as fast or integration. The discovery regression must reject missing files, duplicate classification and newly unclassified suites, so a new suite cannot silently disappear. Chromium launchers, real Vite integration servers, temporary-repository release orchestration, repeated compiler/source-copy work belong to integration; pure Node policies and public-package SSR remain fast. Complete CI still collects every Node regression.

## Risks

Local success does not establish real browser behavior or isolated installation correctness. CI supplies those checks before merging. The timing target needs a measured cold-output check on the required Node.js 24 runtime; do not weaken assertions to meet it.
