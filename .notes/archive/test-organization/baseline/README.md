# ExUI workspace

This repository contains the Exre visual foundation as three pnpm workspaces:

- `packages/tokens`: private, framework-neutral token sources. The generated artifacts ship through the public package's `@exre/exui/tokens` subpath.
- `packages/components`: publishable React 19 component library `@exre/exui`. The single public package owns the component root, `@exre/exui/style.css`, and the framework-neutral tokens subpath.
- `packages/docs`: private React Router/Fumadocs documentation site. Its interactive examples consume the public `@exre/exui` exports; the former Showcase remains under `src/showcase` as an internal example and test fixture.

The repository root is a private orchestration layer and is never published.

## Development

Use Node.js 24 and pnpm 11.9.0 (the version declared in `package.json`). Run commands from the repository root:

```bash
pnpm install
pnpm dev
```

`pnpm dev` builds Tokens and components, then starts the docs site and watches library source. Successful library rebuilds refresh the page, resetting example drafts; docs edits retain their usual hot updates. Package manifests and build configuration require a restart. The docs site continues consuming built public package entries.

| Command | Purpose |
| --- | --- |
| `pnpm check` | Prepare required types and run lint, type checks and source consistency checks without Chromium. |
| `pnpm verify` | Run the complete CI workflow, including builds, regressions, Chromium, packed consumers and both docs deployment bases. |
| `pnpm build` | Build Tokens, components and the static docs site. |
| `pnpm typecheck` / `pnpm lint` | Run a focused workspace check. |
| `pnpm test [files...]` | Prepare the public library and run all or selected Node regression files. |
| `pnpm test:visual` / `pnpm verify:pack` | Run browser fixtures or isolated packed consumers after a build. |
| `pnpm changeset` / `pnpm version-packages` | Maintain release notes and package versions. |

Component builds and source checks restore and verify their pinned source cache automatically. A complete cache works offline. Browser gates need Chromium installed once with `pnpm --filter @exre/exui-docs exec playwright install chromium`. `verify` leaves the final docs output built and verified at `/exui/`; standalone `build` honors `EXUI_DOCS_BASE` (default `/`). See [Testing](TESTING.md) for focused checks, low-frequency generation/restoration commands and hosting prerequisites.

See [Testing](TESTING.md) for the full CI checks, visual-test prerequisites, and skill example validation. See [Contributing](CONTRIBUTING.md) for Changesets and DCO requirements.

## Docs hosting

The production target is [ExUI documentation](https://exre-dev.github.io/exui/). After the one-time GitHub Pages setup, each successful `main` push CI saves its verified `/exui/` static output; the independent `Docs Pages` workflow deploys that exact artifact when its commit is still current. Pull requests run the existing checks without publishing a preview. Docs deployment and npm Release consume CI independently.

An administrator must select **GitHub Actions** in **Settings → Pages → Build and deployment → Source**, allow `main` in the `github-pages` environment without a required reviewer for every deployment, and then rerun the current `main` CI with **Re-run all jobs**. The deployment summary reports the URL returned by Pages. Workflow files and local checks alone do not establish that this target is enabled or that the hosted site has passed acceptance.

Artifacts are retained for seven days. If a source artifact is missing or expired, rerun the current `main` CI in full. For a failed Pages run whose source is still current and available, use **Re-run all jobs** on `Docs Pages`; partial reruns are not the recovery interface. Old commits are skipped. To restore older content, revert it through a new `main` commit and CI. See [Testing](TESTING.md#github-pages-delivery) for configuration checks and hosted acceptance.

## Package usage

React consumers should follow [`packages/components/README.md`](packages/components/README.md). Framework-neutral consumers can import `@exre/exui/tokens`, `@exre/exui/tokens/style.css`, and `@exre/exui/tokens/font.css` without installing React. The internal `@exre/exui-tokens` workspace is never published.

Changesets version the single public package. The private docs site and the private tokens workspace must never be selected for a release.

## Documentation

- [React package usage](packages/components/README.md): installation, themes, forms, managed notifications, Glass surfaces, sizing, and bundled chart APIs.
- [Internal token workspace](packages/tokens/README.md): token builds, formats, and length policy.
- [ExUI skill](skills/exui/SKILL.md): component selection, composition, local references, and complete examples.
- [Docs content](packages/docs/content/en/getting-started/quick-start.mdx): the maintained site source; `packages/docs/content/zh-CN/` contains its Chinese counterpart.
- [Form reference](skills/exui/references/exui/form.md): configured and composed forms, validation, and lifecycle.
- [Notification reference](skills/exui/references/exui/notifications.md): `Toaster`, `toast`, and managed `ExMessage` calls.
- [Token customization](skills/exui/references/exui/token-customization.md): CSS overrides, theme scope, and foundation references.
- [Fumadocs theme](skills/exui/references/exui/docs-theme.md): the optional `@exre/exui/docs/theme.css` stylesheet and its consumer prerequisites.

`.docset.json` records the committed source snapshot reviewed for these documents and the additional contribution/testing guides. It advances only after the complete tracked scope has been reviewed and its documentation checks pass.

## Building content that scales with ExUI

ExUI's scalable dimensions use `rem` against a 16px root font size. When the application changes that root size, custom React content should scale alongside the library: prefer Tokens and rem-based typography, spacing, icons, and ordinary radii. Keep intentional fixed effects such as `1px` borders in pixels. Reusable components should preserve the application's root-font setting.

For example, React `style={{ padding: "1.5rem", borderWidth: "1px" }}` scales the padding while keeping the border width fixed; `padding: 24` would remain 24px.

Follow the [root-font scaling and density guide](skills/exui/references/exui/scaling.md) when building custom content. It covers scalable lengths, fixed effects, density, and validation at the application's root font size.
