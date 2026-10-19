import "@exre/exui/style.css"

import { act, createRef, useId, type ComponentProps, type CSSProperties, type ReactNode } from "react"
import { createRoot, hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { Field, FieldContent, FieldDescription, FieldLabel, Form, FormField, Input, useForm } from "@exre/exui"

const schema = z.object({ name: z.string().min(1), note: z.string() })
let host: HTMLDivElement
let root: Root
beforeEach(() => { host = document.createElement("div"); document.body.replaceChildren(host); root = createRoot(host) })
afterEach(() => root.unmount())

// A consumer composition using public Field primitives. The caller wires every
// actual focus target; there is no child inspection or implicit Input binding.
function FieldRecipe({ title, desc, layout = "vertical", contentMaxWidth, contentAlign = "left", span = 1,
  controlId, children, className = "", ...props }: Omit<ComponentProps<"div">, "title" | "children"> & {
  title: ReactNode; desc?: ReactNode; layout?: "vertical" | "horizontal"; contentMaxWidth?: CSSProperties["maxWidth"]
  contentAlign?: "left" | "right"; span?: 1 | 2 | 3 | 4 | "full"; controlId?: string
  children: (args: { id: string; descriptionId?: string }) => ReactNode
}) {
  const generatedId = useId()
  const id = controlId ?? generatedId
  const descriptionId = desc ? `${id}-description` : undefined
  return <Field {...props} className={`ex-item ${className}`} data-span={span} data-item-layout={layout} orientation="vertical">
    <div className="ex-item-heading">
      <FieldLabel htmlFor={id} className="ex-item-title">{title}</FieldLabel>
      {desc && <FieldDescription id={descriptionId} className="ex-item-description">{desc}</FieldDescription>}
    </div>
    <FieldContent className="ex-item-content" data-item-layout={layout} data-content-align={contentAlign}>
      <div className="ex-item-body" style={{ "--ex-item-content-max-width": typeof contentMaxWidth === "number" ? `${contentMaxWidth}px` : contentMaxWidth } as CSSProperties}>
        {children({ id, descriptionId })}
      </div>
    </FieldContent>
  </Field>
}

const standaloneInput = ({ id, descriptionId }: { id: string; descriptionId?: string }) => <Input id={id} aria-describedby={descriptionId} />

describe("Field recipes and FormField presentation", () => {
  it("caps and aligns horizontal content, then fills the width after wrapping", async () => {
    host.style.width = "48rem"
    root.render(<FieldRecipe title="Sized" layout="horizontal" contentMaxWidth="16rem" contentAlign="right">{standaloneInput}</FieldRecipe>)
    const input = page.getByRole("textbox", { name: "Sized" })
    await expect.element(input).toBeVisible()
    const rect = () => input.element().getBoundingClientRect()
    const item = host.querySelector<HTMLElement>(".ex-item")!
    expect(rect().width).toBeCloseTo(256, 0)
    expect(rect().right).toBeCloseTo(item.getBoundingClientRect().right, 0)
    host.style.width = "22rem"
    expect(rect().width).toBeCloseTo(196, 0)
    host.style.width = "20rem"
    expect(rect().width).toBeCloseTo(320, 0)
    expect(rect().left).toBeCloseTo(item.getBoundingClientRect().left, 0)
    host.style.width = "10rem"
    expect(rect().width).toBeCloseTo(160, 0)
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1)
  })

  it("inherits Form content defaults and allows independent field overrides", async () => {
    function ComposedSizing() {
      const form = useForm({ schema, defaultValues: { name: "", note: "" } })
      return <Form form={form} onSubmit={() => {}} layout="horizontal" contentMaxWidth={256} contentAlign="right">
        <FormField form={form} name="name" label="Left" control="text" contentAlign="left" />
        <FormField form={form} name="note" label="Narrow" control="text" contentMaxWidth="8rem" />
      </Form>
    }
    host.style.width = "48rem"
    root.render(<ComposedSizing />)
    await expect.element(page.getByRole("textbox", { name: "Narrow" })).toBeVisible()
    const rect = (name: string) => page.getByRole("textbox", { name, exact: true }).element().getBoundingClientRect()
    expect(rect("Left").width).toBeCloseTo(256, 0)
    expect(rect("Left").left).toBeCloseTo(host.getBoundingClientRect().left + 156, 0)
    expect(rect("Narrow").width).toBeCloseTo(128, 0)
    expect(rect("Narrow").right).toBeCloseTo(host.getBoundingClientRect().right, 0)
  })

  it("supports configured defaults, field overrides, and unconstrained vertical content", async () => {
    host.style.width = "48rem"
    root.render(<Form schema={schema} defaultValues={{ name: "", note: "" }} layout="horizontal"
      contentMaxWidth="16rem" contentAlign="right" fields={[
        { name: "name", label: "Configured", control: "text", contentMaxWidth: "8rem", contentAlign: "left" },
        { name: "note", label: "Vertical", control: "text", layout: "vertical" },
      ]} onSubmit={() => {}} />)
    await expect.element(page.getByRole("textbox", { name: "Configured" })).toBeVisible()
    expect(page.getByRole("textbox", { name: "Configured" }).element().getBoundingClientRect().width).toBeCloseTo(128, 0)
    expect(page.getByRole("textbox", { name: "Vertical" }).element().getBoundingClientRect().width).toBeCloseTo(768, 0)
  })

  it("can remove an inherited limit and keeps errors within aligned content", async () => {
    host.style.width = "48rem"
    root.render(<Form schema={schema} defaultValues={{ name: "", note: "" }} layout="horizontal"
      contentMaxWidth="16rem" contentAlign="right" fields={[
        { name: "name", label: "Required", control: "text" },
        { name: "note", label: "Full", control: "text", contentMaxWidth: "none" },
      ]} onSubmit={() => {}} />)
    const input = page.getByRole("textbox", { name: "Required" })
    await expect.element(input).toBeVisible()
    expect(page.getByRole("textbox", { name: "Full" }).element().getBoundingClientRect().width).toBeCloseTo(612, 0)
    await page.getByRole("button", { name: "提交" }).click()
    await expect.element(input).toHaveAttribute("aria-invalid", "true")
    const error = document.getElementById(`${input.element().id}-error`)!
    expect(error.getBoundingClientRect().left).toBeCloseTo(input.element().getBoundingClientRect().left, 0)
    expect(error.getBoundingClientRect().width).toBeCloseTo(256, 0)
    expect(host.querySelector("[contentmaxwidth], [contentalign]")).toBeNull()
  })

  it("explicitly associates labels and retains existing description references", async () => {
    root.render(<FieldRecipe title="Nickname" desc="Visible to others">{({ id, descriptionId }) =>
      <Input id={id} aria-describedby={`existing-help ${descriptionId}`} />}</FieldRecipe>)
    const input = page.getByRole("textbox", { name: "Nickname" })
    await expect.element(input).toBeVisible()
    const element = input.element() as HTMLInputElement
    expect(element.id).not.toBe("")
    expect(element.getAttribute("aria-describedby")).toBe(`existing-help ${element.id}-description`)
    expect(document.getElementById(`${element.id}-description`)?.textContent).toBe("Visible to others")
    await page.getByText("Nickname").click()
    expect(document.activeElement).toBe(element)
  })

  it("preserves the focus target value, change handler, and ref", async () => {
    const onChange = vi.fn()
    const ref = createRef<HTMLInputElement>()
    root.render(<FieldRecipe title="Handle">{({ id }) => <Input id={id} defaultValue="first" onChange={onChange} ref={ref} />}</FieldRecipe>)
    const input = page.getByRole("textbox", { name: "Handle" })
    await expect.element(input).toHaveValue("first")
    expect(ref.current).toBe(input.element())
    await input.fill("second")
    expect(ref.current?.value).toBe("second")
    expect(onChange).toHaveBeenCalled()
  })

  it("uses an explicit input id and lets the consumer merge unique description ids", async () => {
    root.render(<FieldRecipe title="Email" desc="Help" controlId="email">{({ id, descriptionId }) =>
      <Input id={id} aria-describedby={[...new Set(["other", descriptionId, "other"])].join(" ")} />}</FieldRecipe>)
    await expect.element(page.getByRole("textbox", { name: "Email" })).toBeVisible()
    expect(document.getElementById("email")?.getAttribute("aria-describedby")).toBe("other email-description")
  })

  it("associates wrapped, custom, and multiple controls at their actual focus elements", async () => {
    root.render(<>
      <FieldRecipe title="Wrapped">{({ id }) => <span><Input id={id} /></span>}</FieldRecipe>
      <FieldRecipe title="Custom" desc="Custom help" controlId="custom">{({ id, descriptionId }) => <input id={id} aria-describedby={descriptionId} />}</FieldRecipe>
      <FieldRecipe title="Multiple">{({ id }) => <><Input id={id} /><Input aria-label="Secondary" /></>}</FieldRecipe>
    </>)
    await expect.element(page.getByRole("textbox", { name: "Wrapped" })).toBeVisible()
    await expect.element(page.getByRole("textbox", { name: "Multiple" })).toBeVisible()
    await expect.element(page.getByRole("textbox", { name: "Secondary" })).toBeVisible()
    await page.getByText("Custom", { exact: true }).click()
    expect(document.activeElement).toBe(document.getElementById("custom"))
    expect(document.activeElement?.getAttribute("aria-describedby")).toBe("custom-description")
  })

  it("retains explicit generated associations through server rendering and hydration", async () => {
    const element = <FieldRecipe title="Hydrated" desc="Stable">{standaloneInput}</FieldRecipe>
    root.unmount()
    host.innerHTML = renderToString(element)
    const before = host.querySelector("input")?.id
    expect(before).toBeTruthy()
    const hydrated = hydrateRoot(host, element)
    await act(async () => {})
    expect(host.querySelector("input")?.id).toBe(before)
    expect(host.querySelector("label")?.htmlFor).toBe(before)
    expect(host.querySelector("input")?.getAttribute("aria-describedby")).toBe(`${before}-description`)
    hydrated.unmount()
    root = createRoot(host)
  })

  it("wraps by its own width and keeps controls inside very narrow containers", async () => {
    host.style.width = "22rem"
    root.render(<FieldRecipe title="A long title that can wrap" desc="A long description that can wrap" layout="horizontal">{standaloneInput}</FieldRecipe>)
    await expect.element(page.getByRole("textbox", { name: /A long title/ })).toBeVisible()
    const item = host.querySelector<HTMLElement>(".ex-item")!
    const heading = item.querySelector<HTMLElement>(".ex-item-heading")!
    const content = item.querySelector<HTMLElement>(".ex-item-content")!
    expect(Math.abs(heading.getBoundingClientRect().top - content.getBoundingClientRect().top)).toBeLessThan(2)
    host.style.width = "20rem"
    expect(content.getBoundingClientRect().top).toBeGreaterThanOrEqual(heading.getBoundingClientRect().bottom - 2)
    host.style.width = "10rem"
    expect(content.getBoundingClientRect().right).toBeLessThanOrEqual(item.getBoundingClientRect().right + 1)
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1)
  })

  it("retains span and root attributes in an independent grid", async () => {
    root.render(<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
      <FieldRecipe title="Grid input" span={2} className="consumer-item" style={{ marginTop: "4px" }} data-testid="grid-item">{standaloneInput}</FieldRecipe>
    </div>)
    await expect.element(page.getByRole("textbox", { name: "Grid input" })).toBeVisible()
    const item = page.getByTestId("grid-item").element() as HTMLElement
    expect(item.classList.contains("consumer-item")).toBe(true)
    expect(item.style.marginTop).toBe("4px")
    expect(getComputedStyle(item).gridColumnStart).toBe("span 2")
  })

  it("inherits inline Form layout while allowing vertical overrides", async () => {
    function Composed() {
      const form = useForm({ schema, defaultValues: { name: "", note: "" } })
      return <Form form={form} onSubmit={() => {}} layout="inline" columns={{ base: 2 }}>
        <FieldRecipe title="Static" layout="horizontal">{standaloneInput}</FieldRecipe>
        <FormField form={form} name="name" label="Name" control="text" />
        <FormField form={form} name="note" label="Note" control="text" layout="vertical" colSpan={2} />
      </Form>
    }
    host.style.width = "20rem"
    root.render(<Composed />)
    await expect.element(page.getByRole("textbox", { name: "Name" })).toBeVisible()
    const items = [...host.querySelectorAll<HTMLElement>(".ex-item")]
    expect(items.map(item => item.dataset.itemLayout)).toEqual(["horizontal", "horizontal", "vertical"])
    expect(items[2]?.dataset.span).toBe("2")
    expect(items[1]!.getBoundingClientRect().top).toBeGreaterThan(items[0]!.getBoundingClientRect().top)
  })

  it("wraps a narrow field in a wide multi-column form and clamps its span", async () => {
    function Columns() {
      const form = useForm({ schema, defaultValues: { name: "", note: "" } })
      return <Form form={form} onSubmit={() => {}} layout="horizontal" columns={{ base: 2 }}>
        <FormField form={form} name="name" label="Name" control="text" />
        <FormField form={form} name="note" label="Note" control="text" colSpan={4} />
      </Form>
    }
    host.style.width = "36rem"
    root.render(<Columns />)
    await expect.element(page.getByRole("textbox", { name: "Name" })).toBeVisible()
    const items = [...host.querySelectorAll<HTMLElement>(".ex-item")]
    const heading = items[0]!.querySelector<HTMLElement>(".ex-item-heading")!
    const content = items[0]!.querySelector<HTMLElement>(".ex-item-content")!
    expect(content.getBoundingClientRect().top).toBeGreaterThanOrEqual(heading.getBoundingClientRect().bottom - 2)
    expect(items[1]?.dataset.span).toBe("4")
    expect(getComputedStyle(items[1]!).gridColumnStart).toBe("span 2")
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1)
  })

  it("uses configured field overrides and preserves noStyle", async () => {
    root.render(<Form schema={schema} defaultValues={{ name: "", note: "" }} layout="horizontal" fields={[
      { name: "name", label: "Name", control: "text", layout: "vertical" },
      { name: "note", label: "Note", control: "text", noStyle: true, colSpan: 2 },
    ]} onSubmit={() => {}} />)
    await expect.element(page.getByRole("textbox", { name: "Name" })).toBeVisible()
    expect(host.querySelectorAll(".ex-item")).toHaveLength(1)
    expect(host.querySelector<HTMLElement>(".ex-item")?.dataset.itemLayout).toBe("vertical")
    expect(host.querySelector<HTMLInputElement>('input[name="note"]')).not.toBeNull()
    expect(host.querySelector('input[name="note"]')?.closest(".ex-item")).toBeNull()
  })

  it("keeps field description and validation error associations", async () => {
    root.render(<Form schema={schema} defaultValues={{ name: "", note: "" }} fields={[
      { name: "name", label: "Name", description: "Public name", control: "text" },
    ]} onSubmit={() => {}} />)
    const input = page.getByRole("textbox", { name: "Name" })
    await expect.element(input).toBeVisible()
    await page.getByRole("button", { name: "提交" }).click()
    const element = input.element() as HTMLInputElement
    await expect.poll(() => element.getAttribute("aria-invalid")).toBe("true")
    expect(element.getAttribute("aria-describedby")).toBe(`${element.id}-description ${element.id}-error`)
    expect(host.querySelector(".ex-item-heading")?.contains(document.getElementById(`${element.id}-description`))).toBe(true)
    expect(host.querySelector(".ex-item-content")?.contains(document.getElementById(`${element.id}-error`))).toBe(true)
    expect(getComputedStyle(host.querySelector<HTMLElement>(".ex-item-heading")!).color).toBe(getComputedStyle(host).color)
  })

  it("does not leave a description reference for an empty description", async () => {
    root.render(<Form schema={schema} defaultValues={{ name: "", note: "" }} fields={[
      { name: "name", label: "Name", description: "", control: "text" },
    ]} onSubmit={() => {}} />)
    const input = page.getByRole("textbox", { name: "Name" })
    await expect.element(input).toBeVisible()
    expect(input.element().getAttribute("aria-describedby")).toBeNull()
    expect(host.querySelector('[data-slot="field-description"]')).toBeNull()
  })
})
