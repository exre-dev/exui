# Form API consolidation — delivery evidence

## Scope

The implementation follows the supplied design/RFC with the user's explicit override: the project is unpublished, so old APIs, types, pages and share IDs are removed without compatibility aliases or redirects. `Form` owns the three strict entry branches, `FormField` binds stateful fields, and standalone `Field` composition owns presentation. The upgrade guide is `../upgrade-guide.md`.

The invocation began on `feat/blocks-optimization` at `ed28078d4cf40b3b187c38c4ff08510953f7dc3c` with no staged, unstaged or untracked changes. No commit, push, version application, publication or deployment was requested or performed.

`final-touched-paths.txt` is the explicit delivery scope. It includes authored ignored notes, deletions, controlled generation and canonical-equal generation targets. Build output, dependency caches, temporary browser output and raw validation logs are evidence rather than maintained source artifacts. The original design and RFC remain historical input documents.

Another development task subsequently changed the same working tree's dev/watch/task runner, Vite reload integration, root command surface, CI/release files and related documentation. Those runtime changes are outside this invocation. Existing Form edits in the shared `TESTING.md` and `.ai/architectures/release/delivery-pipelines.md` remain intact; unrelated hunks were preserved. The final review reads shared-file context while evaluating only this task's Form changes. Its conclusion does not approve the unrelated changes.

## Passed checks

All gates used Node 24.22.0 and pnpm 11.9.0. Several root command aliases below were renamed by the concurrent task after their successful execution; the underlying focused scripts and recorded results remain the evidence.

| Check | Result and evidence |
| --- | --- |
| `pnpm tokens:check` | 56 tests, exit 0; `tokens-check.log` |
| `pnpm upstream:check` | All four source/export/foundation/Luma checks, exit 0; `upstream-check.log` |
| `pnpm typecheck` | All workspaces and public declarations, exit 0; `typecheck.log` |
| `pnpm lint` | Exit 0; existing warnings remain; `lint.log` |
| `pnpm build`, base `/` | Exit 0; 198 content pages, 1,479 prerender paths, 1,271 examples; `build-root.log` |
| `pnpm verify:pack` | Exit 0; isolated npm/pnpm consumers, public entries, CSS/types, strict Zod 3/4 consumers, SSR, production build and Chromium parsed-output submission; `verify-pack.log` |
| Consumer skill examples | Nine fresh-packed strict TSX consumers passed; `task-3-report.md` |
| Capability generation/check | 31 capabilities and 176 controlled targets agree; reviewed source snapshot accepted after independent source review; `task-3-report.md` |
| Capability/reference regression tests | 38 passed; `task-3-report.md` |
| Snippets and complete exported consumers | 118 verified modules and 128 complete family source consumers compile; `task-3-report.md` |
| Skill references/inventories/links | Locked reference check, 1,547 public names, 361 token paths, 607 CSS properties, 1,382 Markdown files and 11,713 local links passed; `task-3-report.md` |
| Full docs-content Node suite | 29 passed; `test-docs-content.log` |
| Full docs-sharing Node suite | 12 passed, including standalone consumer compilation; `test-docs-sharing.log` |
| Docs styles | Two Node tests and real Chromium isolated-utility check passed; `test-docs-example-styles.log`, `docs-example-styles-check.log` |
| Static inventory regression after migration fixes | Seven passed; exact baseline update removes two retired families and four retired IDs, adds two canonical native Form IDs, and preserves all other frozen records and exclusions; `task-2-report.md` |
| Full affected browser files after migration fixes | 55 passed, 55 existing viewport skips, exit 0; `test-visual-migration-fixes.log` |
| Root static site | Exit 0; HTTP/assets/404, overview, source lifecycle, clipboard/settings, three search queries and failed-index retry, real examples; `static-root.log` |
| Root sharing | Exit 0; 1,271 HTML/Markdown/JSON triples over HTTP; `sharing-root.log` |
| Docs `/exui/` build | Exit 0; matching subpath artifact; `build-subpath.log` |
| Independent validation preparation | Detached baseline worktree plus this task's source overlay; offline install reuses all 849 packages, independent Token/component builds and docs prepare pass; `isolated-*.log` |

The passed public tarball's component/token source evidence is recorded in `packed-source-acceptance.json`. Public runtime source did not change afterward. The concurrent task changed script entries in both workspace manifests and relocated the Form fixture; the public component package's exports, dependencies and published file selection did not change. The fixture's current destination is recorded in `external-test-relocations.json`; its contracts are checked against the accepted isolated source, rather than treating a missing old path as an intentional Form deletion.

## Final gates

| Gate | Result |
| --- | --- |
| Isolated complete Chromium suite | Exit 0; 113 passed files / five skipped, 1,261 passed cases / 249 existing skips, zero failures, 437.29 seconds; `test-visual-isolated.log` |
| Isolated subpath build, static and sharing | Exit 0; independent production rebuild, then serial static/browser and sharing verification of that exact output; 1,479 paths, 204 documents, 1,271 examples and 1,271 sharing triples; `build-subpath-isolated.log`, `static-subpath-isolated.log`, `sharing-subpath-isolated.log` |
| Current relocated Form browser tests | Exit 0; 18 files and 184 cases, zero failures/skips; `test-relocated-form-browser.log` |
| Current relocated relevant Node tests | Exit 0; 33 cases across content/sharing/snippets/static; `test-relocated-docs-node.log` |
| Final independent complete-path review | Recorded separately in `final-review.md` |

## Failure history and isolation

The first complete Chromium run finished with 1,257 passed, four failed and 249 skipped. All four failures were unmigrated test contracts: one global `Project name` locator now matched two independent forms, two navigation assertions still expected 91 families, and a sharing assertion visited the removed ExItem page. The three full affected files then passed with 55 passed and 55 existing viewport skips, without deleting cases or updating screenshot baselines.

The first root static check exposed the unchanged historical catalog fixture. Its accepted inventory was updated by exactly the eight authorized record additions/removals. The next check exposed two old search selectors that omitted the canonical URL's trailing slash; actual built index IDs and Fumadocs' rendered option-ID construction verified the fix. The complete root static and sharing gates then passed.

A second shared-worktree complete-browser attempt logged transient Vite failures to resolve `@exre/exui`, followed by unrelated Sidebar/Filters/screenshot failures. The overlapping shared-worktree subpath static attempt timed out in a source drawer. These attempts are retained as failed/interrupted evidence, not counted as passing or used to change unrelated production code, assertions or screenshot baselines.

To establish an independent final result, `D:/Exre/exui/.worktrees/form-consolidation-validation` was created detached at the original baseline. Only this invocation's source overlay was copied; concurrent runtime/tooling changes were excluded. `isolated-validation-source.json` records all 279 overlay source paths and hashes, independently checked against both worktrees. Its complete Chromium suite passed without changing assertions or screenshot baselines.

A candidate shared-output capture contained 6,561 files with a reproducible digest (`isolated-static-capture.json`), but the deployment-base check rejected a root-only document link at `/exui/`. The digest established copying integrity, not valid deployment semantics. That capture is rejected evidence (`static-captured-subpath-rejected.log`). The final subpath gate instead builds production docs independently in the isolated worktree, then verifies that exact output serially, without shared output producers.

During final review, the concurrent task relocated test files from `scripts/` and `src/showcase/` into package-owned test directories, consolidated the Form surface checks and removed some legacy shell suites. This task preserves that reorganization. `external-test-relocations.json` records each affected old path and its new destination or external deletion. New destinations containing this task's contracts are included in the final exact-path review; unrelated runner changes remain excluded. Current test-directory context was copied into the isolated worktree and the 184 Form/browser cases and 33 relevant Node cases passed after the move. The earlier complete 1,261-case result remains evidence for the unchanged runtime, not a claim that unrelated test-reorganization work was independently accepted.

After all gates and independent source/capture comparisons completed, the temporary detached worktree was deregistered and removed. Git's first removal hit Windows' filename-length limit; only the verified leftover `form-consolidation-validation` directory was then removed with an extended-length path. The original working tree, other worktrees and shared package caches were preserved. All source summaries, results and failure history remain in this task's original `.notes` directory.

Local static/browser and packed-consumer evidence does not establish hosted deployment or registry publication. Neither was requested.
