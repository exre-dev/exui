import * as React from "react"
import { DateSelector as PublicDateSelector } from "@exre/exui"

/** Associate the two public filter controls with their actual shared date content. */
export function bindDateSelectorTabs(host: HTMLElement, panelId: string) {
  let active = true
  const owned = new Map<HTMLElement, Map<string, { previous: string | null; assigned: string }>>()
  function restore(element: HTMLElement) {
    for (const [name, value] of owned.get(element) ?? []) {
      if (element.getAttribute(name) !== value.assigned) continue
      if (value.previous === null) element.removeAttribute(name)
      else element.setAttribute(name, value.previous)
    }
    owned.delete(element)
  }
  function assign(element: HTMLElement, name: string, value: string) {
    const current = element.getAttribute(name)
    if (current === value) return
    let attributes = owned.get(element)
    if (!attributes) { attributes = new Map(); owned.set(element, attributes) }
    if (!attributes.has(name)) attributes.set(name, { previous: current, assigned: value })
    const state = attributes.get(name)!
    if (current !== state.assigned) state.previous = current
    state.assigned = value
    element.setAttribute(name, value)
  }
  function sync() {
    if (!active) return
    const root = host.firstElementChild
    // The public DateSelector's final div contains either the real Calendar or
    // the period ScrollArea/grid. It is shared by both internal Tabs controls.
    const panel = root?.lastElementChild
    const tabs = root ? Array.from(root.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"][role="tab"]')) : []
    const selectedIds = tabs.filter(tab => tab.getAttribute("aria-selected") === "true").map(tab => tab.id).filter(Boolean)
    const targets = panel instanceof HTMLElement && panel.tagName === "DIV" && selectedIds.length > 0 ? new Set<HTMLElement>([panel, ...tabs]) : new Set<HTMLElement>()
    for (const element of owned.keys()) if (!targets.has(element)) restore(element)
    if (!(panel instanceof HTMLElement) || !targets.has(panel)) return
    assign(panel, "id", panelId)
    assign(panel, "role", "tabpanel")
    assign(panel, "aria-labelledby", selectedIds.join(" "))
    // Every option changes this same real panel, so inactive triggers also get
    // a valid target rather than retaining Radix's nonexistent TabsContent IDs.
    for (const tab of tabs) assign(tab, "aria-controls", panelId)
  }
  sync()
  const observer = new MutationObserver(sync)
  observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] })
  return () => {
    active = false
    observer.disconnect()
    for (const element of owned.keys()) restore(element)
  }
}

export function ExampleDateSelector(props: React.ComponentProps<typeof PublicDateSelector>) {
  const host = React.useRef<HTMLDivElement>(null)
  const panelId = React.useId() + "-date-selector-panel"
  React.useLayoutEffect(() => {
    if (host.current) return bindDateSelectorTabs(host.current, panelId)
  }, [panelId])
  return <div ref={host} style={{ display: "contents" }} data-example-date-selector-panel={panelId}><PublicDateSelector {...props} /></div>
}
