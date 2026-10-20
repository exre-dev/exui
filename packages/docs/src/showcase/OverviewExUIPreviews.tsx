import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Form, FormField, useForm } from "@exre/exui"
import { z } from "zod"
import { usePreviewCopy } from "./preview-copy"

const schema = z.object({ name: z.string(), email: z.string() })
const defaultValues = { name: "ExUI", email: "hello@example.com" }
const previewSubmit = () => {}

function FormPreview({ configured = false }: { configured?: boolean }) {
  const copy = usePreviewCopy()
  const form = useForm({ schema, defaultValues })
  return configured ? <Form form={form} onSubmit={previewSubmit} fields={[
    { name: "name", label: copy("Name", "名称"), control: "text" },
    { name: "email", label: copy("Email", "邮箱"), control: "email" },
  ]} submitLabel={copy("Save", "保存")} /> : <Form form={form} onSubmit={previewSubmit}>
    <FormField form={form} name="name" label={copy("Name", "名称")} control="text" />
    <FormField form={form} name="email" label={copy("Email", "邮箱")} control="email" />
    <Button type="submit">{copy("Save", "保存")}</Button>
  </Form>
}

export default function OverviewExUIPreviews({ id }: { id: string }) {
  const copy = usePreviewCopy()
  switch (id) {
    case "form": return <FormPreview />
    case "glass": return <div className="overview-glass-backdrop"><Card glass><CardHeader><CardTitle>ExUI <Badge variant="secondary">Glass</Badge></CardTitle></CardHeader><CardContent><Button glass>{copy("Continue", "继续")}</Button></CardContent></Card></div>
    default: throw new Error(`Missing ExUI overview preview: ${id}`)
  }
}
