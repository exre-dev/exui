import "@exre/exui/style.css"
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, ThemeProvider } from "@exre/exui"

let root: Root
let calls: boolean[]
function Sample({ blockClosing = false }: { blockClosing?: boolean }) {
  const [open, setOpen] = React.useState(false)
  return <Dialog open={open} onOpenChange={(next) => { calls.push(next); if (!blockClosing || next) setOpen(next) }}>
    <DialogTrigger asChild><Button>Open project</Button></DialogTrigger>
    <DialogContent closeLabel="Close project">
      <DialogHeader><DialogTitle>Edit project</DialogTitle><DialogDescription>Update the project name.</DialogDescription></DialogHeader>
      <Input aria-label="Project name" defaultValue="Aurora" />
      <DialogClose asChild><Button>Cancel</Button></DialogClose>
    </DialogContent>
  </Dialog>
}
beforeEach(() => {
  const container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
  calls = []
})
afterEach(() => root.unmount())
async function open() {
  await userEvent.click(page.getByRole("button", { name: "Open project", exact: true }))
  await expect.element(page.getByRole("dialog", { name: "Edit project" })).toBeVisible()
}
async function closed() {
  await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull()
  await expect.poll(() => document.activeElement?.textContent).toBe("Open project")
}
describe("public Dialog", () => {
  it("closes through the corner, Escape and footer, returning focus to the trigger", async () => {
    root.render(<ThemeProvider><Sample /></ThemeProvider>)
    await open()
    await userEvent.click(page.getByRole("button", { name: "Close project", exact: true }))
    await closed()
    await open()
    await userEvent.keyboard("{Escape}")
    await closed()
    await open()
    await userEvent.click(page.getByRole("button", { name: "Cancel", exact: true }))
    await closed()
    expect(calls).toEqual([true, false, true, false, true, false])
  })
  it("lets the controlled owner decline a close and applies its updated policy", async () => {
    root.render(<ThemeProvider><Sample blockClosing /></ThemeProvider>)
    await open()
    await userEvent.fill(page.getByRole("textbox", { name: "Project name" }), "Aurora draft")
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("dialog", { name: "Edit project" })).toBeVisible()
    expect(calls).toEqual([true, false])
    root.render(<ThemeProvider><Sample /></ThemeProvider>)
    await expect.element(page.getByRole("textbox", { name: "Project name" })).toHaveValue("Aurora draft")
    await userEvent.keyboard("{Escape}")
    await closed()
  })
  it("associates the portaled title and description with the dialog", async () => {
    root.render(<ThemeProvider><Sample /></ThemeProvider>)
    await open()
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!
    expect(document.getElementById(dialog.getAttribute("aria-labelledby")!)?.textContent).toBe("Edit project")
    expect(document.getElementById(dialog.getAttribute("aria-describedby")!)?.textContent).toBe("Update the project name.")
    expect(document.querySelector('[data-slot="dialog-trigger"]')?.parentElement?.contains(dialog)).toBe(false)
  })
})
