# Test organization implementation plan

Spec: `.notes/test-organization/specs/2026-10-19-test-organization.md`, approved 2026-10-19 with the explicit correction that no tooling workspace is added. Repository tooling tests belong to `packages/components/tests/tooling/`.

## Global constraints

Existing linked worktree `feat/blocks-optimization`; preserve all existing working changes. No commits, push, package publication, or new workspace. Node/browser framework versions stay unchanged. Use current source, not HEAD, when moving. Keep public-package consumers using the built public package. Do not regenerate screenshot baselines or loosen assertions. Workers are not alone and must not revert others' changes. No nested subagents.

### Task 1: Node tests and consumer verifiers

Own all Node test relocations from `scripts/**/*.test.mjs`, `packages/components/scripts/*.test.mjs`, `packages/tokens/scripts/*.test.mjs`, related test-only fixtures, and dedicated consumer/static verifiers. Do not edit root package.json, scripts/tasks.mjs, package manifests, Vitest, browser TSX, README/TESTING/.ai, workflows. Parent owns those integrations. Move tasks.test.mjs with import/root correction only; parent changes its runner-contract assertions later.

Destination map: Token policy suites -> `packages/tokens/tests/`; rem/module-specifiers/chart-style -> `packages/components/tests/node/`; four reui suites -> `packages/components/tests/upstream/`; run-command/watch/dev/tasks -> `packages/components/tests/tooling/`; release suites -> `packages/components/tests/tooling/release/`; skill sync suite and verifier -> `packages/components/tests/tooling/skill/`; all docs Node suites -> `packages/docs/tests/node/`. Test-only docs fixture JSON -> `packages/docs/tests/fixtures/`; packed React/Form verifiers plus form fixture -> `packages/components/tests/consumers/`; docs static/sharing verifiers -> `packages/docs/tests/integration/`. Keep production maintenance/build script implementations in scripts. Fix imports, new URL/fileURLToPath roots, literal fixture paths and child process script paths. Preserve Windows paths. No root test forwarding shims.

Merge the duplicate real docs Vite source-endpoint suite from docs-sharing into docs-dev-sources, preserving cache-control, whole JSON/Markdown, query, HEAD, missing IDs, isolated cacheDir and both bases. Remove only the source-expression retention snapshot and exact ARIA initializer snapshot cases from docs-example-copy, retain semantic dictionary/format/SSR assertions, and delete only exclusively unused fixtures. Keep snippets' generated Form-prop preservation case.

Create `.notes/test-organization/node-path-map.json` containing old->new paths, including every moved verifier and fixture. Run meaningful direct Node checks on migrated files where prerequisites exist, recording exact commands/results. Report in `.notes/test-organization/node-report.md`; no commits.

### Task 2: Browser tests and pruning

Own `packages/docs/src/showcase/*.vrt.test.tsx`, all destination `packages/docs/tests/browser/**`, dedicated browser-only fixture TS/TSX, `packages/docs/vitest.config.ts`, `packages/docs/tsconfig.json`, `packages/docs/.gitignore` and only docs manifest's lint/include/test script changes as needed. Do not edit Node mjs tests, scripts/tasks.mjs, root manifest, other manifests/workflows/docs/.ai. Preserve concurrent edits.

Move all retained suites to `packages/docs/tests/browser/`, rebase relative imports to production src/app/upstream files. Move only test-exclusive fixtures/environment snapshots (especially ComponentRecipeContract) under tests, preserving production example/provider/style ownership. Move the 24 ComponentRecipeContract baseline PNGs byte-for-byte; delete only the three obsolete ShowcaseCatalog shell baselines. Update config include, TS test include, lint, baseline ignore exceptions. No regenerating PNGs.

Transfer all-real-thumbnail loading and useful appearance/inert/link assertions from ComponentsOverview to DocsOverview mounted with current Router adapter, remove ComponentsOverview suite. Transfer shared clipboard failure/generic MIME/Markdown and same-page target continuity boundaries from ShowcaseSharing to DocsExamples, then remove ShowcaseSharing. Remove ShowcaseCatalog and ShowcaseLocale old hash-shell suites; ensure new DocsSettings covers real persistence remount. Remove Tabs' final inspection-only PNG test/calls. Merge FormSurfaces+FormSurfaceOutline into FormAppearance with both background and border assertions intact. Preserve every unique public API/async/file/keyboard test. Convert full ShowcaseExampleCoverage/Interactions harness to production ComponentExamplesHost + shared real providers; retain actual case bodies and replace settings/navigation helpers, do not delete useful interaction coverage just to make it easy.

Create `.notes/test-organization/browser-path-map.json`. Run targeted affected browser suites after public build when possible, coordinate before building shared artifacts. Report byte hashes, retained/removed coverage and checks in `.notes/test-organization/browser-report.md`; no commits.

### Task 3: Unified runner, docs and final integration

Parent owns root and tokens/components manifests, scripts/tasks.mjs, post-relocation tasks.test.mjs, workflows, README, TESTING, .ai and plan/audit artifacts. Root pnpm test executes complete retained Node+Chromium+consumer+static verification with required builds; test:node preserves quick/focused Node mode. test:visual stays focused browser command. verify adds lint/source/content/release checks and shares preparation/tests without repeated builds. Keep exact root and /exui/ build->matching-verifier order. All Node tests collected once from packages/*/tests/**/*.test.mjs; prevent silent leftover src/scripts tests via discovery regression. No new tooling workspace or lock importer.

Integrate maps and update every maintained source/config/workflow reference; retain scripts used by actual production build/checks. Run Node runner contract checks, package Node suites, typecheck/lint/build, full Windows Chromium and packed/static gates. Use Node24 if available (current shell initially Node22). Independently review relocation correctness, pruning equivalence, baseline hashes and command coverage, fix confirmed findings, then write evidence-backed durable .ai changes and final report. No commits/push.
