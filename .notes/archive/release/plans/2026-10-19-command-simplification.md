# Command Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace a flat list of 37 root commands with 11 usable entry points while retaining all gates.

**Architecture:** A small dependency-aware Node orchestrator shares ordered preparation between checks and full verification. The existing source watcher becomes a reusable lifecycle used by the integrated docs development command; a Vite plugin reloads only after complete library builds.

**Tech Stack:** Node.js 24, pnpm 11.9.0, Node test runner, Vite, existing Vitest/Playwright.

**Spec:** `.notes/release/specs/2026-10-19-command-simplification.md`

## Global Constraints

- Exactly the 11 approved root scripts; preserve every existing gate and maintenance operation.
- Node.js 24 and pnpm 11.9.0; no new dependencies.
- Preserve dirty Form/Field/docs changes; no commits, pushes or publication.
- Root and prefix verification must consume their matching docs build sequentially.

### Task 1: Ordered command orchestration

**Files:** create `scripts/tasks.mjs`, `scripts/tasks.test.mjs`; modify `package.json` and, only where needed to avoid duplicate checks, `packages/tokens/package.json`.

**Interfaces:** CLI `node scripts/tasks.mjs <build|typecheck|check|test|verify> [test-files...]`; root `dev` points to `node scripts/dev.mjs`. Use the existing subprocess conventions (`process.execPath` plus `npm_execpath`) and retain stage labels. Parent owns docs/CI and development lifecycle.

- [ ] First add behavior tests proving dependency ordering, no browser invocation in `check`, fail-fast behavior, focused test arguments and once-only prerequisite execution.
- [ ] Run those tests against the missing runner and observe failure, then implement the runner and the 11 root scripts.
- [ ] Run the focused suite with Node.js 24. Report exact commands and any incomplete gates.

The complete verifier must include every old root `test:*` file, `scripts/docs-pages.test.mjs`, `scripts/exui-skill/sync-references.test.mjs`, token policy checks, all four upstream checks, docs content/examples/assets/styles/capabilities/snippets/static/sharing, skill sync/inventory/verify/examples, visual and packed consumers, and release verification. The final docs output uses `/exui/` for existing Pages upload. The lightweight checker includes source locks, token checks, lint/type checks and source-only docs/skill consistency; no browser-backed tests or built-output verifiers.

### Task 2: Integrated development lifecycle

**Files:** modify `scripts/watch.mjs`, `scripts/watch.test.mjs`, `packages/docs/vite.config.ts`; create `scripts/dev.mjs`, lifecycle regressions and a small docs library-reload plugin if useful.

**Interfaces:** watcher exposes readiness, successful-rebuild notification and cleanup for the dev command. The dev command starts docs after readiness and sends a rebuild marker only after successful changes; the plugin invalidates the module graph and sends a full reload. Preserve the library's public-entry consumption boundary.

- [ ] Add failing real-process regressions for initial readiness, failed builds/recovery, generated CSS exclusion and shutdown.
- [ ] Implement the reusable watcher and dev lifecycle with literal child-process arguments, serial dependency builds, clear errors and child cleanup.
- [ ] Exercise Vite invalidation/reload after a marker change; verify current docs dev source routes continue working.

### Task 3: CI, maintained instructions and integration

**Files:** `.github/workflows/ci.yml`, `release.yml`, `tag-npm.yml`; `README.md`, `TESTING.md`, `AGENTS.md`, maintained `.ai/` command references as needed.

**Interfaces:** CI calls `pnpm verify`; existing Pages upload remains after the successful verifier. Release workflows call direct maintenance scripts instead of removed root aliases. TESTING.md remains the authoritative command reference.

- [ ] Replace removed-command references in maintained docs, preserving historical notes and unrelated changes.
- [ ] Update workflow invocations and run release/Pages guard regressions and actionlint where available.
- [ ] Run Node.js 24 `pnpm check`, build/Node regressions, relevant development/browser gates and the full verifier. Resolve confirmed failures in this scope; report independent pre-existing failures accurately.
- [ ] Obtain independent scoped code review and repair confirmed findings. Record only verified durable runtime constraints using codebase-documenter.
