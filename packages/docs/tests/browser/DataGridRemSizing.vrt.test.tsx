import "@exre/exui/style.css"

import { useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import {
  DataGrid, DataGridTable, DataGridTableVirtual, DataGridScrollArea, dataGridFeatures, TanStackTable,
} from "@exre/exui"

type Item = { id: string; name: string }
const data: Item[] = Array.from({ length: 100 }, (_, index) => ({ id: `${index}`, name: `Row ${index}` }))
const columns: TanStackTable.ColumnDef<typeof dataGridFeatures, Item>[] = [
  { id: "default", accessorKey: "name", header: "Default" },
  { id: "fixed", accessorKey: "name", header: "Fixed", size: 180, minSize: 30 },
  { id: "state", accessorKey: "name", header: "State" },
]
const app = TanStackTable.createTableHook({ features: dataGridFeatures })
const appColumns = [app.createAppColumnHelper<Item>().accessor((row): unknown => row.name, { id: "name", header: "App" })]
let host: HTMLDivElement
let root: Root
let oldFont: string
let virtualModel: { measurementsCache: { size: number }[] } | undefined

function Grid({ virtual = false, estimateSize, customEstimate, variant = "ring" }: {
  virtual?: boolean; estimateSize?: number; customEstimate?: number; variant?: "ring" | "dot" | "square"
}) {
  const [columnSizing, setColumnSizing] = useState<TanStackTable.ColumnSizingState>({ state: 190 })
  const table = TanStackTable.useTable({
    features: dataGridFeatures, columns, data, manualPagination: true,
    state: { columnSizing, columnPinning: { start: ["default", "fixed"], end: [] } },
    onColumnSizingChange: setColumnSizing,
  })
  return <>
    <output data-testid="model">{JSON.stringify({ sizes: table.getAllLeafColumns().map(c => c.getSize()), min: table.getColumn("default")!.columnDef.minSize, pin: table.getColumn("fixed")!.getStart("start"), state: columnSizing })}</output>
    <DataGrid table={table} recordCount={data.length} tableLayout={{ columnsResizable: true, columnsPinnable: true, cellSelection: true, cellFillHandle: true, cellFillHandleVariant: variant }}>
      {virtual ? <DataGridTableVirtual height={300} estimateSize={estimateSize} overscan={0} virtualizerOptions={{ onChange: instance => { virtualModel = instance }, measureElement: () => customEstimate ?? estimateSize ?? 48, ...(customEstimate ? { estimateSize: () => customEstimate } : {}) }} /> : <DataGridTable />}
    </DataGrid>
  </>
}

function AppGrid({ explicit = false, undefinedSizes = false }: { explicit?: boolean; undefinedSizes?: boolean }) {
  const table = app.useAppTable({ columns: undefinedSizes ? [{ id: "group", columns: [{ id: "name", accessorKey: "name", size: undefined, minSize: undefined }] }] : appColumns, data, ...(explicit ? { defaultColumn: { size: 177, minSize: 31 } } : undefinedSizes ? { defaultColumn: { size: undefined, minSize: undefined } } : {}) }, state => ({ columnSizing: state.columnSizing }))
  const typedName: string = table.getRowModel().rows[0].original.name
  return <table.AppTable><output data-testid="app-model">{JSON.stringify({ size: table.getAllLeafColumns()[0].getSize(), min: table.getAllLeafColumns()[0].columnDef.minSize, typedName })}</output></table.AppTable>
}

function ScrollbarGrid({ sticky }: { sticky: boolean }) {
  const table = TanStackTable.useTable({ features: dataGridFeatures, columns, data, manualPagination: true })
  return <div data-scroll-case={sticky ? "sticky" : "plain"} style={{ width: 300 }}>
    <DataGrid table={table} recordCount={data.length} tableLayout={{ headerSticky: sticky }}>
      <DataGridScrollArea orientation="vertical" style={{ width: 300, height: 180 }}><DataGridTable /></DataGridScrollArea>
    </DataGrid>
  </div>
}

function model() { return JSON.parse(host.querySelector('[data-testid="model"]')!.textContent!) }
function near(actual: number, expected: number) { expect(Math.abs(actual - expected)).toBeLessThan(0.1) }
async function font(size: number) { document.documentElement.style.fontSize = `${size}px`; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))) }

beforeEach(() => {
  oldFont = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  host = document.createElement("div"); document.body.append(host); root = createRoot(host)
  virtualModel = undefined
})
afterEach(() => { root.unmount(); host.remove(); document.documentElement.style.fontSize = oldFont })

describe("DataGrid rem defaults through the public package", () => {
  it("keeps sticky and primitive scrollbar geometry aligned at every root", async () => {
    root.render(<><ScrollbarGrid sticky={false} /><ScrollbarGrid sticky /></>)
    const plainCase = () => host.querySelector<HTMLElement>('[data-scroll-case="plain"]')!
    const stickyCase = () => host.querySelector<HTMLElement>('[data-scroll-case="sticky"]')!
    const plainThumb = () => plainCase().querySelector<HTMLElement>('[data-slot="data-grid-thumb"]')!
    const stickyThumb = () => stickyCase().querySelector<HTMLElement>('[data-slot="data-grid-scroll-area"]')!.parentElement!.querySelector<HTMLElement>(':scope > [aria-hidden="true"] > div > div')!
    await expect.poll(() => plainThumb()).toBeTruthy()
    await expect.poll(() => stickyThumb()).toBeTruthy()
    for (const size of [16, 21.328, 32]) {
      await font(size)
      await expect.poll(() => stickyThumb().getBoundingClientRect().width).toBeCloseTo(plainThumb().getBoundingClientRect().width, 1)
      const plainRight = plainCase().querySelector('[data-slot="data-grid-scroll-area"]')!.getBoundingClientRect().right
      const stickyRight = stickyCase().querySelector('[data-slot="data-grid-scroll-area"]')!.getBoundingClientRect().right
      near(stickyRight - stickyThumb().getBoundingClientRect().right, plainRight - plainThumb().getBoundingClientRect().right)
    }
  })

  it("inherits scaled defaults for undefined optional sizes in nested column definitions", async () => {
    root.render(<AppGrid undefinedSizes />)
    await expect.poll(() => host.querySelector('[data-testid="app-model"]')).toBeTruthy()
    for (const size of [16, 21.328, 32]) {
      await font(size)
      await expect.poll(() => JSON.parse(host.querySelector('output')!.textContent!).size).toBeCloseTo(150 * size / 16, 4)
      near(JSON.parse(host.querySelector('output')!.textContent!).min, 20 * size / 16)
    }
  })

  for (const [label, estimateSize, customEstimate] of [["default", undefined, undefined], ["explicit", 63, undefined], ["callback", undefined, 71]] as const) {
    it(`keeps virtual row ${label} estimates in the correct coordinate space`, async () => {
      root.render(<Grid virtual estimateSize={estimateSize} customEstimate={customEstimate} />)
      await expect.poll(() => virtualModel?.measurementsCache.length).toBe(100)
      for (const size of [16, 21.328, 32]) {
        await font(size)
        await expect.poll(() => virtualModel?.measurementsCache[99].size).toBeCloseTo(customEstimate ?? estimateSize ?? 3 * size, 4)
        // Already measured rows use the supplied physical measurement unchanged.
        near(virtualModel!.measurementsCache[0].size, customEstimate ?? estimateSize ?? 48)
      }
    })
  }

  it("commits a real column resize as pixels and keeps it fixed through later root changes", async () => {
    root.render(<Grid />)
    await font(32)
    await expect.poll(() => host.querySelector('[data-slot="data-grid-table-resize-handle"]')).toBeTruthy()
    await expect.poll(() => model().sizes[0]).toBe(300)
    const handle = host.querySelector<HTMLElement>('[data-slot="data-grid-table-resize-handle"]')!
    const box = handle.getBoundingClientRect()
    handle.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0, clientX: box.right, clientY: box.top + 5 }))
    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, buttons: 1, clientX: box.right + 40, clientY: box.top + 5 }))
    await expect.poll(() => host.querySelector('[data-slot="data-grid-table-resize-indicator"]')).toBeTruthy()
    near(host.querySelector('[data-slot="data-grid-table-resize-indicator"]')!.lastElementChild!.getBoundingClientRect().width, 10)
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, button: 0, clientX: box.right + 40, clientY: box.top + 5 }))
    await expect.poll(() => model().state.default).toBe(340)
    await font(21.328)
    await expect.poll(() => model().sizes[0]).toBe(340)
    near(model().pin, 340)
  })

  it("updates defaults on the same table while explicit sizes, pin offsets and state stay pixels", async () => {
    root.render(<Grid />)
    await expect.poll(() => host.querySelector('[data-testid="model"]')).toBeTruthy()
    for (const size of [16, 21.328, 32]) {
      await font(size)
      await expect.poll(() => model().sizes[0]).toBeCloseTo(150 * size / 16, 4)
      near(model().min, 20 * size / 16); near(model().pin, 150 * size / 16)
      expect(model().sizes.slice(1)).toEqual([180, 190])
      const fixed = host.querySelector<HTMLElement>('th[data-pinned="start"] + th')!
      near(parseFloat(getComputedStyle(fixed).insetInlineStart), 150 * size / 16)
    }
  })

  it("scales createTableHook defaults and preserves per-table defaultColumn overrides and generic row inference", async () => {
    root.render(<AppGrid />)
    await expect.poll(() => host.querySelector('[data-testid="app-model"]')).toBeTruthy()
    for (const size of [16, 21.328, 32]) {
      await font(size)
      await expect.poll(() => JSON.parse(host.querySelector('output')!.textContent!).size).toBeCloseTo(150 * size / 16, 4)
    }
    root.render(<AppGrid explicit />)
    await expect.poll(() => JSON.parse(host.querySelector('output')!.textContent!).size).toBe(177)
    expect(JSON.parse(host.querySelector('output')!.textContent!).min).toBe(31)
  })

  for (const [variant, base] of [["ring", 11], ["dot", 9], ["square", 5]] as const) {
    it(`scales the ${variant} fill handle without scaling border strokes`, async () => {
      root.render(<Grid variant={variant} />)
      await expect.poll(() => host.querySelector('td')).toBeTruthy()
      await userEvent.click(page.getByText("Row 0", { exact: true }).first())
      await expect.poll(() => host.querySelector('[data-slot="data-grid-cell-fill-handle"]')).toBeTruthy()
      for (const size of [16, 21.328, 32]) {
        await font(size)
        const handle = host.querySelector<HTMLElement>('[data-slot="data-grid-cell-fill-handle"]')!
        near(handle.getBoundingClientRect().width, base * size / 16)
        if (variant === "ring") near(parseFloat(getComputedStyle(handle).borderTopWidth), 2)
      }
    })
  }
})
