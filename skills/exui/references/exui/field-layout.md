# Standalone Field layout and accessibility

Use the public `Field`, `FieldContent`, `FieldLabel`, `FieldDescription` and `FieldError` primitives for settings controls or display rows without schema validation. They do not register form state, infer a child ID, or inherit Form's layout/content-width settings. Use [FormField](form.md) for a field bound to an ExUI form instance.

The [complete standalone example](../../examples/field-layout.tsx) includes controlled text and switch inputs, a visible error, a display row, and scoped CSS inside the TSX module. Import `@exre/exui/style.css` once in the consuming application. Copy the recipe CSS into application styles or keep its scoped `<style>`; it does not depend on private docs styles or utility classes.

## Explicit IDs and ARIA

Create stable unique IDs with React `useId` or stable application IDs. Put the ID on the actual focusable input, switch, or custom control and use the same `FieldLabel htmlFor`. Give the description its own ID and reference it from the control's `aria-describedby`. When an error is present, add its ID to that same attribute and set `aria-invalid`; retain any other existing description IDs. `data-invalid` on Field styles the row but does not wire these relationships. FieldError only renders the supplied message; validation belongs to the application.

For multiple controls, label each focusable control or compose a `FieldSet` / `FieldLegend` group with appropriate individual names. A noninteractive value needs visible text, such as `<FieldLabel asChild><span>Workspace</span></FieldLabel>`; do not create an unattached input label or invent a focus target. Wrapped controls still require their real focus element's ID and ARIA, rather than attributes on an outer div.

## Responsive geometry

The complete recipe gives **each item** a containing wrapper with `container: consumer-field / inline-size`; the child Field is the query target. A container cannot query its own inline size, so keep that wrapper even when a page already has a large container. Each narrow grid column or Dialog row then chooses its own arrangement.

Below 21.75rem, the row has one full-width column, `max-width: none`, no alignment margin, and a .75rem heading/content gap. The heading's label/description gap is .25rem; control/error gap is .5rem. At 21.75rem and above, use `9rem minmax(12rem, 1fr)` columns with .75rem between them (9 + 12 + .75 = 21.75). Only then apply `max-width` and `justify-self: start | end` to **FieldContent**. In the example the content cap is 18rem. It covers both the control and any error; it does not align input text or cap the label column.

Keep `min-width: 0` on wrappers and content so long values can shrink. Test wide and narrow items within the same desktop grid as well as a mobile viewport. Changing only the viewport or measuring the outer page can miss an overflowing narrow column. For a vertical-only row, retain full-width content at every width. Field's general `orientation="responsive"` is a primitive convenience; it does not promise this exact 21.75rem recipe.

The site presents these scenarios under `components/field`: `exui-field-settings`, `exui-field-display`, and `exui-field-layout`. Form examples belong to `exui/form`; Field has no form owner or submission lifecycle.
