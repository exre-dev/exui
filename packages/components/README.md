# @exre/exui

Exre React 19 component library with shared design tokens, accessible controls, schema-driven forms, Glass surfaces, and application notifications.

## Usage

Install the package together with the React host runtime it expects:

```bash
npm add @exre/exui react@19 react-dom@19
npm add -D @types/react@19 @types/react-dom@19
```

React and React DOM are optional peers: the component entry needs them at runtime and their type packages for TypeScript, but the package never installs them for you. Then import the built stylesheet once:

```tsx
import "@exre/exui/style.css"
import { Button } from "@exre/exui"

export function App() {
  return (
    <Button>Continue</Button>
  )
}
```

`@exre/exui/style.css` is the complete component stylesheet, including token variables and fonts.

The React root is ESM-only and supports React 19 (`>=19.0.0 <20`). General-purpose layout utilities are not part of the stylesheet contract; use your own CSS or utility setup for application layout.

### Components and 1.0 migration

Import components, subcomponents, hooks, and public types from `@exre/exui`. The catalog includes data grids, scheduling, date and time pickers, navigation, media, and interactive workflows alongside the basic controls. `Form` unifies configured and composed forms; `FormField` binds named fields, and Field primitives compose standalone rows.

`Modal` and its public types have been removed. Migrate overlays to `Dialog`, `DialogContent`, `DialogHeader`, `DialogBody`, and `DialogFooter`, or use the quick Dialog composition. Dialog supports header actions and opt-in mobile fullscreen.

Badge no longer accepts `variant="ghost"` or `variant="link"`. Choose a supported variant such as `outline`, or use custom classes for a text-only treatment. `destructive` now has a solid fill; use `destructive-light` for a pale background.

`DataGrid` uses the bundled TanStack Table v9 instance. Import its primitives through the root `TanStackTable` namespace; a separately installed table package does not share that instance. Chart primitives similarly use the root `Recharts` namespace. Components use ExUI token colors, Lucide icons, and opt-in Glass where supported.

### Schema-driven forms

Use `Form` with `fields` for typed configuration, or compose `Form`, `FormField`, `FormList` and `FormErrorSummary` with an ExUI `useForm` instance. Install a Standard Schema V1 implementation yourself; this example uses Zod:

```bash
npm add zod
```

```tsx
import { z } from "zod"
import { Form, FormErrorSummary } from "@exre/exui"

const schema = z.object({ age: z.string().min(1).regex(/^\d+$/).transform(Number) })
export function AgeForm() {
  return <Form schema={schema} defaultValues={{ age: "" }}
    fields={[{ name: "age", label: "Age", control: "number" }]}
    onSubmit={(output) => console.log(output.age)}>
    <FormErrorSummary />
  </Form>
}
```

Controls and form methods follow schema Input (age is a string); successful submission receives parsed Output (age is a number). Parsing does not replace the draft. Keep initialization and step schemas stable outside render or with `useMemo`. Form hooks and providers share ExUI's bundled RHF instance; no RHF or resolver installation is needed.

There are three named props branches: `FormComposedProps<I, O>` requires `form`, `onSubmit` and children; `FormConfiguredSchemaProps<S>` requires schema/defaultValues/fields; `FormConfiguredInstanceProps<I, O>` requires form/fields. Existing instances cannot also receive initialization props. `fields !== undefined` selects configured mode, including an empty array; switching to/from composed mode requires a new React key. Composed forms own their actions in children. Configured children appear before generated fields or review content, followed by a footer: omit `footer` for built-in actions, or pass null, a node or callback to replace it.

Steps declare stable scope schemas at original input paths; final submission always checks the full schema. `reset` cancels pending work and establishes a baseline; `cancelPending` preserves the draft. A Dialog that stays mounted on close should call one of them. Cancellation signals cooperative abort and cannot undo a server operation already sent. `FormErrorSummary` is opt-in and reads the nearest form owner.

`FormField` and configured fields accept layout, content-width and alignment overrides. Horizontal fields respond to their own width; vertical and narrow fields fill available space. For standalone settings and display rows, compose `Field`, `FieldContent`, `FieldLabel`, `FieldDescription` and `FieldError` with explicit IDs and ARIA on actual focusable controls. Field primitives do not register state or infer child associations.

See the [Form guide](../../skills/exui/references/exui/form.md), [Field layout guide](../../skills/exui/references/exui/field-layout.md), [configured example](../../skills/exui/examples/form-configured.tsx), [existing-instance example](../../skills/exui/examples/form-configured-instance.tsx) and [composed example](../../skills/exui/examples/form-composed.tsx). Isolated consumers exercise fixed Zod 3.25.28 and 4.6.5 with strict types, SSR and parsed Form submission in Chromium.

### Themes

In a browser application, wrap the app with the root `ThemeProvider` and use `useTheme()` to switch between `"light"`, `"dark"`, and `"system"`. The default is `"system"`, and choices are stored under the `"theme"` localStorage key. Mount `Toaster` and call `toast` from the same `@exre/exui` root for notifications that follow the provider.

Mount one stable `Toaster` and use the root `toast` methods from any module after the host mounts. Set `position`, `duration`, and `visibleToasts` on the host; a message can override its own duration. `visibleToasts` limits visible notifications without evicting older entries.

```tsx
import { Toaster, toast, ThemeProvider } from "@exre/exui"

function App({ save }: { save: () => Promise<void> }) {
  return <ThemeProvider><Toaster position="top-right" duration={3000} visibleToasts={3} /><SaveButton save={save} /></ThemeProvider>
}

function SaveButton({ save }: { save: () => Promise<void> }) {
  function notify() {
    toast.promise(save, { loading: "Saving", success: "Saved", error: "Save failed" })
  }
  return <button onClick={notify}>Save</button>
}
```

For callback-based tasks, keep the ID returned by `toast.loading("Saving")` and pass it to `toast.success("Saved", { id })` or `toast.error("Save failed", { id })`. Use `toast.dismiss(id)` to close the notification. Applications own cancellation, loading deadlines, late-callback guards, and cleanup; unmounting `Toaster` does not clear the notification store. See the [ExMessage migration guide](../docs/content/en/getting-started/ex-message-migration.mdx) for the removed API and lifecycle differences.

The shared `Toaster` uses Sonner with Lucide status icons for success, info, warning, error, and loading. The icon colors follow the theme's feedback and primary CSS variables. `<Toaster />` accepts Sonner's `icons` prop when an application needs different icons.

`ThemeProvider` reads localStorage during rendering and cannot render on a server. Mount it only in the browser after hydration when using an SSR framework; `"use client"` alone does not prevent prerendering. The `.pitch-black` token class is managed separately and is not a provider theme value.

### Glass material

Glass is a shared translucent surface — a tinted backdrop blur with an inset edge — that any element can adopt, plus an optional SVG refraction enhancement driven by one seed per document.

```tsx
import "@exre/exui/style.css"
import { Button, Card, GlassSeed } from "@exre/exui"

export function App() {
  return (
    <>
      <GlassSeed />
      <Card glass>
        <div className="ex-glass" style={{ borderRadius: "0.75rem", padding: "1rem" }}>
          Any element, no component needed
        </div>
        <Button glass variant="danger">Delete</Button>
      </Card>
    </>
  )
}
```

- Mount one `GlassSeed` per document. It renders no children, is not a provider, and adds no layout box; the material works without it and simply loses the refraction. It is safe to server-render: the enhancement is applied after hydration once the browser has confirmed it accepts the shared filter, and withdrawn when the seed unmounts.
- The `glass` prop and the `ex-glass` class produce the same material. `glass` defaults to `false` and is never forwarded to the DOM; `glass={false}` does not remove a class you wrote yourself. `ex-glass-foo` is a different class and does not enable the material.
- The material never changes layout: no `display`, `position`, `z-index`, size, padding, gap, radius, or `overflow` change, no wrapper element, and no new border width. The visible edge is an inset shadow, never a border: it paints an inner hairline on every glass surface while the surface's own border colour — including its hover, focus, invalid, disabled, error, and checked transitions — is left completely untouched. A bordered surface shows both its border and the material's hairline, and a surface that shipped `border-transparent` gains a visible inner edge. Existing outer shadows and focus rings are composed with the material rather than replaced.
- Every surface opts in on its own; the marker does not spread to descendants. The [Glass reference](../../skills/exui/references/exui/glass.md) lists supported surfaces and composition rules. For example, `Select glass` affects its trigger; a glass popup requires the composed `SelectField` and `SelectContent glass` path. `DrawerContent` paints its rounded panel through `::before`, and a glass tooltip retints its arrow without adding a second refraction filter.
- Restyle it with `--exui-glass-background`, `--exui-glass-foreground`, `--exui-glass-border`, `--exui-glass-shadow`, `--exui-glass-blur`, and `--exui-glass-saturation`, declared on the surface or any ancestor.
- Where `backdrop-filter` is unavailable the surface falls back to an opaque themed background. A non-`none` `backdrop-filter` also makes the element a containing block for absolutely and fixed positioned descendants, so keep viewport-anchored content in a portal rather than inside a glass surface.

The built-in blur is `0.25rem` and the inset edge is `0.0625rem`; both scale with the root font size. The stylesheet also adds a fixed-pixel white inset highlight. `CSS.supports` checks syntax acceptance only: the automated checks cover computed styles and lifecycle, not the rendered refraction effect.

### Customizing tokens

Every Token is a CSS custom property declared on `:root`, and the component stylesheet resolves its recipe values through those properties rather than copying them. Re-declare the ones you need after the stylesheet:

```css
@import "@exre/exui/style.css";

:root {
  --exui-control-primary: #0f62fe;
  --exui-control-primary-foreground: #ffffff;
  --exui-font-family: "Inter", sans-serif;
  --exui-radius-extra-large: 0.75rem;
}

.dark {
  --exui-control-primary: #6ea8ff;
}
```

An override is a declaration that wins the cascade, so two rules matter more than the list of names:

- **Keep it unlayered.** ExUI emits its Token declarations outside any `@layer`, and unlayered declarations beat layered ones. An override written inside `@layer base` or a Tailwind `@theme` block resolves back to the library value and fails with no error; a plain `:root` rule placed after the stylesheet import is enough, and its position in the cascade is what makes it win.
- **`.dark` and `.pitch-black` carry theme differences and explicit short alias references.** An unlayered `:root` override placed after the stylesheet applies to all three themes unless a theme rule supplies that variable. Add a `.dark` or `.pitch-black` block when the brand value has a theme-specific counterpart. Foundation Tokens and `--density-*` are theme-independent.

What the layers cover:

- **Semantic Tokens** — `--exui-control-*`, `--exui-surface-*`, `--exui-text-*`, `--exui-border-*`, `--exui-feedback-*`, `--exui-sidebar-*`, `--exui-chart-*`, `--exui-editor-*`. Recolouring an application is normally these alone.
- **Foundation Tokens** — `--exui-font-family`, `--exui-font-family-mono`, `--exui-font-family-emoji`, `--exui-font-weight-*`, `--exui-font-size-*`, `--exui-line-height-*`, `--exui-radius-*` and `--exui-shadow-*`. They are theme-independent, and every recipe field that references one resolves through its variable, so changing `--exui-font-family` or `--exui-radius-extra-large` moves the components as well. Three recipe radii are deliberately standalone values — the button action radius, and the dialog and menu surface radii — and follow only their own `--exui-component-…-radius`.
- **`--radius`** is derived: it resolves to `--exui-radius-large`, so the Tailwind radius scale (`rounded-sm` … `rounded-4xl`) and the components that use that radius move together.
- **The short semantic aliases** — `--background`, `--primary`, `--ring`, `--chart-1`, `--sidebar-*`, feedback colors, and the rest — reference their `--exui-*` tokens with `var()`. Root and themed-scope overrides of those tokens therefore reach the aliases. For a local override inside an element without its own theme class, inherited alias or recipe declarations can resolve at an ancestor; redeclare the corresponding alias or recipe at that scope if needed.
- **`--density-*`** provides `standard` and `.density-compact` values. Default Button, Input, Textarea, Select, NativeSelect, and InputGroup geometry consumes them; explicit component sizes keep their own sizing. Density does not compact every internal part of complex components.
- **Recipe variables** (`--exui-component-…`) are the component-internal layer. Overriding one is supported and precise — a few hundred of them cover the default, hover, focus, active and disabled state of every variant — but they are not the theming surface.

These examples assume the theme class is on the document root. A nested `.dark` or `.pitch-black` scope also re-emits its semantic aliases. For local overrides and portal theming, account for CSS inheritance of alias and recipe variables. See the [Token customization guide](../../skills/exui/references/exui/token-customization.md).

The library keeps no override layer of its own, so nothing has to be re-applied after an upgrade; an override that stops matching a Token name simply stops applying.

### Framework-neutral tokens

Projects that do not use React can consume the visual contract alone; no React, React DOM, or React type packages are required:

```ts
import { componentRecipes, exuiTokens } from "@exre/exui/tokens"
import "@exre/exui/tokens/style.css"
```

`@exre/exui/tokens` publishes ESM and CommonJS entries. `@exre/exui/tokens/style.css` carries only token variables for the three themes, and `@exre/exui/tokens/font.css` loads the optional font assets.

The current source requires a `glass` group (`--exui-glass-*`) in each `ThemeTokens` object. When upgrading from a package without that group, copy a built-in theme's `glass` values as the starting point for a hand-written complete theme. Reading individual Tokens and spreading a built-in theme need no such change. The glass material itself lives in the component stylesheet, so a token-only consumer gets the variables and none of the `.ex-glass` behaviour. Check the installed package's types for availability; repository source can include changes awaiting release.

### Theming Fumadocs UI

A documentation site built with [Fumadocs UI](https://www.fumadocs.dev/docs/ui) renders in ExUI colours by importing one stylesheet:

```tsx
import "@exre/exui/docs/theme.css"
```

It imports `@exre/exui/tokens/style.css`, then Fumadocs' `css/shadcn.css` and `css/preset.css`, in that order. Fumadocs maps its own `--color-fd-*` names onto shadcn's short variables without fallbacks, so the token sheet has to be present: without it every docs colour computes to an unset custom property, and the page renders unstyled without reporting an error.

ExUI declares no dependency on `fumadocs-ui` in any field — a stylesheet is not worth adding the Fumadocs tree and its React implementation libraries to every consumer's dependency graph. Install it yourself, since a Fumadocs site needs it anyway. The sheet is verified against `^16.15.0`:

```bash
npm add fumadocs-ui
```

The sheet ships unprocessed, exactly like Fumadocs' own `css/*` sheets, so your Tailwind build resolves the three imports. Without `fumadocs-ui` installed they fail loudly instead of producing an unstyled page.

Boundaries worth knowing before relying on it:

- **Colour only.** Fumadocs keeps its own radii, spacing, and animations; they do not follow ExUI's `--radius` or its density classes.
- **No component wrapping.** Fumadocs ships its own `Tabs` and `Accordion` with APIs that differ from ExUI's (`<Tabs items={[...]}><Tab value="...">` against ExUI's `<TabsList>` composition). Import those from `fumadocs-ui` directly; ExUI does not re-export them.
- **One theme driver per page.** Fumadocs' `RootProvider` uses next-themes and ExUI's `ThemeProvider` keeps its own state, but both read and write the same `theme` localStorage key. In an SSR framework use Fumadocs' provider — it is hydration-safe, while `ThemeProvider` is not.
- **Stylesheet subpath only.** There is no `@exre/exui/docs` JavaScript entry.

### Sizing and root font size

ExUI publishes its scalable sizes in `rem`, calibrated so that a 16px root font size reproduces the original pixel design exactly. Type, control heights, padding, gaps, icons, and ordinary radii therefore resize together when the application sets its own root font size:

```css
html {
  font-size: 20px; /* every scalable ExUI size grows by 20 / 16 */
}
```

ExUI never sets a root font size itself and declares no scale variable, so this stays an application decision. Keep the root at `16px` for the previous rendering; applications that already set a different root font size will see differently sized components after upgrading.

Hairline borders and dividers, focus rings, drop shadows, capsule radii and border compensation stay fixed. Glass blur is `0.25rem`; its inset edge is `0.0625rem`. Omitted numeric defaults for positioning and virtual layouts resolve from rem at runtime, while explicit numeric props and resize state remain pixels. Measured DOM geometry, SVG drawing coordinates and user data keep their original units.

The bundled `Recharts` and `TanStackTable` React boundaries adapt supported axis, tooltip, legend and column defaults. Toaster, Resizable and MessageScroller adapt their owned defaults too. The non-React `TanStackTable.constructTable` entry retains upstream pixel defaults. InputOTP's private password-manager badge reserve/probe remains 40px/18px. See the [scaling guide](../../skills/exui/references/exui/scaling.md) for these boundaries.

Numeric positioning props such as `sideOffset` and `alignOffset` keep their upstream pixel contract and are never multiplied by the root font size.

### Bundled implementation dependencies

The compiled component bundle includes its implementation libraries (Radix UI, Base UI, Recharts, and others); they are not dependencies of the installed package. Consequences:

- Component consumers only install `@exre/exui`, `react`, and `react-dom`.
- Consumers that also use those libraries directly may download duplicate implementation code.
- Context and providers from a consumer's own Radix or Base UI copies do not share state with the instances bundled inside ExUI components. Wrap ExUI components with ExUI's own providers.

Shipped declarations include the third-party type definitions they need, so TypeScript consumers require no component implementation packages.

### Charts and migration

Use the root `Recharts` namespace for chart primitives so they share the bundled
state and contexts used by `ChartTooltip` and `ChartLegend`:

```tsx
import {
  Recharts,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@exre/exui"

const { BarChart, Bar, XAxis } = Recharts

export function VisitorsChart() {
  return (
    <ChartContainer config={{ visitors: { label: "Visitors", color: "#6366f1" } }}>
      <BarChart data={[{ month: "January", visitors: 10 }]}>
        <XAxis dataKey="month" />
        <Bar dataKey="visitors" fill="var(--color-visitors)" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}
```

When migrating existing charts, replace imports such as
`import { BarChart, Bar } from "recharts"` with the `Recharts` import and
destructuring shown above. An independently installed Recharts copy does not
share the chart context: mixing its charts with ExUI's tooltip or legend can
silently omit their content. Chart primitive props and types are available
through `Recharts`; no separate `recharts` installation is needed.

Chart colors may use CSS color names, functions, `var()`, and `color-mix()`.
Values containing CSS rule delimiters, comments, escapes, or HTML tag
delimiters are ignored. Chart ids and config keys are escaped when they are
written into the chart stylesheet.

The namespace exposes the bundled Recharts public API and increases the shipped
component bundle size. Tokens remain isolated behind `@exre/exui/tokens`.

The root `TanStackTable` namespace follows the same bundled-instance rule for DataGrid and its table model.

### Source distribution

The tarball also ships the package source under `src/` for reference and for existing tooling that copies source files. Source-copy consumers resolve the third-party source dependencies themselves; only the `exports` entries above are the supported consumption contract.

## Development

Run aggregate development and validation commands from the repository root:

```bash
pnpm install
pnpm tokens:check
pnpm lint
pnpm verify:pack
```

The documentation site, retained browser fixtures, and consumer skill use the public package entries. Run the workspace, browser, skill, and isolated packed-consumer gates in [Testing](../../TESTING.md); each verifies a different consumption boundary.

## Versioning

This package uses Changesets for release notes, version bumps, and changelog generation.

Create a changeset for user-facing changes:

```bash
pnpm changeset
```

Apply pending changesets to `package.json` and changelogs:

```bash
pnpm version-packages
```

After release automation is enabled, successful CI on `main` versions pending Changesets and creates annotated package tags. The `tag-npm.yml` workflow publishes the tagged package using npm OIDC.

There is no local `pnpm release` command. Maintainers must configure the Release App, protected refs, and the npm Trusted Publisher before enabling automation.

## Source maintenance

Component source locks, licenses, public export metadata, and adapter patches are maintained with the package. See [Testing](../../TESTING.md#source-maintenance-gates) for cache restoration, integrity checks, and deliberate source updates. Raw source caches and maintenance tooling are excluded from the published package; required third-party notices remain included.
