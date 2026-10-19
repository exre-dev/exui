import "@exre/exui/style.css"
import { z } from "zod"
import { Button, Form, FormErrorSummary, useForm } from "@exre/exui"
import type { FormConfiguredInstanceProps, FormInput, FormOutput } from "@exre/exui"

const schema = z.object({ name: z.string().min(1, "Enter a name") })
type Input = FormInput<typeof schema>
type Output = FormOutput<typeof schema>

function ConfiguredEditor(props: FormConfiguredInstanceProps<Input, Output>) {
  return <Form {...props} />
}

export default function ConfiguredInstance() {
  const form = useForm({ schema, defaultValues: { name: "" } })
  return <ConfiguredEditor form={form} fields={[{ name: "name", label: "Name", control: "text" }]}
    onSubmit={(output) => console.log(output.name)}
    footer={({ state, reset }) => <div style={{ display: "flex", gap: ".5rem" }}>
      <Button type="submit" disabled={state.isSubmitting}>Save</Button>
      <Button type="button" onClick={reset}>Reset</Button>
    </div>}>
    <FormErrorSummary title="Check these fields" />
  </ConfiguredEditor>
}
