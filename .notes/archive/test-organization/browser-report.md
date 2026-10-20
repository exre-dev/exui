# Browser test organization report

## Scope and ownership

Moved all 54 retained browser suites from `packages/docs/src/showcase/` into `packages/docs/tests/browser/`. Updated relative imports, browser discovery, TypeScript inclusion, docs lint discovery and screenshot ignore exceptions. The docs package also exposes the approved package-local Node test command through the root task runner.

`browser-path-map.json` lists every old test path, merged or retired path, test-only fixture and screenshot disposition. Production examples, shared styles, source drawers, runtime providers and public library components remain in their original source locations. The test-exclusive `ComponentRecipeContract.tsx` fixture moved to `tests/browser/fixtures/`; its three consumer suites use that path.

## Retained and retired coverage

- Retired `ComponentsOverview`, `ShowcaseSharing`, `ShowcaseCatalog` and `ShowcaseLocale` legacy shell suites. `DocsOverview` now retains sorted family lists, router navigation/history, preview theme/density/language changes with DOM continuity, inert/link boundaries and all 89 real thumbnail loads with decoded images, unique IDs and runtime-error checks.
- `DocsExamples` retains same-family target continuity and real drafts, canonical clipboard links, honest clipboard failures, readable full Markdown/helper copies and generic MIME handling, plus stable official numbering and extension headers/ID separation.
- `DocsSettings` now tests an actual provider/root/router remount after changing theme, density and language, including both dark classes for pitch black.
- Merged `FormSurfaces` and `FormSurfaceOutline` into `FormAppearance`; both backgrounds and 1px border semantics are checked for light, dark and pitch black. No public API, async, file or keyboard case was dropped.
- Removed only Tabs' inspection-only screenshot case. All computed geometry, keyboard, focus and selected-shadow cases remain.
- Preserved every test title and case body in the full coverage/interaction suites except host-dependent navigation/settings and a business-status locator narrowed to the preview. Coverage still runs every catalog family in both languages, with real content, labels, ARIA references, SVG scope, images and resource failures. All 39 original interaction cases remain, plus the mobile Sidebar case; timing budgets remain unchanged.
- The coverage/interaction fixture uses production `ComponentExamplesHost`, `Settings`, `PreferencesProvider` and the shared `LanguageContext` behind a React Router memory route. It replaces only server loader data and URL navigation; no legacy hash shell is mounted.

## Source changes

The real docs host exposed a pre-existing context-identity issue: recreating `LanguageContext.value` on theme or density updates rendered translated DataGrid examples again. The parent explicitly authorized the minimal `packages/docs/app/routes/docs.tsx` fix: memoize the value using the existing stable `setLanguage` callback and locale. The test route uses the same callback/value stability. The original render-count regression remains intact and tests CSS-only appearance updates plus live language translation.

The docs overview adapter supplies the same `TooltipProvider`, `GlassSeed` and `ExMessageContext` as production `app/routes/overview.tsx`; without these, real thumbnails with tooltips cannot load.

Independent review also identified that the full coverage/interaction route adapter needed the production `.docs-examples.not-prose` section, its heading and accessible name. These are now present so docs overflow, grid, minimum-width and header-wrap selectors match the mounted examples. A subsequent full run exposed a production lifecycle defect in the page-keyed host; its final boundary is described below.

The retained notification/navigation case reproduced a real production defect: keying the whole `ComponentExamplesHost` by document identity recreated its Sonner Toaster and removed unrelated visible notifications. Both production and fixture now retain the outer Host and rely on its existing inner `FamilySession key={family}` to unmount page-local content. This preserves the external toast and still dismisses the page-owned loading handle. The unchanged case failed specifically at its final external-toast visibility assertion before the two-line repair, then passed in 925ms afterward. Independent scoped review is clean; see `toast-navigation-report.md` and `toast-navigation-review.md`. This applies within family-bearing pages of the same docs route; leaving that route still unmounts the host. Final full-matrix evidence is parent-owned.

## Screenshot evidence

All 24 reviewed Recipe PNGs were moved byte-for-byte and compared against `.notes/test-organization/baseline` using SHA-256 and direct byte equality. Per-file hashes are recorded in the path map. The SHA-256 of their sorted concatenated digest strings is `d3832beab3679ba7802530ca9408a8105bcc0e1bc280d7c5554a52fd8ac865f4`.

The three tracked obsolete ShowcaseCatalog baselines were removed. Two ignored prior failure screenshots present in the backup were preserved at their original ignored paths. One additional ignored ShowcaseCatalog failure screenshot generated after the baseline backup was removed by the initial directory scan and has no backup; the path map records its filename and prior hash. No Recipe baseline was regenerated.

## Validation

Node 24.22.0 and pnpm are used, with the public package prepared by the parent. No shared build/type preparation was started by this worker.

- Initial docs TypeScript check passed after fixture import updates. A later overlapping check encountered declarations while parent preparation was rebuilding them; the parent subsequently confirmed its complete `pnpm typecheck` passed. Parent owns subsequent shared type checks.
- Focused `oxlint tests/browser` exited 0.
- Initial targeted runs exposed and corrected adapter/provider, text encoding, generic Markdown reference-prefix and duplicate status-locator issues. The test assertions were retained and adapted to the real host boundaries.
- Complete targeted acceptance run exercised DocsOverview, DocsExamples, DocsSettings, FormAppearance, Tabs, the complete interaction suite and every full-coverage family/language case in both configured Chromium projects: 273 passed, 218 intentionally skipped, one DataGrid render-count case reached its unchanged 15-second timeout while the parent was running the complete Node suite concurrently. All full-coverage routes and other affected suites passed. See `browser-acceptance.log`.
- The exact DataGrid render-count case passed in isolation without competing Node work in 9,554ms, retaining all original assertions and the 15-second budget. See `browser-datagrid-isolated.log`. The timeout screenshot showed the dark/compact settings had already applied; no dialog/overlay blocked the page.
- A clean complete interaction-suite rerun then passed all 39 active cases with 39 intended viewport skips in 106.51 seconds; the DataGrid case took 11,297ms. See `browser-interactions-final.log`. This run preceded the independent-review correction to the production section boundary. The parent will verify that final boundary with one complete 54-file browser run; prior results are diagnostic evidence, not acceptance of the corrected boundary.
- Final parent-owned acceptance completed in `remaining-verification.log` after the CSS boundary and notification lifetime repairs: all 54 source suites in both configured Chromium projects, 107 passed project-files / 1 intended viewport skip; 1,243 passed cases, 225 intended viewport skips, zero failures, 326.15 seconds. The unchanged notification navigation case passed in 592ms and the DataGrid render-count case in 10,347ms. All 24 formal baseline hashes remain unchanged. Packed consumers and both static deployment bases also passed; see `completion.md` for staged execution and interruption limits.
