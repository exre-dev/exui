# Local checks and complete CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local `check` the single browser-free verification entry while retaining complete CI on every PR and main push.

**Architecture:** An explicit Node-suite inventory separates fast Node/SSR checks from integration checks. Existing task orchestration prepares the public package once and reuses it; full `verify` retains every existing gate and both docs bases.

**Tech Stack:** Node.js 24, pnpm 11.9.0, native Node tests, existing pnpm workspace task runner.

**Spec:** `.notes/local-check/specs/2026-10-19-local-check-design.md`

## Global Constraints

- Use the existing isolated `feat/blocks-optimization` worktree; no commits or delivery operations.
- Do not run Chromium, `pnpm verify`, or other full integration acceptance locally.
- Retain source-lock drift failures, fail-fast stages, literal focused paths and Node file concurrency of two.
- CI runs complete `verify` for both PR and main with no conditional fast path.
- No public UI/API or consumer skill changes are needed.
- All planning and evidence artifacts remain under `.notes/local-check/` or the plan's ignored SDD workspace.

### Task 1: Implement and validate the local/full boundary

**Files:**
- Create: `scripts/test-suites.mjs` for explicit fast/integration Node suite classification.
- Modify: `scripts/tasks.mjs` for shared package preparation and fast `check`/`test` orchestration.
- Test: `packages/components/tests/tooling/tasks.test.mjs` and `packages/components/tests/tooling/test-discovery.test.mjs`.
- Update documentation: `TESTING.md`, `CONTRIBUTING.md`, `README.md`, `README.zh-CN.md`, `AGENTS.md`, `.ai/architectures/release/delivery-pipelines.md` and the relevant `.ai/decisions/` indexes.
- Preserve: `.github/workflows/ci.yml`, browser suites and full-verification gates.

**Ownership:** The implementation worker owns only `scripts/test-suites.mjs`, `scripts/tasks.mjs` and the two tooling test files. The controller owns documentation, measured `check`, review and completion. Both work in the same tree and must preserve each other's changes.

**Interfaces:**
- Consumes: existing `runTasks(mode, files, {env, spawn, log})` test seam.
- Produces: exported `fastNodeTests` and `integrationNodeTests` arrays of repository-relative suite paths, with each discovered Node suite in exactly one array.
- Complete verification keeps the existing `packages/*/tests/**/*.test.mjs` discovery, plus all browser, packing, snippet, Skill and static-docs stages.

- [x] Write failing orchestration tests proving fast `check`/`test` prepares current public artifacts once, runs fast SSR suites and excludes all docs production builds, Chromium and isolated consumer stages. Preserve the full `verify` assertions independently from `test`.

```js
const { events, error } = await exercise(t, "check")
assert.ifError(error)
const tests = events.filter(event => has(event, "--test"))
assert.equal(tests.length, 1)
assert.ok(tests[0].args.includes("packages/docs/tests/node/docs-example-copy-ssr.test.mjs"))
assert.ok(!tests[0].args.includes("packages/components/tests/node/chart-style.test.mjs"))
assert.ok(!events.some(event => has(event, "test:visual")))
assert.ok(!events.some(event => has(event, "@exre/exui-docs") && has(event, "build")))
```

- [x] Run `node --test packages/components/tests/tooling/tasks.test.mjs` with Node.js 24 and record the intended missing-fast-regression failure before implementation.
- [x] Inventory every `*.test.mjs` using the existing discovery traversal. Classify all files explicitly; keep public-package SSR in fast and move entire genuinely heavyweight suites to integration. Add discovery assertions against the exact real file inventory, duplicate entries and missing files.
- [x] Modify orchestration: `typecheck` retains type-only behavior; `check` prepares Tokens and the component public package once, checks docs types, lint/consistency and fast regressions; `test` prepares once and runs only fast regressions. Explicit `test:node` retains all/selected literal Node paths. `verify` retains complete existing orchestration and prerequisites.
- [x] Run both tooling regression files with Node.js 24 and require zero failures. Run the local fast tests through `check`, not complete/browser acceptance.
- [x] Controller synchronizes English/Chinese command documentation and evidence-backed `.ai/` boundaries. Remove Chromium installation and full verification from the ordinary local setup instructions; retain explicit CI-reproduction documentation.
- [x] Measure `pnpm check` on Node.js 24 from safely backed-up, absent build-output directories. Include all required preparation. Restore the original output directories if validation fails before rebuilding them. Never delete or move unchecked paths or unrelated generated work.
- [x] Request an independent spec/quality review of the complete uncommitted task diff, remediate confirmed issues and repeat only affected checks.
- [x] Record the exact local verification results and timing. State that full CI/browser acceptance was not run locally. Leave the implementation uncommitted for user review.
