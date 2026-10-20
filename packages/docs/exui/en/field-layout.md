### Standalone Field composition

`Field`, `FieldContent`, `FieldLabel`, `FieldDescription` and `FieldError` compose settings rows and display values without form registration. Put a stable ID on the real focusable control; use it in `FieldLabel htmlFor`, and explicitly reference description and current error IDs in `aria-describedby`. Set `aria-invalid` when an error is present. These primitives do not infer IDs or inherit Form layout defaults. For noninteractive display values, render a text label with `asChild` and a `span`.

For the exact horizontal recipe, give each item its own inline-size container and query its child row. At 21.75rem (9rem heading + 12rem content + .75rem gap), use two columns and apply the content cap/alignment only to FieldContent. Below that threshold, stack and reset the content to full width. Use .25rem between label and description and .5rem between control and error. A wide page can still contain a narrow item.

```tsx verify
import { useId } from "react"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input } from "@exre/exui"

export function SettingsField() {
  const id = useId()
  return <Field data-invalid>
    <FieldLabel htmlFor={id}>Email</FieldLabel>
    <FieldDescription id={`${id}-description`}>Used for project updates</FieldDescription>
    <FieldContent>
      <Input id={id} defaultValue="invalid" aria-invalid aria-describedby={`${id}-description ${id}-error`} />
      <FieldError id={`${id}-error`}>Enter a valid email.</FieldError>
    </FieldContent>
  </Field>
}
```
