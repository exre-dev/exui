# Testing

Test observable public behavior and meaningful failure paths with the least expensive suitable test; use a real browser when interaction or layout needs proof. Avoid tests that merely restate implementation.

Keep regressions and dedicated fixtures in the owning package's `tests/`: Node files use `*.test.mjs`, browser files use `*.vrt.test.tsx`.

Use Node.js 24 and pnpm 11.9.0 from the repository root.

**Development:** run focused tests as needed (`pnpm test:node <files...>`); do not automatically run aggregate checks after edits or at task completion.

**Local commits:** do not run tests or trigger them from commit hooks.

**Before creating or updating a PR:** run the reduced local checks with `pnpm check` (fast Node/SSR regressions, no Chromium); reuse its last successful result if the submitted changes are unchanged.

**CI (PR and main):** run complete `pnpm verify`, retaining all integration, browser and packed-consumer coverage. Reproduce full CI locally only when explicitly requested.
