import "@exre/exui/style.css"

import { Component, type ComponentType, type ReactNode } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"
import { Form, FormField, useForm, type FormInstance, type StandardSchemaV1 } from "@exre/exui"

const schema = z.object({ name: z.string() })
const fields = [{ name: "name", label: "Unified name", control: "text" }] as const
const callableSchema: StandardSchemaV1<{ name: string }, { length: number }> & ((value: unknown) => unknown) = Object.assign((value: unknown) => value, {
  "~standard": { version: 1 as const, vendor: "callable", validate(value: unknown) { return { value: { length: (value as { name: string }).name.length } } } },
})
let root: Root
beforeEach(() => { const host = document.createElement("div"); document.body.replaceChildren(host); root = createRoot(host, { onCaughtError: () => {} }) })
afterEach(() => root.unmount())

class Boundary extends Component<{ children: ReactNode }, { error?: string }> {
  state: { error?: string } = {}
  static getDerivedStateFromError(error: Error) { return { error: error.message } }
  render() { return this.state.error ? <output data-testid="entry-error">{this.state.error}</output> : this.props.children }
}

describe("Form unified entry contract", () => {
  it("renders callable schemas through both sources and submits their transformed output", async () => {
    function External() {
      const form = useForm({ schema: callableSchema, defaultValues: { name: "external" } })
      return <Form form={form} fields={fields} onSubmit={() => {}} />
    }
    const html = renderToString(<><Form schema={callableSchema} defaultValues={{ name: "owning" }} fields={fields} onSubmit={() => {}} /><External /></>)
    expect(html.split("<form ")).toHaveLength(3)
    expect(html).toContain('value="owning"')
    expect(html).toContain('value="external"')
    let submitted: { length: number } | undefined
    root.render(<Form schema={callableSchema} defaultValues={{ name: "owning" }} fields={fields} onSubmit={(value) => { submitted = value }} />)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toHaveValue("owning")
    await page.getByRole("textbox", { name: "Unified name" }).fill("changed")
    await page.getByRole("button", { name: "提交", exact: true }).click()
    await expect.poll(() => submitted).toEqual({ length: 7 })
  })

  it("renders one native form and treats empty fields as configured", async () => {
    root.render(<Form schema={schema} defaultValues={{ name: "" }} fields={[]} onSubmit={() => {}} />)
    await expect.element(page.getByRole("button", { name: "提交", exact: true })).toBeVisible()
    expect(document.querySelectorAll("form")).toHaveLength(1)
    root.render(<Form schema={schema} defaultValues={{ name: "" }} fields={fields} onSubmit={() => {}} footer={null} />)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toBeVisible()
    expect(document.querySelectorAll("form")).toHaveLength(1)
    expect(document.querySelectorAll("button")).toHaveLength(0)
  })

  it("keeps composed actions explicit and configured footer callbacks connected", async () => {
    let instance!: FormInstance<{ name: string }, { name: string }>
    function Entry({ configured }: { configured: boolean }) {
      instance = useForm({ schema, defaultValues: { name: "draft" } })
      return configured ? <Form key="configured" form={instance} fields={fields} onSubmit={() => {}}
        footer={({ reset, state }) => <button type="button" onClick={reset}>Reset {String(state.isDirty)}</button>} />
        : <Form key="composed" form={instance} onSubmit={() => {}}><FormField form={instance} name="name" label="Composed name" control="text" /></Form>
    }
    root.render(<Entry configured={false} />)
    await expect.element(page.getByRole("textbox", { name: "Composed name" })).toBeVisible()
    expect(document.querySelectorAll("button")).toHaveLength(0)
    root.render(<Entry configured />)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toHaveValue("draft")
    await page.getByRole("textbox", { name: "Unified name" }).fill("changed")
    await page.getByRole("button", { name: "Reset true" }).click()
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toHaveValue("draft")
    expect((await instance.submit()).status).toBe("submitted")
  })

  it("requires a key for composed/configured switching and permits keyed remount", async () => {
    function Entry({ configured, keyed = false }: { configured: boolean; keyed?: boolean }) {
      const form = useForm({ schema, defaultValues: { name: "" } })
      return configured ? <Form key={keyed ? "configured" : "same"} form={form} fields={fields} onSubmit={() => {}} />
        : <Form key={keyed ? "composed" : "same"} form={form} onSubmit={() => {}}><FormField form={form} name="name" label="Composed name" control="text" /></Form>
    }
    root.render(<Boundary><Entry configured={false} /></Boundary>)
    await expect.element(page.getByRole("textbox", { name: "Composed name" })).toBeVisible()
    root.render(<Boundary><Entry configured /></Boundary>)
    await expect.element(page.getByTestId("entry-error")).toHaveTextContent(/ExUI Form:.*key/)
    root.render(<Boundary key="fresh"><Entry configured={false} keyed /></Boundary>)
    await expect.element(page.getByRole("textbox", { name: "Composed name" })).toBeVisible()
    root.render(<Boundary key="fresh"><Entry configured keyed /></Boundary>)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toBeVisible()
  })

  it("allows schema/instance source switches within the configured branch", async () => {
    let instance!: FormInstance<{ name: string }, { name: string }>
    function Entry({ owned }: { owned: boolean }) {
      instance = useForm({ schema, defaultValues: { name: "external" } })
      return owned ? <Form schema={schema} defaultValues={{ name: "internal" }} fields={fields} onSubmit={() => {}} />
        : <Form form={instance} fields={fields} onSubmit={() => {}} />
    }
    root.render(<Entry owned={false} />)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toHaveValue("external")
    root.render(<Entry owned />)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toHaveValue("internal")
    root.render(<Entry owned={false} />)
    await expect.element(page.getByRole("textbox", { name: "Unified name" })).toHaveValue("external")
    expect(await instance.submit()).toEqual({ status: "submitted" })
  })

  it("reports invalid JavaScript shapes and forbidden props as configuration errors", () => {
    const RuntimeForm = Form as unknown as ComponentType<Record<string, unknown>>
    const invalid = [
      ...[null, undefined, false, 1, "schema", {}, () => {},
        { "~standard": { version: 2, validate: () => ({ value: {} }) } },
        Object.assign(() => {}, { "~standard": { version: 1, validate: "invalid" } }),
      ].map(schema => ({ schema, defaultValues: { name: "" }, fields: [] })),
      { schema, defaultValues: { name: "" }, fields: null },
      { schema, defaultValues: { name: "" }, fields: {} },
      { schema, defaultValues: { name: "" } }, { fields: [] },
      { form: {}, schema, defaultValues: { name: "" }, fields: [] },
      { form: {}, fields: [], mode: "onBlur" },
      { form: {}, fields: [], defaultValues: { name: "" } },
      { form: {}, footer: null, children: null },
    ]
    for (const props of invalid) {
      expect(() => renderToString(<RuntimeForm {...props} onSubmit={() => {}} />)).toThrow(/ExUI Form:/)
    }
  })
})
