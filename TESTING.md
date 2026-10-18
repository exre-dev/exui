# Testing

Run validation from the repository root with pnpm 11.9.0 and Node.js 24.

## Source maintenance gates

The maintained inventory is `packages/components/upstream/reui/inventory.json`; builds and checks do not depend on local development notes. The component source inventory is pinned to commit `067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a`. `pnpm upstream:restore` restores ignored raw source and stylesheet caches from that exact commit, verifying all source and asset SHA-256 locks before publishing any downloaded files. A complete cache is verified offline. An explicit `EXUI_REUI_CHECKOUT` supplies committed Git blobs from a local checkout instead of GitHub; no developer-specific checkout path is assumed.

`pnpm upstream:check` runs the four maintenance checks: `reui-sync.mjs --check` verifies all 148 frozen source files and adapted files against canonical LF hashes, independent of checkout line endings; `reui-exports.mjs --check` verifies the explicit package-root surface (82 component modules plus four hooks, 1102 symbols); `reui-foundation-diff.mjs --check` verifies the reviewable patches for the 62 basic UI files; and `generate-reui-luma.mjs --check` verifies selected Luma recipes. Checks that need raw files restore missing cache entries automatically. They do not rewrite accepted adapters, locks, patches, or generated CSS. `--update`, `--accept-adapters`, `--rebase-upstream`, and `--write` remain explicit maintainer update modes.

After building the component package, run `pnpm test:upstream` for restoration, inventory, export, CSS closure, and declaration-scanner regressions. Density and Rating accessibility are covered by the packed browser gate below. These Node `*.test.mjs` tests live in `scripts/` and `packages/components/scripts/`. Restore tests cover cold and partially missing caches, offline reuse, LF/CRLF parity, HTTP and local Git reads, tampered downloads/cache files, invalid locks/paths, and failure atomicity. Update tests use temporary local Git repositories and never require live GitHub responses or a personal checkout. The export tests also cover Questionnaire and the explicit upstream `form` exception, pin public context hooks/types, and reject internal React context values. CI restores and checks the snapshot before workspace validation and runs the regression suite after the build.

The packed consumer below verifies the required MIT notice and pinned revision in the tarball. Token semantic aliases, including `--primary`, `--accent`, and feedback colors, resolve through `--exui-*` references; `pnpm tokens:check` runs the alias regression. The private docs site has separate content, source-export, static-output, and browser gates; the retained Showcase fixture and consumer skill have their own checks below.

The export and recipe regressions also cover CRLF checkouts and caches. Read-only checks preserve their original bytes while still rejecting real generated-content drift.

## Static docs site

`packages/docs` uses React Router framework mode, Fumadocs UI and MDX, and Vite. The maintained `content/en/` and `content/zh-CN/` trees each cover 91 component-family pages and ten guides. The content manifest is generated from MDX sources; run `pnpm docs:content:check` and `pnpm test:docs-content` after changing content or routing. `pnpm docs:snippets:verify` typechecks marked, complete examples against the built public package; each usage guide contains one verified module, while the Skills installation guide contains shell commands and no verified module. A page containing a snippet does not by itself prove that a browser interaction works.

The same Node suite covers static-output normalization and the example asset base adapter. The adapter preserves locked source files while adding the deployment prefix to photo, flag and emoji URL literals during Vite transformation; root deployments are unchanged. The production static verifier checks representative image decoding and emoji data responses under the selected base.

The content-link regressions cover source-relative MDX links, locale routes, anchors, and example links under both `/` and `/exui/`. The MDX compiler resolves them with `lib/content-links.mjs`. The static verifier also checks every rendered same-origin document link against the prerender inventory, so source validation alone cannot hide a broken runtime URL.

`scripts/docs-dev-sources.test.mjs`, included in `pnpm test:docs-content`, starts the real docs Vite configuration on an ephemeral port for both `/` and `/exui/`. It checks highlighted JSON for the code view, Markdown for Copy source, HEAD responses, and missing example IDs without mocking source requests. Run `node --test scripts/docs-dev-sources.test.mjs` for this focused regression. This development-server check complements the production static verifier; it does not require a docs build.

`pnpm build` prerenders the route inventory to `packages/docs/build/client`. For a root deployment, run `pnpm docs:static:verify`. For a subpath deployment, set `EXUI_DOCS_BASE=/exui/` for the build, then run `node scripts/verify-docs-static.mjs packages/docs/build/client /exui/` on that same output. Serve the entire directory at the matching base without an SPA fallback: it includes route HTML, `.data/`, search indexes, assets, and `examples/<id>/source.md` and `source.json`. The static verifier checks the no-fallback server, readable no-JavaScript HTML and source files, routing and assets, and representative Chromium interactions. It is local static-output evidence, not hosted deployment acceptance.

The docs application mounts examples after host effects. It uses one theme driver for light, dark, and pitch-black (`dark` plus `pitch-black` classes); density is scoped to previews. The browser checks cover these app behaviors, while the old `src/showcase` suites remain independent legacy fixtures. The production-facing `DocsExamples.vrt.test.tsx` and static verifier are the relevant new-site browser gates.

`DocsExamples.vrt.test.tsx` covers the modal source drawer on desktop and mobile: title-link copying and tooltip feedback, lazy file loading and retry, highlighted file selection, full Markdown versus single-file copying, Escape/close/overlay dismissal, focus return, responsive geometry, and retained preview drafts. Its host fixtures inject JSON source responses; the sharing fixture supplies real Markdown exports. The static verifier exercises both real source formats in the built site, including aborted requests and theme changes. Run the focused browser suite with `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsExamples.vrt.test.tsx` after building the public package.

`Attachment.vrt.test.tsx` compares media corner radii plus measured card insets against the outer radii through the built public package and the real assistant-reply example. This checks concentric curves rather than equal radius numbers. It covers icon/image media, sizes, orientations, densities, root font scaling, scoped radius tokens and explicit media overrides on desktop and mobile. Build the component package first, then run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Attachment.vrt.test.tsx`.

`DocsOverview.vrt.test.tsx` covers the shared overview's family coverage, displayed example counts, inert previews, preview-only density and Router card navigation on desktop and mobile. The static verifier additionally checks prerendered overview links without JavaScript, all representative previews, language changes and the brand link back to the overview. Run the focused component suite with `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsOverview.vrt.test.tsx`; run `pnpm docs:static:verify` after the matching docs build for application-route evidence.

`DocsSettings.vrt.test.tsx` checks the app's small transparent Select triggers, Escape focus return, persisted theme and density, and language navigation with retained drafts and safe query/anchor handling on desktop and mobile. Run it with `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsSettings.vrt.test.tsx`. The static verifier selects settings through their accessible combobox and option roles.

CI runs the content regressions, public snippet typechecks and root static verifier after the workspace build. It also builds the docs workspace again with `EXUI_DOCS_BASE=/exui/` and verifies static output and sharing against that same prefix. These checks run sequentially so each verifier reads the output from its matching build.

## GitHub Pages delivery

CI uploads the final verified `/exui/` directory only for successful main push runs. `Docs Pages` consumes that exact CI run and attempt without rebuilding. The source guard and the serialized deployment guard both reject superseded commits; Pages must already be enabled with a matching `/exui/` base. Both uploads include hidden files. Deployment failures do not add a new dependency to npm Release.

Run `node --test scripts/docs-pages.test.mjs` on Node.js 24 and `actionlint .github/workflows/ci.yml .github/workflows/docs-pages.yml` after changing these workflows. The Node tests execute the actual inline guards with a substituted GitHub lookup and real temporary filesystem trees. They cover source identity, malformed IDs, rerun names, stale commits, API failures, prefix mismatches, missing/empty site files, example sources, metadata and symlink escapes. They do not assert YAML line ordering or claim that GitHub accepted a deployment.

After root build checks finish, set `EXUI_DOCS_BASE=/exui/`, run `pnpm --filter @exre/exui-docs build`, then run both `pnpm docs:static:verify packages/docs/build/client /exui/` and `pnpm docs:sharing:verify packages/docs/build/client /exui/` against that same output. Inspect the full artifact and Pages tar paths and file digests, including dotfiles, route data, search indexes and example sources. The repeatable tar and pinned action checks live in `scripts/docs-pages.test.mjs`.

After merging the workflow into the default branch, an administrator must select GitHub Actions as the repository's Pages source, allow main in the `github-pages` environment without a reviewer required on every deployment, and rerun the current main CI with **Re-run all jobs**. Use the actual deployment `page_url` as evidence; the expected target is `https://exre-dev.github.io/exui/`. Workflow syntax, local browser checks and tar inspection do not establish remote token/environment acceptance or hosted behavior.

Observe PR and fork PR runs without uploads/deployment, a successful main deployment from the exact artifact, failed or ineligible sources without preparation, full reruns with distinct attempt names, and concurrent/late runs skipping stale commits. Missing, expired or corrupt artifacts and wrong Pages prefixes must fail without fallback. Do not deliberately break main to test negative cases; record unexecuted hosted scenarios as unverified.

In a logged-out browser, verify both locale overviews and representative detail-page direct loads and refreshes, search and language changes, route data, CSS/fonts/images/emoji, interactive examples, and direct HTML/Markdown/JSON source access. An unknown route must return HTTP 404 and the static error page. Then verify a later successful main change updates the site automatically. Keep local checks, Actions/deployment results and public-site acceptance as separate evidence.

Recovery uses **Re-run all jobs**. A missing or expired source requires a full current-main CI rerun; a failed Pages run can be rerun in full only while its source is still current and retained. Partial reruns are not the recovery interface. After service errors, inspect actual deployment state before retrying; content rollback uses a new revert commit through main CI.

## Example and legacy Showcase fixture maintenance

The retained Showcase fixture has a separate pinned example inventory in `packages/docs/upstream/reui/`. Its source lock and coverage file track every upstream example ID, source hash, family mode, and disposition. The `scripts/docs-examples.mjs` commands run from the repository root:

```bash
pnpm docs:examples:lock
pnpm docs:examples:restore
pnpm docs:examples:generate
pnpm docs:examples:report
pnpm docs:examples:check
pnpm test:docs-examples
```

Use `lock` only when establishing or reviewing the pinned source inventory; it refuses an unreviewed change to an existing lock. `restore` verifies local cached source bytes and restores missing files from the pinned commit (or from an explicit `EXUI_REUI_CHECKOUT`). `generate` writes marked family registrations and the page loader map from coverage; it does not adapt the handwritten examples. `report` prints dispositions and family modes. `check` verifies identity, coverage, imports, generated files, license and present cache hashes offline. It reports missing cache bytes without downloading them. `test:docs-examples` exercises these contracts with temporary fixtures. `test:docs-example-copy` runs twelve formatter/AST cases and twelve cases against the built public package through SSR. They check complete Chinese display templates and argument bindings, raw user parameters, explicit retention evidence for remaining templates, string additions and Trace static preview text, fixed label sets, public prop and ARIA copy, canonical saved values, current-locale emoji display, and same-instance Headless Tree label changes. The SSR cases require a component build first. These Node checks do not establish browser focus, drag/drop, hydration, or interactive language-switch acceptance.

After building the component package, run the copy gate from the repository root:

```bash
pnpm test:docs-example-copy
```

`TraceCopy.vrt.test.tsx` exercises a real language switch after resending a webhook, checking that the appended attempt and its count remain in the same preview instance. It also checks the Chinese DNS record-count sentence and verifies that changing from Chinese to English during a reasoning stream clears the old completion timer and continues the same run. Run it with `pnpm --filter @exre/exui-docs exec vitest run src/showcase/TraceCopy.vrt.test.tsx` after building the component package.

The final `check` requires zero `pending` examples and zero `legacy` families. During migration only, `pnpm docs:examples:check -- --allow-pending` can inspect an incomplete batch; never use it for final acceptance. The current coverage file maps all candidate examples to adapted files and all component families to generated loaders. File Upload patterns remain the explicit exclusions; a `gap` needs a specific missing public capability, source evidence, and follow-up. Do not count ExUI extension previews as locked example IDs. The docs workspace build runs strict source coverage and asset checks before TypeScript and Vite.

Images, flags, and emoji data have separate source and SHA-256 metadata in `packages/docs/upstream/reui/{asset,flag,emoji}-provenance.json`. Verify the archived local bytes, path safety, original flag relationships, and emoji package/license provenance with:

```bash
pnpm test:docs-example-assets
pnpm docs:examples:assets:check
```

Managed public assets retain their original bytes through Git checkout filters, including text licenses and flag metadata. The asset regression suite exercises a real checkout with `core.autocrlf=true` before validating the recorded hashes.

The asset check is offline and read-only. A local asset hash pass does not establish that every image paints or every browser resource succeeds; the visual suite checks those at runtime.

The retained Showcase examples compile private utilities with Tailwind 4.3.2 in Vite and Vitest. The private sheet scans only `examples/` and `pages/components/`, adds no Preflight or root brand values, and follows the public stylesheet in the shared style entry. After a docs build, verify the compiled application CSS with:

```bash
pnpm test:docs-example-styles
pnpm docs:examples:styles:check
```

The style checker also compiles an isolated utility fixture and verifies its dark variant in Chromium. Both the default Tailwind theme and the semantic mapping use `inline reference`: arbitrary properties otherwise cause Tailwind to emit a default palette or semantic aliases on `:root`/`:host`. Keep the no-root-output assertion enabled. `ShowcaseExampleStyles.vrt.test.tsx` runs under `pnpm test:visual`; it checks representative source layouts and interactions, public control styles, local assets, and instance continuity across language, theme, and density changes.

`Resizable.vrt.test.tsx` mounts the real nested `c-resizable-4` and plain `c-resizable-2` examples with the complete docs stylesheet. It checks full-width horizontal separators, 1px vertical separators with and without grips, visible line paint, pointer dragging in both directions and keyboard resizing across three themes, both densities and desktop/mobile viewports. Run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Resizable.vrt.test.tsx` after building the public package. This catches application CSS layers collapsing the horizontal separator's hit area; public-stylesheet-only tests do not cover that integration.

`Questionnaire.vrt.test.tsx` loads all seven real Questionnaire examples and a plain Card with the complete docs stylesheet. It checks that visible header titles and descriptions stack beside the trailing action without overlap, then advances through all three steps of the first example with real controls. It covers both languages, three themes, both densities and desktop/mobile viewports. Run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Questionnaire.vrt.test.tsx` after building the public package. The suite catches application-layer grid shorthands overriding CardAction's row placement and records no screenshot baselines.

The same suite drives the checkbox and radio examples through real clicks, checks visible checkmarks or inner dots with nonzero geometry and distinct foreground/background colors, and verifies deselection and switching hide the old mark. These cases cover all three themes, both densities and both viewports. They catch application-layer `hidden` utilities suppressing selected indicators even when the native input and option background correctly update.

Its action sizing cases compare Previous, Skip, Next and Submit with a real Button across four sizes and both densities on desktop and mobile. They advance optional questions through real Skip clicks to measure all four actions, catching any extra minimum height that overrides the shared Button size.

Its answer control sizing cases exercise the real `c-questionnaire-3` in both languages and densities: desktop write-in inputs remain 36px, single-line choices stay below 40px, and mobile controls retain a 44px minimum. Typing a write-in answer clears the selected radio. The real `c-questionnaire-1` in a narrow container checks that descriptions and wrapped labels grow without clipping. These cases use the complete docs stylesheet to catch application utilities overriding the public responsive minimum height.

`ButtonGroup.vrt.test.tsx` loads all 57 real ButtonGroup examples with the complete docs stylesheet. It checks connected inner corners, adjacent geometry and shared borders in both orientations, across both languages, three themes, both densities and desktop/mobile viewports. It also covers text `asChild`, a Select inside a form with its hidden native control, keyboard menu opening, Escape focus return and retained input drafts. Build the public package first, then run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/ButtonGroup.vrt.test.tsx`. It records no screenshot baselines.

## Showcase example sharing

After building the component package, run `pnpm test:docs-sharing` on Node.js 24. The Node tests cover stable IDs across upstream, extension and ExUI previews, transitive local source imports, dependency versions, selected ExUI preview extraction, escaped readable HTML and import path boundaries. Five representative exported sources compile as standalone projects; the RTL extension also produces a Vite build and retains its column layout in Chromium. These fixtures link to the installed public package and dependencies, so they establish local source consumption rather than a clean registry install.

`pnpm build` generates `examples/<id>/index.html`, `source.md`, and `source.json` from the same export for every shareable preview. Run `pnpm docs:sharing:verify` after the build for the source-export contract, and `pnpm docs:static:verify` for the current site's complete static output and browser behavior. For a subpath build, pass its output and matching base explicitly to `node scripts/verify-docs-static.mjs <output-directory> /exui/`. Local verifier results do not establish that a deployed host serves those files correctly.

`ShowcaseSharing.vrt.test.tsx` remains a legacy fixture for the old shell. `DocsExamples.vrt.test.tsx` exercises current docs pages; source export and static verification cover generated share routes. Historical Button screenshot baselines belong to the retained fixture.

Sharing requires an absolute pathname base (`/` or `/exui/`). Deploy the complete `packages/docs/build/client` output, including generated HTML, Markdown, JSON, `.data/`, search and existing example assets. No server rendering service or API is required. Share links use paths rather than hash routes.

## Release automation

Release automation tests use Node's built-in test runner and live under `scripts/release-bootstrap/*.test.mjs`. Test files use the `*.test.mjs` suffix. They use temporary local Git repositories and inject the npm Registry boundary; they must not publish packages, write GitHub state, or depend on live npm responses.

```bash
pnpm test:release
```

The suite covers no-op planning, scoped tags, release diff validation, annotated tag recovery and conflicts, npm Registry failures and idempotency, private-workspace exclusion, legacy tokens-tag rejection, and packed-manifest contracts. It never exercises a real npm publication.

Run `pnpm release:verify` to check the release declaration, Changesets configuration, quality scripts, and required provider workflows. Release setup and external activation requirements are recorded in `.ai/knowledge/release/release-automation-activation.md`.

## Packed-consumer gates

`pnpm verify:pack` packs the public `@exre/exui` tarball and installs it into throwaway fixtures outside the workspace, using default npm and pnpm peer behavior without `--legacy-peer-deps`, `--omit=peer`, or workspace overrides. The React fixture also compiles `minimal-es2023.tsx` with strict TS6/Bundler, ES2023 standard libraries, React types only, and `skipLibCheck: false` to catch vendored Shiki declaration requirements without Node ambient types. The gates assert:

- tokens-only installs contain no React, React DOM, their type packages, or component implementation libraries anywhere in the dependency tree, and the font dependency installs;
- the tokens ESM and CommonJS entries agree, stay deeply frozen, and the component root fails with a missing-React error when React is absent;
- token-only TypeScript consumers compile under Bundler and NodeNext resolution with `skipLibCheck` disabled and no React types, covering both `.mts` and `.cts` consumers; the `.cts` fixture uses a typed `import = require`, asserts invalid properties and assignments are rejected, and checks that the CommonJS declaration entry was loaded;
- the tokens stylesheets build standalone with resolvable font assets and no component Tailwind styles;
- a React consumer type-checks public component imports with `skipLibCheck` disabled, produces a production build, renders `GlassSeed`, the form, and Chart components on the server, and shares exactly one React instance with the package. Its `glass-types.tsx` fixture pins the glass prop's shape with `@ts-expect-error` cases — a non-boolean `glass`, `glass` on a DOM element, and children on `GlassSeed` — so widening the prop, leaking it onto an intrinsic element, or making the seed accept content turns the gate red instead of passing silently;
- the production build runs in Chromium: chart primitives imported through the root `Recharts` namespace render both data points, ExUI legend content, and tooltip values that change on hover; Dialog opens through its portal, the form submits, and Escape restores focus to the trigger; and the packed stylesheet ships the glass material, checked through computed styles only — the seed declares exactly one filter under the documented id and publishes its reference on the document root, the `ex-glass` class paints a blurring backdrop on an element that is not an ExUI component, the danger surface keeps the danger material, the edge adds no border width, and the `glass` prop leaves no DOM attribute. These read computed styles; they do not judge how the refraction renders.
- `Dialog` replaces the removed `Modal`: `removed-modal-types.tsx` rejects the old root export, the server smoke checks the trigger and portal boundary, and Chromium checks the portal, description association, narrow viewport, draft continuity, outside click, focus return, and reduced motion. The packed consumer also creates a TanStack Table v9 instance through the ExUI root namespace and renders DataGrid, mounts a Glass CodeBlock, and requires Shiki's TypeScript grammar chunk to load and produce highlighted tokens.

The packed Chromium consumer also mounts `ExMessageContext`, completes an `ExMessage.loading` handle before host activation, triggers `ExMessage.success`, and checks toast cleanup and renewed notifications after host unmount/remount. The existing `packages/docs/src/showcase/ExMessage.vrt.test.tsx` is intentionally deferred with the Showcase migration.

The packed browser gate also compares Button geometry at 16px and 32px root font sizes, checks its fixed border and capsule radius, and checks portal Dialog padding at the larger root size. It checks nested dark and pitch-black semantic backgrounds and a scoped brand override, then measures Button, Input, Textarea, Select, NativeSelect, and InputGroup across three themes and both densities. Each scope also overrides inherited control height, inline padding, and gap and checks the computed geometry after CSS transitions finish. A focused Input keeps its draft when density changes, Glass toggling keeps Button geometry, editable Rating accepts ArrowRight, End, and Home with focus returning to the first option, and read-only Rating exposes a meter value. These artifact-level checks replace the former density and Rating source-marker tests.

ExForm adds two separate consumers with exactly Zod **3.25.28** and **4.6.5**, installed outside workspace overrides. `scripts/form-consumer-fixture.mjs` defines the same source for both. Each consumer compiles with strict TypeScript and `skipLibCheck: false`, builds production browser and SSR entries, and server-renders ExForm plus an empty file control with throwing `document`/`File` accessors. It checks that RHF, resolvers and Standard Schema packages are absent from the installed tree and that the consumer and package share React. The tokens-only npm and pnpm gates also reject RHF, Zod, resolvers and Standard Schema packages throughout the tree.

The form type fixture proves exact Zod Input/Output inference (string draft to numeric output), typed watch tuples and complete list items. `@ts-expect-error` cases reject invalid paths/values, text controls on number models, unknown enum options and enum array options, wrong custom render values, scalar lists, readonly model arrays used by mutable controls/lists, external RHF lookalikes, and ExForm's conflicting form/schema/defaultValues props. Readonly custom render and `setValue` remain accepted. An unused directive fails the real compiler, so these assertions cannot silently widen.

`scripts/verify-form-browser.mjs` serves each isolated production build in Chromium. Both Zod versions use a real async age refinement that awaits a microtask before deciding validity. The gate submits an invalid age, requires the schema message and `aria-invalid`, proves no callback occurred, then submits a valid age and requires a numeric parsed result, one callback, and an unchanged string draft. It fails on browser runtime errors. Existing chart, Dialog, native form, glass and scaling gates remain part of `verify:pack`.

The browser assertions live in `scripts/verify-react-browser.mjs` and run as part
of `pnpm verify:pack`. The controller reuses the Showcase's pinned Playwright
dependency, while the browser serves only the isolated consumer's built files.
Install Chromium before running the packed-consumer or visual gates:

```bash
pnpm --filter @exre/exui-docs exec playwright install chromium
pnpm upstream:restore
pnpm upstream:check
```

CI runs these gates on Node.js 24; local runs on older Node versions are informative but do not replace the CI gate.

## Public capability documentation coverage

`Badge.vrt.test.tsx` validates all 23 public Badge variants through the built
package and the complete docs stylesheet. It composites computed backgrounds
in Chromium, then requires at least 4.5:1 label contrast and matching icon
colors on page/card surfaces in all three themes and both densities, including
opt-in Glass on those standard surfaces. Geometry checks cover all five sizes;
compatibility checks cover `asChild`, class/inline color overrides in an isolated
public-stylesheet frame, the primary/focus foreground tokens and live semantic
color customization. Custom palettes or arbitrary image backgrounds
are outside this default-color guarantee. It records no screenshot baselines.

```bash
pnpm --filter @exre/exui build
pnpm --filter @exre/exui-docs exec vitest run src/showcase/Badge.vrt.test.tsx
```

`packages/docs/exui/capabilities.json` records consumer-visible ExUI additions and adaptations against the pinned component source. Its bilingual Markdown fragments supply the bounded ExUI sections in maintained docs and the opening ExUI notes in the skill's component-family references. Keep API selection, visible defaults and important constraints in those notes; shared Glass, scaling, theme and form rules remain in their linked guides. The optional downloaded reference archive is preserved as upstream pattern material.

After editing a capability or its authored fragments, regenerate the bounded docs sections and skill references, then check them:

```bash
pnpm docs:capabilities:generate
pnpm test:docs-capabilities
pnpm docs:capabilities:check
node scripts/exui-skill/sync-references.mjs --check
```

The capability gate checks current public names, source evidence, docs pages, skill references and share-example associations. Its separate `source-review.json` records reviewed component source and exports: when implementation changes, inspect the affected public contracts and update the capability notes and examples before explicitly accepting the new source snapshot:

```bash
node scripts/exui-capabilities.mjs --accept-source-review
```

Ordinary generation and checking never accept changed implementation automatically. Newly exported names must be associated with a capability, or individually explained in the registry's `exportExclusions` object before source acceptance. Accepted associations remain required by later checks even if the implementation is unchanged. This snapshot detects a need for review; it does not infer the semantic completeness or factual accuracy of documentation. New or changed behavior still needs human source review. Do not update the snapshot merely to silence a failure.

The repository ships an accepted baseline. Only when establishing the first reviewed baseline in a new repository is `node scripts/exui-capabilities.mjs --bootstrap-source-review` appropriate; ordinary acceptance requires the previous snapshot. Capability generation works without the optional `resources/components` archive and verifies the existing reference inventory, catalog and hashes before modifying bounded notes and their lock entries. It cannot adopt unrelated changes to the upstream reference body. The separate archive-based `sync-references.mjs --write` remains the path for refreshing downloaded upstream material when that archive is present.

Build the public package first, then run `pnpm docs:snippets:verify` to compile the complete `tsx verify` modules and capability-linked independent example sources. Keep the existing first-example `source="..."` excerpt on each family page; additional capability examples use `tsx verify` rather than a second source excerpt. Run `pnpm docs:content:check`, `pnpm test:docs-content`, `pnpm test:docs-sharing` and the existing skill reference checks after changing generation or associations.

The focused `packages/docs/src/showcase/ExuiCapabilities.vrt.test.tsx` exercises Button/ActionButton shapes, the two Select APIs and the production source drawer using the new family extensions. Build the component package before running it:

```bash
pnpm --filter @exre/exui-docs exec vitest run src/showcase/ExuiCapabilities.vrt.test.tsx
```

After building docs, `pnpm docs:static:verify` and `pnpm docs:sharing:verify` validate the real family routes and independently exported HTML/Markdown/JSON sources. A browser fixture with injected source responses does not replace these built-site checks.

## ExUI skill reference maintenance

The consumer skill under `skills/exui/` contains instructions, local references and examples. Its maintenance scripts live under `scripts/exui-skill/` and run from the repository root with the Node/pnpm versions above:

```bash
node --test scripts/exui-skill/sync-references.test.mjs
node scripts/exui-skill/sync-references.mjs --check
node scripts/exui-skill/update-inventories.mjs --check
node scripts/exui-skill/verify.mjs
```

The committed `skills/exui/references/generated/component-reference-lock.json` pins the adapted Markdown inventory, canonical LF SHA-256 hashes and catalog. `sync-references.mjs --check` validates that snapshot without requiring the optional `resources/components/` download archive; when the archive is present, it also compares references against freshly adapted source documents. Missing or edited references, extra files and catalog changes fail the check.

After changing downloaded documents under `resources/components/`, run `node scripts/exui-skill/sync-references.mjs --write` to regenerate the catalog, references and lock together. Use `--lock` only to explicitly adopt an already reviewed adapted snapshot, including the initial archive-independent lock; checks never create or update locks. The synchronizer resolves every component link before writing, preserves third-party links, and has Node `*.test.mjs` coverage for link conversion, ExUI adaptation, offline integrity and stale source detection. Edit ExUI contracts under `skills/exui/references/exui/` directly.

The optional archive may contain only the documents downloaded for a later source revision when it has a `.partial` marker. In that mode `--write` first verifies the complete existing reference lock, then adapts the downloaded subset, resolves their links against the combined inventory and updates the catalog and lock. Untouched older references remain byte-for-byte locked; a bad download, missing target or tampered older reference fails before any generated write. `--check` verifies both the complete lock and every document present in the partial archive. Without `.partial`, the archive remains a complete snapshot and extra generated references fail.

After changing public APIs or Tokens, build Tokens and components in dependency order with `pnpm --filter @exre/exui-tokens build` followed by `pnpm --filter @exre/exui build`, then run `node scripts/exui-skill/update-inventories.mjs --write`. The inventories read current TypeScript root exports and built public Token artifacts. Both `--check` modes detect stale output without rewriting it. `verify.mjs` checks local files, heading targets and Markdown reachability from `SKILL.md`.

Validate this skill's complete examples against a packed public package with the existing isolated gate:

```bash
node scripts/exui-skill/verify-examples.mjs
```

These are repository maintenance commands; consuming applications use the skill's bundled references and their own validation tools. Reference and example checks do not establish visual appearance or rendered Glass refraction.

## Skill example gates

The ExUI skill ships complete, compilable examples under `skills/exui/examples/`. Run the isolated example gate from the repository root:

```bash
node scripts/exui-skill/verify-examples.mjs
```

`verify-examples.mjs` packs the public `@exre/exui` tarball, installs an isolated consumer outside the workspace (the tarball plus `react`, `react-dom`, `lucide-react`, and exactly `zod@3.25.28`), and asserts:

- discovery: `examples/**/*.tsx` is collected recursively with no manual manifest; the directory contains only `.tsx` files and is never empty;
- import allowlist: examples may import only `react`, the public `@exre/exui` entries (`@exre/exui`, `@exre/exui/style.css`, and the `tokens` subpaths), `lucide-react` (the documented consumer-side icon dependency), and the root `zod` entry (consumer-owned schema implementation). Zod subpaths, private package paths, RHF/resolvers and other implementation libraries remain rejected by a static scan;
- documentation links: every example is linked from at least one skill document, and no document links to a missing example file;
- compilation: all examples compile in a single strict TypeScript pass (`skipLibCheck` disabled, Bundler resolution, `react-jsx`) against the packed tarball.

`node scripts/exui-skill/verify-examples.mjs --self-test` proves the gate rejects bad input on temporary copies: a forbidden import, an orphan example that no document links, a type-broken example (rejected by the real compiler with the diagnostic pointing at the broken file), and a dangling document link. The gate never writes inside the workspace. The reference maintenance checks above validate local links and generated inventories without rewriting them. These checks do not establish the factual accuracy of prose or compile Markdown code blocks. Review those against the public source and declarations separately.

CI runs the reference maintenance checks and example gate after the workspace build. The toast API surface in examples is the nine-method list (`success`, `error`, `warning`, `info`, `message`, `loading`, `promise`, `custom`, `dismiss`); `toast.custom` accepts an `(id) => ReactElement` render function.

The example self-test also proves Zod imports compile in the isolated fixture while Sonner, RHF, resolvers, private ExUI paths and Zod subpaths remain forbidden. Zod 4 compatibility belongs to the independent pack fixture rather than a workspace override.

## Chart style and watch regressions

After building the workspaces, run `pnpm test:regressions` on Node.js 24 with
Chromium installed. `scripts/chart-style.test.mjs` renders the public
`ChartContainer` through React SSR, then parses the result in Chromium. It
checks that external configuration cannot create a script or unrelated CSS
rule while valid theme colors, CSS variables, color mixing, and escaped chart
ids and keys still work. `scripts/watch.test.mjs` runs the real watcher in an
isolated temporary workspace with a fake pnpm build process. It checks that
generated Token CSS causes no rebuild and that one source edit causes one
Token build followed by one component build. Neither test writes to the source
workspace. `scripts/run-command.test.mjs` also exercises the shared command
runner used by packed-consumer and skill-example gates: literal arguments
through paths with spaces, working directories, exit diagnostics, expected
failures, missing executables, and real npm/pnpm CLI invocation without a
shell. On Windows, npm and pnpm use the installed Node distribution's npm
and Corepack JavaScript entries.

```bash
pnpm build
pnpm test:upstream
pnpm test:regressions
```

## Visual tests

`Tabs.vrt.test.tsx` renders the real vertical `c-tabs-3` and horizontal `c-tabs-6` examples through the public package and complete docs stylesheet. It compares all four effective corner radii and the vertical track's inset against one trigger's height, then switches between the first, last and middle tabs to check only the active item has a shadow. Cases cover three themes, both densities, root-font scaling and desktop/mobile viewports; separate cases preserve flat line tabs, primary styling, disabled items and the active item's keyboard focus ring. Run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Tabs.vrt.test.tsx` after building the public package. Inspection images are local review artifacts rather than screenshot baselines.

`NavigationMenu.vrt.test.tsx` uses the production `ComponentExamplesHost` and complete docs stylesheet to check every popup link stays inside the viewport and receives a hit at its center. It covers English/Chinese, three themes, both densities and desktop/mobile; the four desktop examples additionally check clicking and Escape dismissal. This catches both application-layer width overrides and preview-container clipping, without screenshot baselines. Run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/NavigationMenu.vrt.test.tsx` after building the public package.

`PhoneInput.vrt.test.tsx` checks all eight real examples through the public package with the complete docs stylesheet: matching heights and backgrounds across three themes, both densities, root-font scaling and desktop/mobile viewports, plus disabled, invalid and read-only states. Its production `ComponentExamplesHost` fixture verifies the rounded search input, portal density, keyboard country selection, visible empty results and Escape dismissal. Run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/PhoneInput.vrt.test.tsx` after building the public package; it records no screenshot baselines.

`Sonner.vrt.test.tsx` triggers every button in all 21 real Sonner examples and compares the painted card's four corners and width with its Toaster. It covers desktop/mobile viewports, custom surfaces in all three themes, root font scaling, an explicit host radius override and the updatable card's progress-to-success states. Assertions inspect the custom card inside Sonner's title/content wrappers rather than those unstyled wrappers. Run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Sonner.vrt.test.tsx` after building the public package; it records no screenshot baselines.

The docs workspace visual suite uses Vitest Browser Mode with Playwright Chromium. It includes the production docs UI and retained Showcase fixture; baselines are platform-specific and CI runs them on Windows.

Build the workspaces before running visual tests: docs examples and the retained Showcase fixture consume the public component package's generated JavaScript and CSS entries.

```bash
pnpm build
pnpm test:visual
```

`ComponentsOverview.vrt.test.tsx` checks the default Components home route, all 91 family cards and their grouped ordering, card/Logo/sidebar navigation, browser history, theme/density/language updates and lazy loading of every real thumbnail. Previews are inert and each card has a single accessible navigation link. The desktop cases save review images under `output/components-overview-{light,dark}.png`; these are inspection artifacts, not screenshot baselines.

`Accordion.vrt.test.tsx` checks expanded text geometry in the real FAQ and nested examples with the complete docs stylesheet. It covers English and Chinese, both densities, desktop and mobile, reopening, nested item changes, and wrapping after narrowing the container. Assertions compare content rectangles with panel bounds instead of recording screenshot baselines. Run the focused suite with `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Accordion.vrt.test.tsx` after building the public package.

`ShowcaseExampleCoverage.vrt.test.tsx` traverses each of the 86 component routes and five ExUI routes separately in English and Chinese on desktop. For every adapted ID it scrolls the preview into view and checks order, real content, unique DOM IDs, live label/ARIA references, in-scope SVG paint references, loaded images, browser exceptions, and failed resource responses. It also keeps extension previews outside the official ID set. `ShowcaseExampleInteractions.vrt.test.tsx` exercises representative controls, portals, Chart painting, Sidebar/Tree scopes, Stepper and DateSelector panel links, drafts, settings, and cleanup through actual browser interaction. `CalendarCopy.vrt.test.tsx` targets official `c-event-calendar-3`: an untouched preset remains translatable after save; an explicitly edited or newly entered same-text title remains user text; changing language keeps the open input and draft. Run the complete Windows Chromium suite to verify these cases, including the retained Button screenshot baselines. Example fixtures that originally depended on the current time use a fixed 2026-02-09 reference; scenes with dates already fixed in the source keep those dates. An empty public DateSelector still chooses its initial calendar month from its own `new Date()` because it exposes no `viewMonth` prop.

`Dialog.vrt.test.tsx` retains the original dismissal, controlled-owner and portaled ARIA checks. `DialogEnhancements.vrt.test.tsx` exercises the public Dialog package with the complete docs stylesheet. It checks function/object header actions, custom icons and nonempty accessible-name fallbacks, tooltips, no implicit form submission or dismissal, quick ReactNode composition, external-trigger focus return, non-modal outside focus (including a rejected dismissal followed by internal closing), and existing composed triggers. Its responsive matrix covers three themes, both densities, desktop/mobile viewports, 16/21.328/32px roots, the exact 48-rem boundary, narrow/fullscreen geometry, header-first-line alignment, independently scrolling bodies, and the same edited input DOM/value after switches. Cases also cover omitted optional slots, default fullscreen-off behavior, and accessible outer scrolling when long fixed regions exceed a 320px-high viewport. `DialogComposition.vrt.test.tsx` separately imports only the public stylesheet and preserves a legacy custom flex/scroll layout. Build the component package first, then run `pnpm --filter @exre/exui-docs exec vitest run src/showcase/Dialog.vrt.test.tsx src/showcase/DialogEnhancements.vrt.test.tsx src/showcase/DialogComposition.vrt.test.tsx`. The new suites record no screenshot baselines. The packed consumer's `dialog-types.tsx` additionally verifies the quick/composed APIs and rejects missing handlers, string icons, non-boolean fullscreen, replaced quick hosts/children and misspelled footer props.

The Dialog enhancements suite also mounts the real quick example and verifies that opening does not reveal the header-action tooltip, while Tab focus and deliberate hover still do. A separate case preserves a caller's explicit `onOpenAutoFocus` decision.

## Token checks

`pnpm tokens:check` builds the token entries, verifies ESM/CommonJS parity, regenerates and compares the stylesheet, and runs the token validation script. It finishes with the token behaviour tests:

```bash
pnpm tokens:check
```

- Token behaviour tests use Node's built-in test runner and live under `packages/tokens/scripts/` with the `*.test.mjs` suffix. `node --test "scripts/**/*.test.mjs"` runs them as the last step of `tokens:check`, so no separate command is needed.
- `packages/tokens/scripts/token-length-policy.mjs` holds the pure length policy: the public `RecipeLength` contract accepts rem, px, and `0`, while every built-in scalable length must be `rem` or `0`. Fixed-pixel exceptions (`radii.none`, `radii.full`, the menu separator thickness) are listed explicitly and must keep their exact values.
- `packages/tokens/scripts/foundation-reference-policy.mjs` holds the pure foundation-reference policy: the foundation variable map must cover the contract's `radii`, `typography`, and `shadows` leaves exactly, every named variable must be declared in the generated `:root` with the contract value, no recipe variable may reference an undeclared variable, and each foundation reference must appear as `var(--exui-…)` exactly as many times as the recipe tree references it — so a recipe that quietly falls back to a literal value turns `tokens:check` red.
- `packages/tokens/scripts/glass-policy.mjs` holds the pure glass-material policy. It pins the built-in blur to `0.25rem` and requires a rem-based inset edge. The glass group is the one place where the stylesheet is not a plain flattening of the source values: `foreground`, the danger base colour, and the inset edge are published as references to the Tokens they derive from, and the danger states as `color-mix()` over `control.danger`. Nothing visual would catch a source value and its emitted reference drifting apart, so the policy re-derives the expected emission from the contract. It also owns the guarantees the general contrast policy cannot reach, because that policy pairs `<name>`/`<name>Foreground` keys and recipe state tuples and therefore sees neither `glass.foreground` beside `glass.background` nor the nested `glass.danger` group. Every material state is judged over the theme page colour and over the black and white extremes, since a glass surface renders on whatever is behind it.
- Policy tests mutate in-memory clones of the built token tree; they never rewrite the real source files.

The Showcase scaling suite `packages/docs/src/showcase/RemSizing.vrt.test.tsx` reuses the same Vitest Browser / Chromium setup as `ComponentRecipeContract.vrt.test.tsx`. It drives the root font size through 16px, 21.328px, and 32px, asserts computed geometry within 0.1 CSS px of the 16px baseline times the scale, and restores the root font size, theme, and injected styles after every case. It records no screenshots, so it adds no platform baselines.

`packages/docs/src/showcase/Glass.vrt.test.tsx` verifies the glass material through computed styles rather than pixels, and also records no screenshots. It checks that the marker lands on the slot that actually paints for each composition surface, that the prop never reaches the DOM, that geometry, clipping, and stacking are untouched, that only surfaces with existing pointer feedback switch material, that danger and focus/invalid states survive, and that a nested surface does not inherit the outer surface's run-time variables. Its lifecycle cases cover the seed's mount, unmount, remount, and Strict Mode behaviour, a host-owned value being restored instead of cleared, and the negative capability path — that case stubs `CSS.supports` and asserts the base blur survives with no filter URL in the chain, so a stub that silently fails is caught by its own guard.

`packages/docs/src/showcase/ExItem.vrt.test.tsx` covers the standalone item through computed geometry and accessibility attributes rather than pixels, and records no screenshots. It checks content caps and alignment, form-layout inheritance plus per-field overrides, `contentMaxWidth="none"` removing an inherited limit, and validation errors staying inside the aligned content. Its association cases cover a single direct `Input` receiving a generated id, an existing `aria-describedby` being appended to instead of replaced, the value, change handler and ref surviving that injection, an explicit input id being preserved, duplicate description ids being collapsed, conflicting `controlId` and input ids being rejected, and wrapped, custom or multiple controls requiring explicit association. One case renders on the server and hydrates to confirm the generated id survives. The remaining cases cover wrapping by the item's own width, span and root `div` attributes in an independent grid, and `noStyle`.

`packages/docs/src/showcase/FormContentSizing.vrt.test.tsx` drives the Showcase form sizing controls and asserts narrow rows fill the available width while a typed draft survives every control change. `FormSurfaceOutline.vrt.test.tsx` walks `light`, `dark` and `pitch-black` and checks that text `Input` keeps its transparent 1px border while the remaining form surfaces retain a distinct, shared outline colour. `FormSurfaces.vrt.test.tsx` asserts the idle field background is identical across the text, multi-select, date, and files controls. Neither records screenshots.

The Showcase Vitest config dedupes `react` and `react-dom` so a linked workspace never resolves two React copies, and pre-bundles `react-dom/server` for the suites that render on the server before hydrating.

These assertions do not establish how the refraction renders. No suite in this repository compares the enhanced output against the base output pixel by pixel, so the enhancement's rendering is unverified and claims about it must stay out of release notes.

## Full validation

```bash
pnpm install --frozen-lockfile
pnpm --filter @exre/exui-docs exec playwright install chromium
pnpm release:verify
pnpm test:release
pnpm tokens:check
pnpm typecheck
pnpm lint
pnpm docs:content:check
pnpm test:docs-content
pnpm test:docs-examples
pnpm test:docs-example-assets
pnpm test:docs-example-styles
pnpm build
pnpm docs:snippets:verify
pnpm docs:static:verify
pnpm test:docs-sharing
pnpm docs:sharing:verify
pnpm test:docs-example-copy
pnpm docs:examples:check
pnpm docs:examples:assets:check
pnpm docs:examples:styles:check
pnpm test:regressions
node --test scripts/exui-skill/sync-references.test.mjs
node scripts/exui-skill/sync-references.mjs --check
node scripts/exui-skill/update-inventories.mjs --check
node scripts/exui-skill/verify.mjs
node scripts/exui-skill/verify-examples.mjs
pnpm test:visual
pnpm verify:pack
git diff --check
```

## Component root-font regression cases

`pnpm test:regressions` includes `packages/components/scripts/rem.test.mjs`, covering SSR fallback, explicit numeric pixel semantics, per-document store sharing, updates and cleanup. After building, the public-package browser suites `RuntimeRemSizing`, `StaticRemSizing`, `ComplexRemSizing`, `CalendarRemSizing`, `DataGridRemSizing` and `ThirdPartyRemSizing` run through the existing Vitest Chromium configuration. They cover dynamic 16 / 21.328 / 32px roots, explicit overrides, virtual cache invalidation, keyboard resizing/selection, calendar gesture cancellation and supported dependency geometry. These focused cases record no screenshot baselines. Run them with `pnpm --filter @exre/exui-docs exec vitest run src/showcase/*RemSizing.vrt.test.tsx`; PowerShell users can pass the six explicit paths when the shell does not expand the glob.
