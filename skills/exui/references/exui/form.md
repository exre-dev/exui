# Form: configured and composed

Use `Form` for schema-driven input. Pass `fields` for configured rendering, or supply an ExUI `useForm` instance and compose `FormField` / `FormList` children. Both branches render one native form and connect one owner to one form instance. Use [standalone Field composition](field-layout.md) for settings rows and display content without validation state.

## Install and import

Install a schema implementation yourself. The examples use Zod; ExUI does not bundle Zod or export `z`:

```bash
pnpm add zod
```

```tsx
import { Form, FormField, FormList, FormErrorSummary, useForm, useFormContext, useWatch, useFieldArray } from "@exre/exui"
import { z } from "zod"
import "@exre/exui/style.css"
```

The public schema contract is Standard Schema V1. Zod 3.25.28 and 4.6.5 are the fixed versions in the isolated consumer gates; both exercise an async refinement through real Chromium invalid and parsed-submit interactions. No `react-hook-form`, `@hookform/resolvers`, or Standard Schema package installation is needed. Use ExUI's hooks and providers together; a consumer's own RHF instance cannot be passed as `form`.

## Configuration and composition

[Complete configured example](../../examples/form-configured.tsx) shows typed text, numeric-string and enum controls, with parsed output. [Complete composed example](../../examples/form-composed.tsx) shows a shared context, watched draft, object list and error summary. [Field layout example](../../examples/field-layout.tsx) shows explicit standalone labels and responsive layout. [Field override example](../../examples/form-field-layout.tsx) shows a bound field override. [Configured instance example](../../examples/form-configured-instance.tsx) shows the existing-instance branch and custom footer.

A configured `Form` receives either `schema` plus `defaultValues`, or an existing `form` from `useForm`. With an existing instance, do not also pass `schema`, `defaultValues`, `mode` or `reValidateMode`. A `Form` and all of its `FormField`/`FormList` children must use the same instance; one instance can connect to one mounted form.

Declare initialization schemas and step schemas outside render, or memoize them. Changing an initialization schema requires a new instance or React key. Fresh equivalent `fields`/`steps` arrays are supported; fresh schema objects change the validation definition. A new `defaultValues` object does not replace a draft: call `reset(newDefaults)` to establish a new baseline.

The named public props describe three branches:

| Branch | Public type | Required source and content |
| --- | --- | --- |
| Composed | `FormComposedProps<I, O>` | `form`, `onSubmit`, required `children`; no `fields`, schema initialization or configured footer/step props |
| Configured schema | `FormConfiguredSchemaProps<S>` | `schema`, `defaultValues`, `fields`, `onSubmit`; no `form` |
| Configured instance | `FormConfiguredInstanceProps<I, O>` | `form`, `fields`, `onSubmit`; no schema initialization props |

`fields !== undefined` selects configured rendering at runtime; `fields={[]}` is configured and `fields={undefined}` is composed. Switching between configured and composed rendering in one mounted `Form` throws: use a new React `key` when changing modes. The source choices remain mutually exclusive. Choose the named type for a wrapper's branch instead of inferring an overloaded component's props.

Configured `children` render before the generated fields or review content and footer; they can hold a summary or extra content. They do not replace generated fields. Omit `footer` for built-in actions, pass `footer={null}` to suppress them, or provide a node / callback for custom actions. Callback arguments include `state`, `currentStep`, `isFirstStep`, `isLastStep`, `next`, `back`, `goTo`, `submit` and `reset`. Use `type="button"` for custom navigation and reset actions. In composed mode, children provide all controls, summaries and actions; configured footer/step/label props are rejected.

## Input, parsed output and controls

Nested objects use original paths, such as `profile.email`. Dynamic object rows use `contacts.${index}.email`, while React keys come from the list's stable `key`, not the index. After `move`, `insert` or `remove`, bind the field to the row's current `index`. Nested lists follow the same rule (`teams.${teamIndex}.members`); each list component or row component owns its own hook rather than calling hooks inside a loop. Configuration lists use `kind: "list"`, a complete `defaultItem` and relative `itemFields` paths, and may contain another list configuration.

`defaultValues`, paths, `getValues`, `setValue`, `useWatch` and control bindings follow schema **Input**. `onSubmit` receives successful full-schema **Output**. A numeric input uses a string draft (`control: "number"`); convert it in the schema. Parsing never writes transformed output back into the draft.

Built-in controls are `text`, `email`, `password`, `number`, `date`, `textarea`, `select`, `radio-group`, `checkbox`, `switch`, `checkbox-group`, `multi-select`, `select-or-input` and `files`. Enum options retain the path's literal values. Multiple selection needs a writable string array; `FormList` needs a writable object array and complete `defaultItem` values. Readonly model arrays use typed custom `render` and `setValue` instead. `required` marks the label and accessibility; validation rules come from the schema.

`FormField` places `description` directly below its label, above the control. Only validation errors appear below the control. Invalid fields keep the label's normal text color; the control and error display their invalid styles. The control's `aria-describedby` still references its description and any current error.

`date` opens an ExUI Calendar in a Popover. Its draft and default value are `YYYY-MM-DD` strings, so `defaultValues` chooses the initial date and `reset` restores it. Set inclusive calendar limits with `controlProps.min` and `controlProps.max` (also `YYYY-MM-DD`). When today falls within those limits, the popup shows a compact Today action beside the year selector; `controlProps.todayLabel` localizes it. `controlProps.placeholder` localizes an empty trigger. The limits prevent selection in the calendar; validate them again in the schema if existing defaults, programmatic writes, or server data must also be rejected.

```tsx
<Form schema={schema} defaultValues={{ birthDate: "2000-01-15" }} onSubmit={save} fields={[
  { name: "birthDate", label: "Birth date", control: "date",
    controlProps: { min: "1900-01-01", max: "2026-09-29", todayLabel: "Today" } },
]} />
```

Custom `render` receives `{ field, state, accessibility }`. `field.value` is a readonly snapshot, `field.onChange(next)` accepts the path's Input value, and `field.onBlur`/`field.ref` attach to the real focusable element. Spread `accessibility` onto that element and render labels and issues when using `noStyle`. Do not replace bindings through `controlProps`.

## Steps and validation scopes

Each step declares stable `id`, `fields`, `validationSchema`, and optional `validationDependencies`. Its schema receives a projection at the original input paths. Supply a schema that accepts that projection and reuses the business rules; the library cannot safely derive a step schema by picking arbitrary transformed or refined full schemas. Future required fields do not block the current scope. The last step still parses the complete schema, including cross-field rules.

`trigger()` runs complete validation; `trigger(names)` only applies selected paths and current root issues. `validateScope(scope)` uses explicit scope rules. Local success does not declare the full form valid, and `clearErrors` does not mark it valid. `FormErrorSummary` shows field and root issues in the shared destructive `Alert`, with a status icon, `AlertTitle` and an `AlertDescription` error list; field links focus registered, connected controls. It renders nothing when there are no issues.

`Form` does not insert `FormErrorSummary`. Add it as a child when a summary is wanted: `<Form ...><FormErrorSummary title="Please check the following issues" /></Form>`. Inside `Form`, the same component can omit `form`; passing the matching `form` explicitly remains supported. It must be inside a form and does not accept an external `errors` prop.

For localized display, `Form` accepts `formatIssue(message)` and `issueSeparator`. The formatter changes the rendered field errors and error summary only; `form.state.errors` retains the original schema or server message. This lets an application switch language without replacing the form instance or losing its draft. Pass a translated `title` to `FormErrorSummary`. Configured `Form` also accepts `stepsAriaLabel`, `backLabel`, and `nextLabel`; its existing `submitLabel` and `resetLabel` cover the remaining footer buttons. Omitted labels retain their current defaults.

## Errors, submission and lifecycle

`setError` writes manual errors. Inside `onSubmit(output, context)`, use `context.setFieldError`/`context.setFormError` for server errors and pass `context.signal` to work that supports abort. `form.submit()` resolves with `submitted`, `invalid`, `failed` or `cancelled`; thrown execution failures also reach `onSubmitError`. Repeated in-flight submits share the attempt. State snapshots are readonly and `form.state` updates the owning component.

`reset` clears draft state and cancels pending work; `cancelPending` cancels work while keeping the draft. Unmount cancels and disconnects the owner. `clearOnDestroy` optionally resets afterward. A Dialog that stays mounted when closed should call `reset` or `cancelPending` in its close handler. Cancellation prevents stale UI writes and signals cooperative abort; it cannot undo an already sent server operation.

The `files` control keeps a memory-only `File[]`: choose, drop and paste append files, removal uses current position, and reset allows the same file to be selected again. File count, size and type rules belong in the schema; `accept` is a picker hint. For SSR, construct any schema that needs the `File` constructor only in the browser. The control itself can server-render an empty file list without browser globals.

Its `controlProps` can set `buttonLabel`, `formatFileSize(bytes)` and `removeFileLabel(file)` to localize the picker, rendered size, and accessible remove action. The callbacks affect presentation only; file validation and stored `File[]` values stay unchanged.

## Field presentation and layout

`FormField` and ordinary configured fields support `layout="vertical" | "horizontal"`, `colSpan`, `contentMaxWidth`, and `contentAlign="left" | "right"`. Form-level settings supply defaults; each field can override width and alignment independently. `contentMaxWidth="none"` removes an inherited cap. Numeric widths are CSS pixels; use rem lengths for scalable geometry. The cap covers control and errors, while the title stays separate. It applies only to wide horizontal rows. Vertical and narrow rows fill their available width.

The outer `Form` supports vertical, horizontal and inline layout, container-based columns (1?4), and field spans. `inline` is an outer arrangement; its fields default to horizontal. Each horizontal field measures its own available width and stacks below 21.75rem (9rem heading + 12rem control + .75rem gap), including narrow grid columns and Dialogs. `FormList.layout` controls list rows. `noStyle` removes the field shell, so a custom renderer must supply labels, descriptions and error presentation as well as the actual control bindings.

Standalone `Field`, `FieldContent`, `FieldLabel`, `FieldDescription` and `FieldError` do not register a value or consume Form layout defaults. Use [Field layout and accessibility](field-layout.md) for their explicit ID/ARIA and responsive recipe; they do not infer labels or IDs from children.
