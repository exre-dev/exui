# Testing

Test observable public behavior and meaningful failure paths with the least expensive suitable test; use a real browser when interaction or layout needs proof. Avoid tests that merely restate implementation.

Keep regressions and dedicated fixtures in the owning package's `tests/`: Node files use `*.test.mjs`, browser files use `*.vrt.test.tsx`. Classify every Node suite in `scripts/test-suites.mjs`.

Use Node.js 24 and pnpm 11.9.0 from the repository root.

**Development:** run focused tests as needed (`pnpm test:node <files...>`); do not automatically run aggregate checks after edits or at task completion.

**Local commits:** do not run tests or trigger them from commit hooks.

**Before creating or updating a PR:** run the reduced local checks with `pnpm check` (fast Node/SSR regressions, no Chromium); reuse its last successful result if the submitted changes are unchanged.

**CI (PR and main):** run five isolated Windows jobs with `pnpm verify:part <checks|docs-root|docs-prefix|visual|consumers>`. Together they retain all Node/integration, desktop browser, packed-consumer, example and dual-base documentation checks. CI does not run the `chromium-mobile` project. A failed job does not cancel its siblings; `ci-gate` requires every group to succeed. New PR commits cancel older runs for that PR; main runs remain independent.

**Complete local reproduction:** `pnpm verify` runs the same groups sequentially, prepares the public library once and leaves the verified `/exui/` docs output last. Run it only when explicitly requested. `pnpm test:visual` remains an explicit opt-in for both desktop and mobile fixtures after a build; use `pnpm verify:part visual` for the desktop-only CI group.

**CI performance:** target 15 minutes from the first job start through `ci-gate`, including setup, downloads and builds. Measure cold and warm caches separately and report queue time separately; a job timeout is not evidence that the target passed.
