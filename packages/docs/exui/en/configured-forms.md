### Configured Form

`Form` renders configured fields and optional steps. Choose either `schema` with `defaultValues`, or an existing `form` from `useForm`; passing both is an error. Step validation belongs to each edit step, and review steps render a snapshot. Configured children appear before fields or review content, and the footer follows them. Omit `footer` for built-in actions; use `null`, a node, or a callback to replace them. `fields !== undefined` selects this branch, including an empty array; use a new React key to switch to composed mode. Use `FormConfiguredSchemaProps<S>` or `FormConfiguredInstanceProps<I, O>` for wrappers. Keep a schema object stable across rerenders, and create browser-only schemas that reference `File` in browser code.

Install `zod` in the consuming application when using this example.

```tsx verify
import { Form } from "@exre/exui"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })
export function ProjectSetup() {
  return <Form schema={schema} defaultValues={{ name: "" }}
    fields={[{ name: "name", label: "Project name", control: "text" }]}
    onSubmit={(value) => console.log(value.name)} />
}
```
