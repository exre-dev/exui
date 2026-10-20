# Node test migration

Node tests now live under their package test directories. Production maintenance and build implementations remain under `scripts/` and package `scripts/` directories. No forwarding test shims were added.

`node-path-map.json` records every old/new test, verifier and fixture location, including the skill example verifier that was missing from the initial move. The eight snapshot-only fixture destinations in that map were subsequently deleted as approved pruning: `showcase-copy-aria-contracts.json`, `showcase-copy-binary-retentions.json`, and `showcase-copy-retentions-{1..6}.json`. Retained fixtures are the docs site baseline, fixed display keys and Trace literal evidence.

Relative imports, `new URL` repository/package roots, consumer child verifier paths, Token policy script imports and release runtime dependency/script roots were corrected. Generated consumer module imports retain their fixture-relative targets. `tasks.test.mjs` runner/root URLs are corrected; parent owns its runner-contract assertions and the new discovery suite.

The duplicate real Vite source endpoint test was removed from docs-sharing and merged into docs-dev-sources. Both `/` and `/exui/` use isolated temporary Vite cache directories and retain whole JSON/Markdown equality, highlighted JSON, query handling, `no-cache`, HEAD, missing ID and non-HTML error assertions. Both JSON and Markdown HEAD/missing behavior are exercised.

Only two docs-example-copy tests were pruned: the source expression retention inventory and exact ARIA initializer inventory. Formatting, runtime dictionaries, finite display/ARIA branches, fixed display keys, consumer-boundary copy, Trace semantics and SSR cases remain. The snippets Form summary preservation case remains and passed.

## Validation

All commands ran from the repository root using Node 24.22.0, with its directory prefixed to PATH for child processes. Shared build output was reused; no build was triggered by this worker.

```powershell
node --test packages/tokens/tests/*.test.mjs packages/components/tests/node/*.test.mjs packages/components/tests/upstream/*.test.mjs packages/components/tests/tooling/run-command.test.mjs packages/components/tests/tooling/watch.test.mjs packages/components/tests/tooling/dev.test.mjs packages/components/tests/tooling/release/*.test.mjs packages/components/tests/tooling/skill/*.test.mjs packages/docs/tests/node/*.test.mjs
```

Result: 254 tests, 253 passed, 1 failed, 50.968 seconds. The sole failure was the existing docs library reload watcher deadline under the parallel batch. Chart Chromium checks, standalone shared example consumer/browser checks, both merged real Vite source endpoint bases, release runtime, ReUI, Token policies and all other docs tests passed. Full output: `node-targeted.log`.

```powershell
node --test packages/docs/tests/node/docs-library-reload.test.mjs
```

Result: 1 passed, 0 failed, 602 ms total (test 332 ms). No timing limit or behavior was changed. The latest shared-worktree fixture content was preserved. Full output: `node-reload-rerun.log`. The batch failure and isolated pass remain distinct evidence; the complete batch was not rerun or declared green.

```powershell
$map = Get-Content .notes/test-organization/node-path-map.json -Raw | ConvertFrom-Json
foreach ($entry in $map.PSObject.Properties) {
  if ($entry.Value.EndsWith('.mjs') -and (Test-Path -LiteralPath $entry.Value)) {
    node --check $entry.Value
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
}
```

Result: all 41 mapped MJS files passed syntax checks. Dedicated packed-consumer and static-built-site gates were not independently executed by this worker; parent owns integrated build and runner verification. No commits were created.

## Integration review repair

Updated the dedicated packed-consumer gate entry in `.github/CODEOWNERS` from `/scripts/verify-packages.mjs` to `/packages/components/tests/consumers/verify-packages.mjs`. Both existing owners, `@wojzj57 @Xiamolc007`, and all other CODEOWNERS lines are unchanged. `Test-Path` confirmed the new destination exists and the old source is absent. The scoped CODEOWNERS diff contains exactly this one path replacement; `git diff --check -- .github/CODEOWNERS` passed. This metadata repair required no rebuild or test restart.

Extended the same ownership preservation to the three migrated release Node suites (`npm.test.mjs`, `package-contract.test.mjs`, `runtime.test.mjs`) by adding `/packages/components/tests/tooling/release/ @wojzj57 @Xiamolc007`. The original `/scripts/release-bootstrap/` rule remains for production release scripts. Directory inspection confirmed the three migrated files exist and the production script directory remains. Both directory rules retain exactly the original owners. The final scoped CODEOWNERS diff contains the consumer path replacement and this release directory addition; `git diff --check -- .github/CODEOWNERS` passed. No build or test was run for this follow-up metadata repair.
