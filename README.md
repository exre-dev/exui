<a name="exui-workspace"></a>

# ExUI

**English** · [简体中文](README.zh-CN.md)

**The shared visual foundation for Exre interfaces.**

React 19 components, framework-neutral design tokens, and a consistent theme system. Build with shared controls, compose typed forms, and add Glass surfaces where they fit.

**[ExUI Docs](https://exre-dev.github.io/exui/)** · [Quick start](#quick-start) · [Development](#development) · [Contributing](CONTRIBUTING.md)

![ExUI component catalog in light mode, showing Accordion, Alert, Alert Dialog, Aspect Ratio, Attachment, Autocomplete, Avatar, and Badge previews.](.github/assets/readme-components-light.png#gh-light-mode-only)
![ExUI component catalog in dark mode, showing Accordion, Alert, Alert Dialog, Aspect Ratio, Attachment, Autocomplete, Avatar, and Badge previews.](.github/assets/readme-components-dark.png#gh-dark-mode-only)

Real components from the ExUI documentation catalog, shown with demonstration content. Explore the interactive examples in [ExUI Docs](https://exre-dev.github.io/exui/), available in English and Simplified Chinese.

## Capabilities

- **Components for application interfaces.** Controls, dialogs, navigation, data grids, charts, scheduling, and media, exposed through one React 19 package.
- **Tokens and themes.** Shared colors, typography, radii, and shadows, with light, dark, and pitch-black themes and density controls. Token entries also work without React.
- **Typed forms and notifications.** Configure or compose typed `Form` fields; use `Toaster` and `toast` for messages, Promise results, and loading updates by ID.
- **Opt-in Glass surfaces.** Add the shared material treatment to supported components, with an opaque themed background when `backdrop-filter` is unavailable.

## Package usage

### Quick start

Install the single public package and its React host runtime:

```bash
npm add @exre/exui react@19 react-dom@19
```

For TypeScript projects, also install `@types/react@19` and `@types/react-dom@19` as development dependencies. Import the complete stylesheet once, then use components from the public entry:

```tsx
import "@exre/exui/style.css"
import { Button } from "@exre/exui"

export function App() {
  return <Button>Continue</Button>
}
```

The React entry is ESM-only and requires React 19. The stylesheet includes token variables and fonts; application layout uses your own CSS or utility setup. Follow the [React package guide](packages/components/README.md) for themes, forms, Glass, notifications, and complete usage examples.

For framework-neutral use, import `@exre/exui/tokens`, `@exre/exui/tokens/style.css`, and the optional `@exre/exui/tokens/font.css`. These entries do not require React. The internal `@exre/exui-tokens` workspace is never published.

## Documentation

Start with **[ExUI Docs](https://exre-dev.github.io/exui/)** for the component catalog, interactive examples, and guides in English and Simplified Chinese.

- [React package usage](packages/components/README.md): installation, themes, forms, notifications, Glass surfaces, sizing, and bundled chart APIs.
- [Internal token workspace](packages/tokens/README.md): token builds, formats, and length policy.
- [ExUI skill](skills/exui/SKILL.md): component selection, composition, local references, and complete examples.
- [Docs content](packages/docs/content/en/getting-started/quick-start.mdx): the maintained site source; `packages/docs/content/zh-CN/` contains its Chinese counterpart.
- [Form reference](skills/exui/references/exui/form.md): configured and composed forms, validation, and lifecycle.
- [Notification reference](skills/exui/references/exui/notifications.md): shared `Toaster` and `toast`, Promise results, and loading updates by ID.
- [Token customization](skills/exui/references/exui/token-customization.md): CSS overrides, theme scope, and foundation references.
- [Fumadocs theme](skills/exui/references/exui/docs-theme.md): the optional `@exre/exui/docs/theme.css` stylesheet and its consumer prerequisites.

`.docset.json` records the committed source snapshot reviewed for these documents and the additional contribution/testing guides. It advances only after the complete tracked scope has been reviewed and its documentation checks pass.

## Development

This repository is a private pnpm workspace. Only `@exre/exui` is published:

| Workspace | Responsibility |
| --- | --- |
| `packages/tokens` | Private, framework-neutral token sources; generated artifacts ship through `@exre/exui/tokens`. |
| `packages/components` | The React 19 `@exre/exui` library, complete stylesheet, and public token entries. |
| `packages/docs` | Private React Router/Fumadocs site; examples consume only public package entries. The former Showcase remains in `src/showcase` as an internal fixture. |

Use **Node.js 24** and **pnpm 11.9.0**. From the repository root:

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
| `pnpm test` | Run all retained regressions: Node, Chromium, packed consumers, Skill examples and both docs deployment bases, preparing their builds. |
| `pnpm test:node [files...]` | Prepare the public library and run all or selected Node regression files under package `tests/` directories. |
| `pnpm test:visual` / `pnpm verify:pack` | Run browser fixtures or isolated packed consumers after a build. |
| `pnpm changeset` / `pnpm version-packages` | Maintain release notes and package versions. |

Use `pnpm check` before creating or updating a PR; it needs no Chromium installation. Component builds and source checks restore and verify their pinned source cache automatically. A complete cache works offline. Explicit browser/complete-CI reproduction needs Chromium installed once with `pnpm --filter @exre/exui-docs exec playwright install chromium`. `verify` leaves the final docs output built and verified at `/exui/`; standalone `build` honors `EXUI_DOCS_BASE` (default `/`).

See [Testing](TESTING.md) for test authoring and execution timing. See [Contributing](CONTRIBUTING.md) for Changesets and DCO requirements.

Changesets version only the public package; the private docs and tokens workspaces must never be selected for release.

## Docs hosting

The production target is [ExUI Docs](https://exre-dev.github.io/exui/). `pnpm build` writes the static site to `packages/docs/build/client`. Set `EXUI_DOCS_BASE=/exui/` for a subpath build; supply the same base when verifying and hosting it.

Host the complete directory, including `.data/`, search indexes, assets, and example source files, without an SPA fallback or Node service. Each example share route provides readable HTML, `source.md`, and `source.json` from one source export. `pnpm check` includes bilingual content and link checks; CI also verifies static output, source exports, browser behavior and packed consumers.

<details>
<summary>GitHub Pages setup and recovery</summary>

After the one-time GitHub Pages setup, each successful `main` push CI saves its verified `/exui/` static output; the independent `Docs Pages` workflow deploys that exact artifact when its commit is still current. Pull requests run the existing checks without publishing a preview. Docs deployment and npm Release consume CI independently.

An administrator must select **GitHub Actions** in **Settings → Pages → Build and deployment → Source**, allow `main` in the `github-pages` environment without a required reviewer for every deployment, and then rerun the current `main` CI with **Re-run all jobs**. The deployment summary reports the URL returned by Pages. Workflow files and local checks alone do not establish that this target is enabled or that the hosted site has passed acceptance.

Artifacts are retained for seven days. If a source artifact is missing or expired, rerun the current `main` CI in full. For a failed Pages run whose source is still current and available, use **Re-run all jobs** on `Docs Pages`; partial reruns are not the recovery interface. Old commits are skipped. To restore older content, revert it through a new `main` commit and CI.

</details>

## Building content that scales with ExUI

ExUI's scalable dimensions use `rem` against a 16px root font size. When the application changes that root size, custom React content should scale alongside the library: prefer Tokens and rem-based typography, spacing, icons, and ordinary radii. Keep intentional fixed effects such as `1px` borders in pixels. Reusable components should preserve the application's root-font setting.

For example, React `style={{ padding: "1.5rem", borderWidth: "1px" }}` scales the padding while keeping the border width fixed; `padding: 24` would remain 24px.

Follow the [root-font scaling and density guide](skills/exui/references/exui/scaling.md) when building custom content. It covers scalable lengths, fixed effects, density, and validation at the application's root font size.
