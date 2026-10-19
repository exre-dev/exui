### ExUI Form lifecycle

`useForm` owns one stable draft and validation schema; `Form` connects submission and field state. The schema's input and output types can differ after transformation, and validation or submission may be asynchronous. `FormField` binds a named field; `FormErrorSummary` reports validation issues. A composed Form requires children and an ExUI instance, without fields or configured footer/step props; use `FormComposedProps<I, O>` for its wrappers. Keep the form instance stable across rerenders and render field errors in the form even if a notification also appears.

Install `zod` in the consuming application when using the Zod schema shown below.

```tsx verify
import { Button, Form, FormField, useForm } from "@exre/exui"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })
export function ProjectForm() {
  const form = useForm({ schema, defaultValues: { name: "" } })
  return <Form form={form} onSubmit={(value) => console.log(value.name)}>
    <FormField form={form} name="name" label="Project name" control="text" />
    <Button type="submit">Save</Button>
  </Form>
}
```
