# Browser test organization independent review

Review basis: `.superpowers/sdd/2026-10-19-test-organization/task-2-brief.md`, the pre-migration browser files and PNGs in `.notes/test-organization/baseline`, the current browser path map, production docs components, and current browser logs. Read-only review; no browser, build or TypeScript commands were run by this reviewer.

## Findings

### P2 — Preserve the production example-section CSS boundary in the shared fixture

Location: `packages/docs/tests/browser/fixtures/docs-examples.tsx:33-36` (the direct `ComponentExamplesHost` render at line 35).

The new fixture renders the production host directly beside Settings, without the `.docs-examples` ancestor that production provides in `packages/docs/app/routes/docs.tsx:70-74`. Importing `app/styles/docs.css` therefore does not apply its production-scoped rules at lines 37-40: horizontal preview scrolling, responsive preview grid columns, minimum-width containment and wrapping of example headers. In particular, the fixture keeps the legacy two-column grid from `src/showcase/ShowcasePages.css:106`, while the actual page uses `repeat(auto-fit, minmax(min(100%, 22rem), 1fr))`.

Both the complete family/content/visibility/resource coverage and the 38 desktop interaction cases now rely on this shared fixture. Their successful execution would consequently leave the production example layout and overflow boundary unexercised. Existing targeted NavigationMenu and Filters tests explicitly use a `docs-examples` container, but do not cover every family in the migrated full matrix.

Minimal repair: wrap the host in the production `section.docs-examples.not-prose` boundary (or share that production boundary) while keeping Settings outside it, then rerun the affected complete coverage/interaction matrix without changing assertions or budgets. This does not require mounting the server-backed document body.

Status: **resolved after independent fix-only re-review**. `fixtures/docs-examples.tsx:35-38` now wraps the host in the same `section.docs-examples.not-prose`, bilingual accessible name and `h2#examples` as production, so the identified scoped CSS rules match the fixture. Settings remains outside the section. `key={family}` changes across family navigation and remains stable for locale/target changes, matching the production page-identity boundary for this catalog. No new P2-or-higher regression was identified in this repair. Runtime acceptance remains the parent-owned final 54-file matrix; this static re-review did not run browsers or builds.

## Remaining acceptance evidence

- The completed `.notes/test-organization/browser-acceptance.log` matrix is not green: 13 project-files passed, one failed; 273 cases passed, one failed and 218 intentionally skipped. The failing desktop case is `ShowcaseExampleInteractions.vrt.test.tsx:250`, “skips Data Grid renders for theme and density while still updating language”, with a 15000 ms test timeout. The log does not establish a render-count assertion failure or its cause. Parent subsequently reported an isolated successful rerun in 9554 ms with the original 15-second budget. The parent-owned full browser matrix remains required; no timeout increase is justified by this review.
- The report still marks final acceptance pending. This review does not replace that runtime gate or the parent-owned full suite/type checks.

## Verified pruning and migration boundaries

- All 59 baseline browser suite paths are represented in the path map; the destination contains 54 suites, matching four retired shells and the two-to-one FormAppearance merge. Ordinary retained suites differ only by import rebasing; the intentional body changes are confined to DocsExamples, DocsOverview, DocsSettings, full coverage/interactions, FormAppearance and the removed Tabs inspection capture.
- All 39 original interaction case titles are retained (38 desktop plus the existing mobile Sidebar case); the dynamic two-language × 89-family coverage loop and its case body remain. The preview-scoped status locator preserves the business assertion rather than matching new source-copy status nodes.
- The shared fixture uses the production ComponentExamplesHost, Settings and PreferencesProvider. The production language-context useMemo fix and fixture useMemo have equivalent stability for theme/density changes; no test-only memoization hides an absent production fix. The original DataGrid render-count assertions remain intact.
- Overview all-real-thumbnail loading, decoded images, unique IDs, inert/link boundaries and appearance continuity are transferred. Canonical copying/failure, real Markdown/helper content, generic MIME handling, numbering/extension separation and same-family target continuity remain in DocsExamples. DocsSettings performs a real root/provider/router remount. FormAppearance retains both original background equality and all six 1px border checks. Tabs retains behavioral and geometry assertions and removes only the inspection PNG case.
- All relative imports in browser TS/TSX resolve on disk. The test-only Recipe fixture matches its tracked pre-move source after its one relative-import rewrite. All 24 Recipe PNGs are byte-identical to the supplied baseline, and Git ignore rules expose all 24 new baseline paths. The three tracked obsolete shell baselines are removed; the two backed-up ignored failure artifacts are recorded as preserved.

Verdict: one confirmed P2 fixture-equivalence finding; final browser acceptance remains open.
