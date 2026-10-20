# Local check verification

Date: 2026-10-19. Scope: the approved local-check/full-CI implementation.

## Result

`pnpm check` completed with exit code 0 in **85.52 seconds**, including all public-package preparation. Its 28 fast Node/SSR suite files executed **230 tests: 230 passed, zero failed, skipped or cancelled**. The Node regression phase itself took 14.885 seconds.

Runtime: Node.js 24.22.0 and pnpm 11.9.0. The host's default Node.js 22 was not used; Node.js 24 invoked the installed Corepack pnpm entry, with that Node directory first in the process-local PATH.

The dependencies and pinned upstream source cache were already available. Before starting the timer, these output directories were absent: Token `dist`, component `dist` and `types`, docs `build`, `.generated`, `.source` and `.react-router`. Their original contents were moved to verified paths inside this worktree's ignored task workspace, not deleted. Outputs not recreated by `check`, including the existing production docs build, were restored afterward.

The measured run included source locks, both Token module builds and policies, one public component build and declaration internalization, docs type generation/checking, lint, source/content/Skill consistency, and all fast regressions. Production docs output remained absent throughout the command. No Chromium or full integration acceptance was run locally.

The changed orchestration/discovery tests also completed separately on Node.js 24 before the measured run: 15 passed, zero failed, with the intended assertions observed failing before implementation.

## Preserved CI coverage

The PR and main-push workflow configuration is unchanged and still invokes complete `pnpm verify`. Full orchestration retains the all-Node discovery glob, all browser/screenshot suites, isolated consumers, batch snippets/Skill examples, production styles, release/whitespace checks and both static docs bases. The explicit suite inventory accounts for all 36 Node files exactly once: 28 fast and 8 integration.

An independent reviewer found no actionable change defects and passed both static spec-compliance and quality review. Local `check` success and source inspection do not establish that remote CI, Chromium or hosted deployment has passed.

## Initial failed measurement

The initial cold-output attempt exited 1 after 30.13 seconds in the unchanged declaration bundler, before any fast regressions. It reported bare third-party references. Declaration output was then rewritten after that command exited (15:56:13Z versus the failure around 15:55:49Z), and a read-only scan found zero remaining offenders without a source change. This is evidence of concurrent output rebuilding. After compiler processes became idle, the same cold-output command completed successfully. The declaration gate was retained throughout.

The raw command logs, backup manifests, implementation report and review report remain in the task's ignored `.superpowers/sdd/2026-10-19-local-check/` workspace. No commit, push, publication or remote CI run was performed.
