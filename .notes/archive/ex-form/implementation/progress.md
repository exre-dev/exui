# SDD ledger — plan: .notes/ex-form/plans/2026-10-19-form-api-consolidation-implementation.md

Original baseline ed28078d4cf40b3b187c38c4ff08510953f7dc3c; feat/blocks-optimization; clean staged/unstaged/untracked. Existing linked worktree verified, no CodeGraph. .notes is ignored; review its complete current contents explicitly.

Ruling: latest explicit user instruction overrides all backward compatibility requirements in spec/RFC. Remove old APIs/types/docs rather than preserve aliases/URLs/share IDs. Keep useful scenarios and current behavior. Cost: downstream consumers need the upgrade guide.

Preflight contracts:
| Tasks | Shared producer/consumer | Result |
| --- | --- | --- |
| 1 | Strict Form branches and one owner | No coordinator rewrite; canonical names only |
| 2 | Canonical catalog, source ownership and galleries | Keep module/URL group independent from navigationGroup |
| 3 | Public exports, capability notes and generators | Source-review acceptance after source and note audit |
| 1/2 | Public API / handwritten examples | Task 2 migrates examples after task 1 builds |
| 1/3 | Exports / consumer skill and inventories | Removed types explicitly documented in upgrade guide |
| 2/3 | Canonical examples / capabilities and generated snippets | Generators run on settled sources |

Baseline checks passed on Node 24.22.0 and pnpm 11.9.0: docs:content:check (202 pages), tokens build, component build, focused Form and ExItem Chromium suites. Full output: baseline-browser.log.
Validation node PATH prefix: C:/Users/grimeszhang/AppData/Local/npm-cache/_npx/387698761821791d/node_modules/node/bin.
No production edits started before user scope change. Only this invocation's ignored notes exist. No agents previously spawned.

Validation: pnpm tokens:check passed, 56 tests, zero failures, Node 24.22.0. Task 1 agent /root/form_api owns components/form types/fixture/form browser suites. First phase writes compiler/browser contracts before core implementation.

Task 1 implementation done: /root/form_api. Component build, workspace strict Zod3/4, SSR and 172 Chromium cases pass; no full pack yet. Independent /root/form_api_review reviewing exact task-1-paths.txt and report. No commits.

Task 1 review: confirmed callable Standard Schema rejection (P2) in Form runtime schema guard; reviewer finishing consolidated report. Must add a callable schema regression, accept object or function structural schemas, rerun relevant checks and re-review before Task 2. upstream:check passed Node24 after core change.

Task 1 review round 1 completed: 21 code paths + report, 1 blocking P2 callable schema; strict compiler and SSR repro; 42 extra browser cases pass. /root/form_api fixing with regression; re-review full set pending. Task 2 brief clarifies raw group86/3 versus presentation87/2, no mapping for removed legacy URLs.

Environment readiness for pack: run-command.mjs resolves npm/Corepack adjacent to process.execPath. Added a node_modules junction inside the cached Node24 bin directory to C:/Program Files/nodejs/node_modules (target verified; no repository source change). Actual shared runner invocation now passes: npm10.9.4, pnpm11.9.0 on Node24. Initial node -e PowerShell quoting probe failed syntax; corrected with stdin code, exit0.

Task 1 P2 fixed by original implementer; build + both strict Zod compilations, FormApi12tests and SSR smoke pass after one-line guard repair. Same reviewer /root/form_api_review re-reviewing full task1 set. Parent verify:pack running session98463, log verify-pack.log; Node24 runner ready.

Task 1: complete (working-tree, no commits; independent review round2 PASS, 0 findings). Reviewer independently ran174 Chromium cases, both strict Zod fixtures and SSR smoke; scope digest9349a2d23c71f016096a0de0ef1655ec3790c7f04085e2f31fd23ac408d7b392. Task 2 implementation /root/form_docs started from task-2-brief.md, owns docs site/examples and docs scripts; must preserve Task1 core/tests. Full final working-tree review still mandatory.

Validation: pnpm verify:pack exited0 on Node24.22.0, npm10.9.4, pnpm11.9.0 after Task1 final reviewed component build. Log verify-pack.log. Includes isolated public tarball installs, React browser, strict Zod3/4, SSR and parsed submit. Do not rerun unless component artifact/fixture behavior changes.

Task2 canonical IDs settled: Form exui-form-1, exui-form-models, exui-form-configured; Field exui-field-settings, exui-field-display, exui-field-layout. Focused new inventory/ownership/snippet Node tests red then green; content generate198pages (99/locale). Actual host tests running. Two adapted consumer files autocomplete/c-autocomplete-12.tsx and number-field/c-number-field-6.tsx necessarily migrate FormItem to FormField; raw upstream/cache/revision/coverage locks remain unchanged. Task1 test-only TS2698 spread-as-never was caught by docs typecheck; /root/form_api repairing only FormApi test while docs worker validates.

Task2 implementation done, 41 code/doc paths + report; all scoped tests/typecheck passed. Actual Field geometry regression red then green in real ComponentExamplesHost after own-container CSS fix; all six independently exported Form/Field sources compile. docs snippets write still requires Task3 capability IDs; no source-review acceptance run. Task1 FormApi type-erasure fix also included for Task2 review. Task2 source report and paths recorded.

Task2 review round1 HOLD, 2P2 confirmed in real dev Chromium: nested PreviewGrid shrinks project/configured wide cards (426/872px); Settings responsive Field missing FieldGroup named container. /root/form_docs fixing both with actual-host regression tests; full42-path rereview pending. Task3 authored-only guidance/registry/.ai/upgrade preparation /root/form_guidance runs disjoint from Task2 paths; MUST stop before generation/source acceptance and independent authored review. Public/core source acceptance digest saved packed-source-acceptance.json:204files b9e3c6f9a449f861b7136ba78574b7ea72bb81ed624f2cda5b6f593b686e9ce5, based on passed verify:pack.

Task2 P2 fix wave stopped: Form nested grids removed; Settings FieldGroup plus bounded app source-inline responsive utilities bridge added. New source path packages/docs/app/styles/docs.css; fullTask2review now43paths. Actual browser18cases, source3cases and docs typecheck pass. Reviewer must also consider exported Settings source responsiveness with app-only scanner fix; IDs/owners unchanged.

Task3 authored stopped,33paths including full ignored upgrade-guide/report. Fresh packed9skill examples and11,715links pass;9newpublicsymbols associated. No source-review acceptance or bounded/lock/inventory generation. Authored review next. Task2 round2 exported Settings standalone Vite+Chromium geometry passes wide1376/narrow256, independent of app-only CSS. Reviewer examining residual legacy ContentSizingPreview before verdict.

Task3 authored review /root/form_guidance_review PASS/PASS,0P0-P3, complete33paths including ignored full upgrade guide/report; four guide TSX blocks match compiled examples, links pass. Controlled generation still waiting Task2 final functional fixture repair/re-review. Do not add new vertical mode to ContentSizingPreview (none exists); only repair existing hardcoded horizontal/narrow recipe.

Task2 residualP3 fix stopped: reused canonical own-item layout CSS for ContentSizingPreview, cap variable defaults16rem, supports existing12/18rem selection; no new mode/UI/state. New test path FormContentSizing.vrt.test.tsx => full44pathscope. Red reproduced both browsers; green4cases includes widecap/narrowfullwidth/draft and canonical default256px unchanged; docs typecheck/source2cases/diffcheck pass. Full44path review round3 pending.

Validation: pnpm lint whole workspace passed exit0 on Node24 after authored/source fixes, before non-code controlled generation. Existing-style warnings remain; log lint.log. No claim of zero warnings.

Task 2: complete (working-tree, no commits; round3 full44scope PASS/PASS,0P0-P3; original2P2+residualP3 closed). Independent fresh browser8pass+4skipped/Node3pass/diffcheckpass; prior Settings standalone browser verified. Task3 authored independentPASS. /root/form_guidance resumed controlled source-review acceptance and capability/reference/inventory/snippet/content generation; must not adopt upstream identities or alter components. Parent final broad gates start after generation worker stops. Also add verified Field style-layer bridge architectural note via codebase-documenter.


Final validation: authored Tasks 1-3 and controlled generation complete. The final independent review closed the remaining TESTING count facts. Full typecheck/lint/root build/pack and root static/sharing passed. Shared-worktree concurrent builds interfered with a second visual run and subpath verification; these failed/interrupted records are retained, not counted as successes.

An isolated detached worktree at the original baseline with this invocation's source overlay passed the full Chromium suite: 113 files passed, 5 skipped; 1261 cases passed, 249 existing skips; 0 failures. Its independent /exui/ production build and matching serial static/browser/sharing verification passed (1479 paths, 204 documents, 1271 examples/triples). A previous shared-output capture was rejected for a root-only link and replaced by that independent build; its rejected log remains.

Concurrent test-directory reorganization was preserved. The final scope follows the explicitly mapped destinations rather than restoring external deletions. Current relocated Form/Field/actual-gallery/appearance tests passed in isolation (18 files, 184 cases), followed by all 33 relevant relocated Node cases. Runtime sources, guide examples and public export contracts were not changed by that reorganization. Scope and evidence are in final-validation.md and external-test-relocations.json; the final independent verdict is recorded separately in final-review.md. No commit was requested or created. Unrelated dev/runner/CI/release changes remain outside this delivery.
