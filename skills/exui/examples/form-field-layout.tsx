import "@exre/exui/style.css"
import { z } from "zod"
import { Button, Form, FormField, useForm } from "@exre/exui"

const schema = z.object({ displayName: z.string().min(1, "Enter a display name") })

export default function FormFieldLayout() {
  const form = useForm({ schema, defaultValues: { displayName: "" } })
  return <Form form={form} onSubmit={(value) => console.log(value.displayName)}
    layout="horizontal" contentMaxWidth="24rem" contentAlign="right">
    <FormField form={form} name="displayName" label="Display name" description="Shown to teammates"
      control="text" contentMaxWidth="18rem" contentAlign="left" />
    <Button type="submit">Save</Button>
  </Form>
}
