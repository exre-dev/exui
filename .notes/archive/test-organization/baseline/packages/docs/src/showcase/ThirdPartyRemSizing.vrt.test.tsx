import "@exre/exui/style.css"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { Recharts, Toaster, toast, MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, useMessageScrollerScrollable, ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@exre/exui"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"

let container: HTMLDivElement
let root: Root
let previousFont: string
beforeEach(() => {
  previousFont = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  toast.dismiss()
  flushSync(() => root.unmount())
  container.remove()
  document.documentElement.style.fontSize = previousFont
})

function PlotArea() {
  const area = Recharts.usePlotArea()
  return <g data-plot-x={area?.x} data-plot-height={area?.height} />
}

function ScrollState() {
  const state = useMessageScrollerScrollable()
  return <output data-scroll-start={String(state.start)} />
}

function ScrollerFixture({ explicit = false }) {
  return <MessageScrollerProvider defaultScrollPosition="start" scrollEdgeThreshold={explicit ? 8 : undefined}>
    <ScrollState />
    <MessageScroller style={{ height: 150, width: 300 }}>
      <MessageScrollerViewport><MessageScrollerContent>
        {Array.from({ length: 20 }, (_, i) => <MessageScrollerItem key={i} messageId={String(i)} style={{ height: 30 }}>Message {i}</MessageScrollerItem>)}
      </MessageScrollerContent></MessageScrollerViewport>
    </MessageScroller>
  </MessageScrollerProvider>
}

describe("third-party relative defaults", () => {
  it("updates message scroll edge defaults and preserves an explicit threshold", async () => {
    flushSync(() => root.render(<ScrollerFixture />))
    const viewport = container.querySelector<HTMLElement>('[data-slot="message-scroller-viewport"]')!
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      // Allow the provider's rem subscription to publish before moving.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      viewport.scrollTop = 12
      viewport.dispatchEvent(new Event("scroll", { bubbles: true }))
      await expect.poll(() => container.querySelector('[data-scroll-start]')?.getAttribute("data-scroll-start")).toBe(String(12 > 0.5 * rootPixels))
    }
    flushSync(() => root.render(<ScrollerFixture explicit />))
    viewport.scrollTop = 12
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }))
    await expect.poll(() => container.querySelector('[data-scroll-start]')?.getAttribute("data-scroll-start")).toBe("true")
  })

  it("scales the resizable pointer target while respecting an explicit minimum", async () => {
    const elementRef: { current: HTMLDivElement | null } = { current: null }
    const renderPanels = (explicit = false) => flushSync(() => root.render(
      <ResizablePanelGroup elementRef={elementRef} style={{ width: 300, height: 100 }} resizeTargetMinimumSize={explicit ? { coarse: 20, fine: 10 } : undefined}>
        <ResizablePanel defaultSize="50%"><div data-resize-left style={{ width: "100%", height: "100%" }}>Left</div></ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">Right</ResizablePanel>
      </ResizablePanelGroup>
    ))
    renderPanels()
    expect(elementRef.current).toBe(container.querySelector('[data-slot="resizable-panel-group"]'))
    const hoverNearEdge = async () => {
      const panel = container.querySelector<HTMLElement>('[data-resize-left]')!
      await page.elementLocator(panel).hover({ position: { x: 5, y: 50 } })
      await page.elementLocator(panel).hover({ position: { x: panel.getBoundingClientRect().width - 7, y: 50 } })
      return getComputedStyle(panel).cursor
    }
    await expect.poll(hoverNearEdge).not.toMatch(/resize/)
    document.documentElement.style.fontSize = "32px"
    await expect.poll(hoverNearEdge).toMatch(/resize/)
    renderPanels(true)
    await expect.poll(hoverNearEdge).not.toMatch(/resize/)
  })

  it("observes a Resizable group's actual owner document and preserves its caller ref", async () => {
    const frame = document.createElement("iframe")
    document.body.append(frame)
    const owner = frame.contentDocument!
    owner.documentElement.style.fontSize = "32px"
    const mount = owner.createElement("div")
    owner.body.append(mount)
    const frameRoot = createRoot(mount)
    const elementRef: { current: HTMLDivElement | null } = { current: null }
    try {
      flushSync(() => frameRoot.render(<ResizablePanelGroup elementRef={elementRef} style={{ width: 300, height: 100 }}><ResizablePanel>Left</ResizablePanel><ResizableHandle /><ResizablePanel>Right</ResizablePanel></ResizablePanelGroup>))
      expect(elementRef.current?.ownerDocument).toBe(owner)
      await expect.poll(() => owner.querySelector('[data-exui-rem-probe]')).toBeTruthy()
    } finally {
      flushSync(() => frameRoot.unmount())
      expect(elementRef.current).toBeNull()
      expect(owner.querySelector('[data-exui-rem-probe]')).toBeNull()
      frame.remove()
    }
  })

  it("updates Recharts axis layout and tick lengths with a live root", async () => {
    flushSync(() => root.render(
      <Recharts.LineChart width={800} height={400} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} data={[{ label: "First", value: 3 }, { label: "Last", value: 8 }]}>
        <Recharts.XAxis dataKey="label" />
        <Recharts.YAxis />
        <Recharts.Line dataKey="value" isAnimationActive={false} />
        <PlotArea />
      </Recharts.LineChart>
    ))
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      await expect.poll(() => Number(container.querySelector('[data-plot-x]')?.getAttribute("data-plot-x"))).toBeCloseTo(3.75 * rootPixels, 1)
      await expect.poll(() => Number(container.querySelector('[data-plot-height]')?.getAttribute("data-plot-height"))).toBeCloseTo(400 - 1.875 * rootPixels, 1)
      await expect.poll(() => {
        const tick = container.querySelector<SVGLineElement>(".recharts-yAxis .recharts-cartesian-axis-tick-line")
        return tick ? Math.abs(tick.x2.baseVal.value - tick.x1.baseVal.value) : 0
      }).toBeCloseTo(0.375 * rootPixels, 1)
    }
  })

  it("retains explicit Recharts axis pixel sizes", async () => {
    document.documentElement.style.fontSize = "32px"
    flushSync(() => root.render(
      <Recharts.LineChart width={800} height={400} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} data={[{ label: "First", value: 3 }]}>
        <Recharts.XAxis dataKey="label" height={40} />
        <Recharts.YAxis width={70} tickSize={9} />
        <Recharts.Line dataKey="value" isAnimationActive={false} />
        <PlotArea />
      </Recharts.LineChart>
    ))
    await expect.poll(() => Number(container.querySelector('[data-plot-x]')?.getAttribute("data-plot-x"))).toBe(70)
    await expect.poll(() => Number(container.querySelector('[data-plot-height]')?.getAttribute("data-plot-height"))).toBe(360)
  })

  it("keeps tooltip and legend geometry in the same chart context", async () => {
    flushSync(() => root.render(
      <Recharts.LineChart width={320} height={400} data={[{ label: "First", value: 3 }, { label: "Last", value: 8 }]}>
        <Recharts.XAxis dataKey="label" padding={{ left: 10, right: 10 }} /><Recharts.YAxis domain={[0, 10]} />
        <Recharts.Line dataKey="value" name="Values" isAnimationActive={false} />
        <Recharts.Tooltip active defaultIndex={0} content={props => <div data-tooltip-offset={props.offset}>{props.label}</div>} />
        <Recharts.Legend />
      </Recharts.LineChart>
    ))
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      await expect.poll(() => Number(container.querySelector('[data-tooltip-offset]')?.getAttribute("data-tooltip-offset"))).toBeCloseTo(0.625 * rootPixels, 1)
      await expect.poll(() => container.querySelector('[data-tooltip-offset]')?.textContent).toBe("First")
      await expect.poll(() => container.querySelector<SVGElement>(".recharts-legend-item svg")?.getBoundingClientRect().width).toBeCloseTo(0.875 * rootPixels, 1)
      await expect.poll(() => parseFloat(getComputedStyle(container.querySelector(".recharts-legend-item")!).marginRight)).toBeCloseTo(0.625 * rootPixels, 1)
    }
    const dot = container.querySelectorAll<SVGElement>(".recharts-line-dot")[1]!
    await page.elementLocator(dot).hover({ force: true })
    await expect.poll(() => container.querySelector('[data-tooltip-offset]')?.textContent).toBe("Last")
  })

  it("scales Sonner content and action geometry dynamically", async () => {
    flushSync(() => root.render(<Toaster position="top-right" closeButton />))
    toast.success("Relative toast", { duration: Infinity, action: { label: "Action", onClick: () => {} } })
    await expect.poll(() => container.querySelector('[data-sonner-toast]')).toBeTruthy()
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      const item = container.querySelector<HTMLElement>('[data-sonner-toast]')!
      await expect.poll(() => parseFloat(getComputedStyle(item).paddingTop)).toBeCloseTo(rootPixels, 1)
      await expect.poll(() => parseFloat(getComputedStyle(item).fontSize)).toBeCloseTo(rootPixels * 0.8125, 1)
      await expect.poll(() => item.querySelector<HTMLElement>('[data-button]')!.getBoundingClientRect().height).toBeCloseTo(rootPixels * 1.5, 1)
      await expect.poll(() => item.querySelector<SVGElement>('[data-close-button] svg')!.getBoundingClientRect().width).toBeCloseTo(rootPixels * 0.75, 1)
    }
  })

  it("retains caller toast styles while applying default theme variables", async () => {
    document.documentElement.style.fontSize = "32px"
    flushSync(() => root.render(<Toaster closeButton icons={{ close: <svg width={17} height={17} /> }} style={{ "--width": "300px" } as React.CSSProperties} toastOptions={{ style: { padding: 7, fontSize: 11 } }} />))
    toast("Explicit toast", { duration: Infinity })
    await expect.poll(() => container.querySelector('[data-sonner-toast]')).toBeTruthy()
    const item = container.querySelector<HTMLElement>('[data-sonner-toast]')!
    expect(parseFloat(getComputedStyle(item).paddingTop)).toBe(7)
    expect(parseFloat(getComputedStyle(item).fontSize)).toBe(11)
    expect(item.querySelector<SVGElement>('[data-close-button] svg')!.getBoundingClientRect().width).toBe(17)
    expect(container.querySelector<HTMLElement>('[data-sonner-toaster]')!.style.getPropertyValue("--normal-bg").trim()).toBe("var(--popover)")
  })
})
