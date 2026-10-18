### Configured ExForm

`ExForm` renders configured fields and optional steps. Choose either `schema` with `defaultValues`, or an existing `form` from `useForm`; passing both is an error. Step validation belongs to each edit step, and review steps render a snapshot. Keep a schema object stable across rerenders, and create browser-only schemas that reference `File` in browser code.

Install `zod` in the consuming application when using this example.

```tsx verify
import { ExForm } from "@exre/exui"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })
export function ProjectSetup() {
  return <ExForm schema={schema} defaultValues={{ name: "" }}
    fields={[{ name: "name", label: "Project name", control: "text" }]}
    onSubmit={(value) => console.log(value.name)} />
}
```
