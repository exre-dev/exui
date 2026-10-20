# Command simplification

Status: approved by the maintainer in the current conversation.

## Contract

- Reduce the 37 root scripts to exactly these 11: `dev`, `build`, `typecheck`, `lint`, `test`, `test:visual`, `check`, `verify`, `verify:pack`, `changeset`, `version-packages`.
- Preserve every existing validation and maintenance capability. Remove obsolete root aliases; update CI and maintained documentation to the new commands. Low-frequency operations use existing Node scripts or filtered workspace commands.
- `check` performs the required Token/declaration preparation, lint, type checks and lightweight consistency checks without Chromium, production docs builds or packed consumers.
- `verify` is the complete local/CI workflow: source and token checks, builds, all Node regressions, docs/skill checks, visual tests, packed consumers, release configuration, and sequential root and `/exui/` docs builds with matching static/sharing checks. Preserve detailed stage output and fail immediately. Avoid repeating prerequisite builds/checks within one invocation.
- `test` runs Node regressions; `test:visual` retains the Vitest Chromium gate; `verify:pack` retains the isolated packed-consumer gate. Document build/browser prerequisites clearly and support focused test files without adding root aliases.
- `dev` initially builds Tokens and components in order, starts docs only when the public artifacts are ready, watches library source and rebuilds affected targets serially. A successful later rebuild invalidates docs transformations and triggers a full page reload; docs source edits retain normal HMR. Ignore generated Token CSS. Failed later builds stay recoverable; initial failures must stop startup. Ctrl+C releases child processes and watchers.
- Use Node.js 24 and pnpm 11.9.0. Preserve unrelated dirty/untracked work. Do not commit, push, merge or publish.

## Boundaries

The docs site continues consuming built public package entries. No new task-runner dependencies, source aliases, test deletion, screenshot-baseline updates or changes to release/Pages trust boundaries.

The worktree already contains Form/Field and docs changes. Update overlapping command documentation in place, preserving its current content. Knowledge updates after implementation describe verified runtime constraints, not this task's narration.
