import "@exre/exui/style.css"

import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import {
  Cascader, CascaderColumns, CascaderPanel, CascaderList, CascaderVirtualItems, CascaderInput, CascaderTrigger, CascaderContent,
  EmojiPicker, EmojiPickerPanel, EmojiPickerList, EmojiPickerPreview,
  FilterFieldPicker, Filters, Tree, TreeItem, TreeItemLabel,
  useCascaderVirtualizer, useFilterRowDrag, type EmojiPickerData,
} from "@exre/exui"

let root: Root
let host: HTMLDivElement
let previousFont: string
const sizes = [16, 21.328, 32]
const items = Array.from({ length: 100 }, (_, i) => ({ value: `item-${i}`, label: `Item ${i}` }))
const emojis: EmojiPickerData = {
  locale: "en", categories: { "smileys": "Smileys" },
  emojis: Array.from({ length: 160 }, (_, i) => ({
    id: `emoji-${i}`, emoji: String.fromCodePoint(0x1f600 + i % 50), label: `Emoji ${i}`,
    tags: [], shortcodes: [], category: "smileys", version: 0,
  })),
}

beforeEach(() => {
  previousFont = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  host = document.createElement("div")
  document.body.replaceChildren(host)
  root = createRoot(host)
})
afterEach(() => {
  root.unmount()
  document.documentElement.style.fontSize = previousFont
})
function close(actual: number, expected: number) { expect(Math.abs(actual - expected)).toBeLessThan(0.1) }
function element(selector: string) { return host.querySelector<HTMLElement>(selector)! }

function TreeFixture({ indent }: { indent?: number }) {
  const data: Record<string, { name: string; children?: string[] }> = {
    root: { name: "Root", children: ["branch"] }, branch: { name: "Branch", children: ["leaf"] }, leaf: { name: "Leaf" },
  }
  const tree = useTree<{ name: string; children?: string[] }>({
    rootItemId: "root", initialState: { expandedItems: ["branch"] },
    getItemName: item => item.getItemData().name,
    isItemFolder: item => !!item.getItemData().children,
    dataLoader: { getItem: id => data[id], getChildren: id => data[id].children ?? [] },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  })
  return <Tree tree={tree} indent={indent}>{tree.getItems().map(item => <TreeItem key={item.getId()} item={item}><TreeItemLabel /></TreeItem>)}</Tree>
}

function VirtualFixture({ estimateSize }: { estimateSize?: number }) {
  const scroll = useRef<HTMLDivElement>(null)
  const virtual = useCascaderVirtualizer({ count: 100, getScrollElement: () => scroll.current, getItemKey: i => i, estimateSize })
  return <div data-testid="virtual" ref={scroll} style={{ height: 150, overflow: "auto" }}>
    <div data-testid="spacer" style={{ height: virtual.getTotalSize(), position: "relative" }}>
      {virtual.getVirtualItems().map(row => <div key={row.key} data-row={row.index} style={{ position: "absolute", top: row.start }}>Row {row.index}</div>)}
    </div>
  </div>
}

function MeasuredVirtualFixture() {
  const scroll = useRef<HTMLDivElement>(null)
  const virtual = useCascaderVirtualizer({ count: 3, getScrollElement: () => scroll.current, getItemKey: i => i, estimateSize: 32 })
  return <div ref={scroll} style={{ height: 150, overflow: "auto" }}>
    <div data-testid="measured-spacer" data-rendered-rem={parseFloat(getComputedStyle(document.documentElement).fontSize)} style={{ height: virtual.getTotalSize(), position: "relative" }}>
      {virtual.getVirtualItems().map(row => <div key={row.key} data-index={row.index} ref={virtual.measureElement} style={{ height: 64, position: "absolute", top: row.start }}>Row {row.index}</div>)}
    </div>
  </div>
}

function DragFixture() {
  const panel = useRef<HTMLDivElement>(null)
  const drag = useFilterRowDrag({ root: () => panel.current, onDrop: () => {} })
  return <div ref={panel}><div data-slot="filter-row" data-node-id="source" data-parent-id="group" data-index="0" style={{ width: 200, height: 40 }}><button data-testid="drag-handle" {...drag("source")}>Drag row</button></div></div>
}

function DropFixture({ onDrop }: { onDrop: (nodeId: string, details: { parentId: string; index: number; copy: boolean }) => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const [committed, setCommitted] = useState("unchanged")
  const drag = useFilterRowDrag({ root: () => panel.current, onDrop: (id, details) => {
    onDrop(id, details)
    setCommitted(`${id}:${details.parentId}:${details.index}:${details.copy}`)
  } })
  return <div ref={panel} style={{ width: "12rem" }}>
    <div data-slot="filter-row" data-node-id="source" data-parent-id="original" data-index="0" style={{ height: "2.5rem" }}>
      <button data-testid="drop-handle" {...drag("source")}>Drag condition</button>
    </div>
    <div data-slot="filter-group"><div data-testid="drop-target" data-drop-parent="destination" data-drop-index="2" style={{ height: "4rem" }}>Destination group</div></div>
    <output data-testid="drop-result">{committed}</output>
  </div>
}

describe("Complex rem geometry through the public package", () => {
  for (const immediate of [false, true]) for (const copy of [false, true]) {
    it(`cancels a valid filter ${copy ? "copy" : "move"} after a root change with ${immediate ? "immediate release" : "observer notification"}`, async () => {
      const dropped = vi.fn()
      flushSync(() => root.render(<DropFixture onDrop={dropped} />))
      const send = (target: EventTarget, type: string, x: number, y: number) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 83, pointerType: "mouse", button: 0, clientX: x, clientY: y, altKey: copy }))
      const begin = () => {
        const handle = element('[data-testid="drop-handle"]')
        const source = handle.getBoundingClientRect()
        const target = element('[data-testid="drop-target"]').getBoundingClientRect()
        send(handle, "pointerdown", source.left + 2, source.top + 2)
        send(window, "pointermove", target.left + target.width / 2, target.top + target.height / 2)
        expect(element('[data-testid="drop-target"]').hasAttribute("data-drop-into")).toBe(true)
        expect(document.querySelector('[data-slot="filters-drag-carry"]')).not.toBeNull()
      }
      const assertClean = () => {
        expect(document.querySelector('[data-slot="filters-drag-carry"]')).toBeNull()
        expect(host.querySelector("[data-drop-into], [data-drop-edge], [data-dragging], [data-drop-noop]")).toBeNull()
        expect(document.body.style.cursor).toBe("")
        expect(document.body.style.userSelect).toBe("")
        expect(document.querySelector("[data-exui-rem-probe]")).toBeNull()
      }
      begin()
      document.documentElement.style.fontSize = "32px"
      if (immediate) {
        send(window, "pointerup", 0, 0)
        expect(dropped).not.toHaveBeenCalled()
      } else {
        await expect.poll(() => document.querySelector('[data-slot="filters-drag-carry"]')).toBeNull()
        send(window, "pointerup", 0, 0)
      }
      assertClean()
      expect(dropped).not.toHaveBeenCalled()
      expect(element('[data-testid="drop-result"]').textContent).toBe("unchanged")
      begin()
      send(window, "pointerup", 0, 0)
      // Complete the browser release sequence so its trailing-click suppressor
      // is consumed by this gesture rather than a later test's real click.
      window.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      expect(dropped).toHaveBeenCalledExactlyOnceWith("source", { parentId: "destination", index: 2, copy })
      await expect.poll(() => element('[data-testid="drop-result"]').textContent).toBe(`source:destination:2:${copy}`)
      assertClean()
      begin()
      flushSync(() => root.render(null))
      send(window, "pointerup", 0, 0)
      expect(dropped).toHaveBeenCalledTimes(1)
      assertClean()
    })
  }

  it("preserves measured fixed-pixel virtual rows across root changes", async () => {
    root.render(<MeasuredVirtualFixture />)
    await expect.poll(() => host.querySelector('[data-testid="measured-spacer"]')).not.toBeNull()
    for (const rem of sizes) {
      document.documentElement.style.fontSize = `${rem}px`
      await expect.poll(() => Number(element('[data-testid="measured-spacer"]').dataset.renderedRem)).toBe(rem)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      await expect.poll(() => parseFloat(element('[data-testid="measured-spacer"]').style.height)).toBe(192)
    }
  })
  it("updates emoji cells and virtual rows together while retaining keyboard selection", async () => {
    const selected = vi.fn()
    root.render(<EmojiPicker data={emojis} columns={8} onEmojiSelect={selected}><EmojiPickerPanel><EmojiPickerList /><EmojiPickerPreview /></EmojiPickerPanel></EmojiPicker>)
    await expect.poll(() => host.querySelectorAll('[data-slot="emoji-picker-emoji"]').length).toBeGreaterThan(0)
    for (const rem of sizes) {
      document.documentElement.style.fontSize = `${rem}px`
      await expect.poll(() => element('[data-slot="emoji-picker-emoji"]').getBoundingClientRect().height).toBeCloseTo(30 * rem / 16, 1)
      close(element('[data-slot="emoji-picker-list"]').getBoundingClientRect().height, 241 * rem / 16)
      const list = element('[data-slot="emoji-picker-list"]')
      selected.mockClear()
      list.focus()
      await userEvent.keyboard("{Home}{ArrowDown}{ArrowRight}{Enter}")
      await expect.poll(() => selected.mock.calls.length).toBeGreaterThan(0)
      list.scrollTop = list.scrollHeight
      list.dispatchEvent(new Event("scroll"))
      await expect.poll(() => host.querySelector('[data-slot="emoji-picker-emoji"][aria-label="Emoji 159"]')).not.toBeNull()
    }
  })

  it("scales automatic emoji columns dynamically", async () => {
    root.render(<div style={{ width: 300 }}><EmojiPicker data={emojis} columns="auto"><EmojiPickerPanel><EmojiPickerList /></EmojiPickerPanel></EmojiPicker></div>)
    await expect.poll(() => host.querySelector('[data-slot="emoji-picker-panel"]')).not.toBeNull()
    for (const rem of sizes) {
      document.documentElement.style.fontSize = `${rem}px`
      await expect.poll(() => Number(element('[data-slot="emoji-picker-panel"]').style.getPropertyValue('--emoji-picker-columns'))).toBe(Math.floor((300 - 6 * rem / 16) / (30 * rem / 16)))
    }
  })

  it("resolves filter gesture distances and copy badge size from the owner root", async () => {
    root.render(<DragFixture />)
    await expect.poll(() => host.querySelector('[data-testid="drag-handle"]')).not.toBeNull()
    const handle = element('[data-testid="drag-handle"]')
    const send = (target: EventTarget, type: string, x: number) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 1, pointerType: "mouse", button: 0, clientX: x, clientY: 20, altKey: true }))
    for (const rem of sizes) {
      document.documentElement.style.fontSize = `${rem}px`
      send(handle, "pointerdown", 20)
      send(window, "pointermove", 20 + 5 * rem / 16 - 1)
      expect(document.querySelector('[data-slot="filters-drag-carry"]')).toBeNull()
      send(window, "pointermove", 20 + 5 * rem / 16 + 1)
      expect(document.querySelector('[data-slot="filters-drag-carry"]')).not.toBeNull()
      close(parseFloat(getComputedStyle(document.querySelector('[data-slot="filters-drag-copy"]')!).fontSize), 0.625 * rem)
      send(window, "pointercancel", 20)
      expect(document.querySelector('[data-slot="filters-drag-carry"]')).toBeNull()
    }
  })

  for (const explicit of [false, true]) {
    it(`keeps ${explicit ? "explicit pixel" : "relative default"} tree indentation`, async () => {
      root.render(<TreeFixture indent={explicit ? 20 : undefined} />)
      await expect.poll(() => host.querySelectorAll('[data-slot="tree-item"]').length).toBe(2)
      for (const rem of sizes) {
        document.documentElement.style.fontSize = `${rem}px`
        close(parseFloat(getComputedStyle(host.querySelectorAll('[data-slot="tree-item"]')[1]).paddingLeft), explicit ? 20 : 1.25 * rem)
      }
    })

    it(`keeps ${explicit ? "explicit pixel" : "relative default"} cascader columns and allows selection`, async () => {
      const change = vi.fn()
      root.render(<Cascader inline mode="columns" items={items.slice(0, 2)} onValueChange={change}><CascaderPanel><CascaderColumns columnWidth={explicit ? 220 : undefined} /></CascaderPanel></Cascader>)
      await expect.poll(() => host.querySelector('[data-slot="cascader-columns"]')).not.toBeNull()
      for (const rem of sizes) {
        document.documentElement.style.fontSize = `${rem}px`
        close(element('[data-slot="cascader-columns"]').firstElementChild!.getBoundingClientRect().width, explicit ? 220 : 13.75 * rem)
        close(parseFloat(getComputedStyle(element('[data-slot="cascader-item"]')).paddingLeft), 0.75 * rem)
      }
      await page.getByRole("option", { name: "Item 1", exact: true }).click()
      expect(change).toHaveBeenCalledWith("item-1", expect.anything())
    })

    it(`updates ${explicit ? "explicit pixel" : "relative default"} virtual estimates and scroll range`, async () => {
      root.render(<VirtualFixture estimateSize={explicit ? 32 : undefined} />)
      await expect.poll(() => host.querySelector('[data-testid="spacer"]')).not.toBeNull()
      for (const rem of sizes) {
        document.documentElement.style.fontSize = `${rem}px`
        await expect.poll(() => parseFloat(element('[data-testid="spacer"]').style.height)).toBeCloseTo(100 * (explicit ? 32 : 2 * rem), 1)
      }
      element('[data-testid="virtual"]').scrollTop = 2000
      await expect.poll(() => host.querySelector('[data-row="0"]')).toBeNull()
    })


    it(`keeps ${explicit ? "explicit pixel" : "relative default"} root virtual estimates and keyboard targets`, async () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({ value: `large-${i}`, label: `Large item ${i}` }))
      const changed = vi.fn()
      root.render(<Cascader inline items={largeItems} virtualize estimateRowSize={explicit ? 32 : undefined} onValueChange={changed}><CascaderPanel><CascaderInput aria-label="Virtual search" /><CascaderList maxHeight={150}><CascaderVirtualItems /></CascaderList></CascaderPanel></Cascader>)
      await expect.poll(() => host.querySelector('[data-slot="cascader-virtual-spacer"]')).not.toBeNull()
      for (const rem of sizes) {
        document.documentElement.style.fontSize = `${rem}px`
        const expected = 1000 * (explicit ? 32 : 2 * rem)
        await expect.poll(() => parseFloat(element('[data-slot="cascader-item"][data-index="0"]').style.insetInlineStart)).toBeCloseTo(0.375 * rem, 1)
        await expect.poll(() => new DOMMatrix(getComputedStyle(element('[data-slot="cascader-item"][data-index="0"]')).transform).m42).toBeCloseTo(0.375 * rem, 1)
        // Mounted rows are measured; the unmounted majority retains the estimate.
        await expect.poll(() => Math.abs(parseFloat(element('[data-slot="cascader-virtual-spacer"]').style.height) - expected)).toBeLessThan(expected * 0.03)
      }
      await page.getByRole("combobox", { name: "Virtual search" }).click()
      await userEvent.keyboard("{End}")
      await expect.poll(() => document.getElementById(element('[data-slot="cascader-input"]').getAttribute('aria-activedescendant') ?? '')?.textContent).toContain("Large item 999")
      await userEvent.keyboard("{Enter}")
      expect(changed).toHaveBeenCalledWith("large-999", expect.anything())
    })

    it(`keeps ${explicit ? "explicit pixel" : "relative default"} cascader popup offsets`, async () => {
      root.render(<Cascader items={items.slice(0, 2)}><CascaderTrigger aria-label="Choose item">Choose item</CascaderTrigger><CascaderContent sideOffset={explicit ? 6 : undefined}><CascaderPanel><CascaderList><CascaderVirtualItems /></CascaderList></CascaderPanel></CascaderContent></Cascader>)
      await page.getByRole("combobox", { name: "Choose item" }).click()
      for (const rem of sizes) {
        document.documentElement.style.fontSize = `${rem}px`
        await expect.poll(() => {
          const popup = document.querySelector<HTMLElement>('[data-slot="cascader-content"]')!
          const trigger = element('[data-slot="cascader-trigger"]')
          return Math.abs(popup.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom - (explicit ? 6 : 0.375 * rem))
        }).toBeLessThan(1)
      }
    })

    it(`keeps ${explicit ? "explicit pixel" : "relative default"} filter picker height cap`, async () => {
      root.render(<Filters fields={items.map(item => ({ id: item.value, label: item.label, type: "text" }))}><FilterFieldPicker path={[]} onPathChange={() => {}} query="" onQueryChange={() => {}} onSelect={() => {}} maxHeight={explicit ? 260 : undefined} /></Filters>)
      await expect.poll(() => host.querySelector('[data-slot="cascader-list"]')).not.toBeNull()
      for (const rem of sizes) {
        document.documentElement.style.fontSize = `${rem}px`
        close(parseFloat(getComputedStyle(element('[data-slot="cascader-list-bounds"]')).maxHeight), explicit ? 260 : 16.25 * rem)
      }
    })
  }
})
