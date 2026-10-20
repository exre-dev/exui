import "@exre/exui/style.css"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import {
  Trace, TraceCollapsible, TraceCollapsibleContent, TraceCollapsibleTrigger,
  TraceDescription, TraceIcon, TraceLine, TraceTitle,
} from "@exre/exui"
import StreamingRun from "../../src/showcase/examples/trace/c-trace-2"
import CitedSources from "../../src/showcase/examples/trace/c-trace-6"

let root: Root
let container: HTMLDivElement
let fontSize: string

beforeEach(() => {
  fontSize = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  flushSync(() => root.unmount())
  container.remove()
  document.documentElement.style.fontSize = fontSize
  vi.useRealTimers()
})

describe("Trace public browser contract", () => {
  it("keeps status words, decorative icons and keyboard disclosure accessible", async () => {
    flushSync(() => root.render(<Trace>
      <TraceLine status="running"><TraceIcon>●</TraceIcon><TraceTitle>Running check</TraceTitle><TraceDescription>Step 1</TraceDescription></TraceLine>
      <TraceLine status="error"><TraceTitle>Failed check</TraceTitle></TraceLine>
      <TraceLine status="pending"><TraceTitle>Not started</TraceTitle></TraceLine>
      <TraceCollapsible>
        <TraceCollapsibleTrigger><TraceLine><TraceTitle>Show output</TraceTitle></TraceLine></TraceCollapsibleTrigger>
        <TraceCollapsibleContent>Build output</TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>))
    expect(container.querySelector('[data-status="running"]')?.textContent).toContain("Running check")
    expect(container.querySelector('[data-status="error"]')?.textContent).toBe("Failed check")
    expect(container.querySelector('[data-status="pending"]')?.textContent).toBe("Not started")
    expect(container.querySelector('[data-slot="trace-icon"]')?.getAttribute("aria-hidden")).toBe("true")
    expect(matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true)
    expect(getComputedStyle(container.querySelector<HTMLElement>('[data-status="running"] [data-slot="trace-title"]')!).animationName).toBe("none")
    const trigger = page.getByRole("button", { name: "Show output" })
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
    const arrow = container.querySelector<HTMLElement>('[data-slot="trace-collapsible-trigger"] [data-slot="trace-icon"]')!
    expect(getComputedStyle(arrow).transitionDuration).toBe("0s")
    container.querySelector<HTMLButtonElement>('[data-slot="trace-collapsible-trigger"]')!.focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
    await expect.element(page.getByText("Build output")).toBeVisible()
    expect(getComputedStyle(container.querySelector<HTMLElement>('[data-slot="trace-collapsible-content"]')!).animationName).toBe("none")
    await userEvent.keyboard(" ")
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("supports controlled and nested disclosure while Luma spacing follows root rem", async () => {
    const onOpenChange = vi.fn()
    const tree = (open: boolean) => <Trace>
      <TraceCollapsible open={open} onOpenChange={onOpenChange}>
        <TraceCollapsibleTrigger><TraceLine><TraceTitle>Parent run</TraceTitle></TraceLine></TraceCollapsibleTrigger>
        <TraceCollapsibleContent><Trace>
          <TraceCollapsible defaultOpen>
            <TraceCollapsibleTrigger><TraceLine><TraceTitle>Child run</TraceTitle></TraceLine></TraceCollapsibleTrigger>
            <TraceCollapsibleContent>Child output</TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace></TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
    flushSync(() => root.render(tree(true)))
    const parent = page.getByRole("button", { name: "Parent run" })
    const child = page.getByRole("button", { name: "Child run" })
    await expect.element(child).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(parent)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    await expect.element(parent).toHaveAttribute("aria-expanded", "true")
    const trace = container.querySelector<HTMLElement>('[data-slot="trace"]')!
    const gapAt16 = parseFloat(getComputedStyle(trace).rowGap)
    document.documentElement.style.fontSize = "32px"
    await expect.poll(() => parseFloat(getComputedStyle(trace).rowGap)).toBeCloseTo(gapAt16 * 2, 1)
    flushSync(() => root.render(tree(false)))
    await expect.element(parent).toHaveAttribute("aria-expanded", "false")
  })

  it("keeps interactive official streaming and citation examples operable", async () => {
    flushSync(() => root.render(<StreamingRun />))
    const stop = page.getByRole("button", { name: "Stop" })
    await userEvent.click(stop)
    await expect.element(page.getByRole("button", { name: "Run again" })).toBeVisible()
    flushSync(() => root.render(<CitedSources />))
    await userEvent.click(page.getByRole("button", { name: /Source 1|\[1\]/ }).first())
    await expect.poll(() => container.querySelector('[data-slot="trace-collapsible-trigger"][aria-expanded="true"]')).not.toBeNull()
  })
})
