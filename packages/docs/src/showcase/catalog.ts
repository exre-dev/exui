export type PageModule = "actions" | "inputs" | "content" | "advanced-controls" | "data-workflows" | "exui"
export type CatalogPage = { id: string; name: string; group: "components" | "exui"; module: PageModule }

const families: { module: PageModule; ids: string[] }[] = [
  { module: "actions", ids: ["button", "button-group", "toggle", "toggle-group", "dropdown-menu", "context-menu", "menubar", "command", "accordion", "collapsible", "dialog", "alert-dialog", "sheet", "drawer", "popover", "hover-card", "tooltip", "tabs", "breadcrumb", "navigation-menu", "pagination", "sidebar", "resizable", "scroll-area", "separator"] },
  { module: "inputs", ids: ["input", "textarea", "input-group", "input-otp", "label", "field", "select", "native-select", "combobox", "checkbox", "radio-group", "switch", "slider", "calendar", "questionnaire"] },
  { module: "advanced-controls", ids: ["autocomplete", "cascader", "number-field", "phone-input", "date-selector", "time-picker", "color-picker", "emoji-picker", "rating", "signature-pad", "stepper"] },
  { module: "content", ids: ["card", "avatar", "table", "chart", "carousel", "aspect-ratio", "item", "attachment", "bubble", "message", "message-scroller", "trace", "kbd", "marker", "empty", "progress", "skeleton", "spinner", "sonner"] },
  { module: "advanced-controls", ids: ["badge", "alert", "code-block", "file-type", "icon-tile", "icon-stack", "frame", "timeline", "scrollspy"] },
  { module: "data-workflows", ids: ["data-grid", "filters", "tree", "sortable", "kanban", "event-calendar", "gantt"] },
  { module: "exui", ids: ["glass", "form"] },
]

const names: Record<string, string> = {
  "input-otp": "Input OTP", kbd: "Kbd", scrollspy: "Scrollspy",
}

export const catalogPages: CatalogPage[] = families.flatMap(({ module, ids }) => ids.map((id) => ({
  id,
  name: names[id] ?? id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "),
  group: module === "exui" ? "exui" : "components",
  module,
})))

export const overviewPage = { id: "overview", name: "Components", group: "overview" } as const
export type ShowcasePage = CatalogPage | typeof overviewPage

export function pageHref(page: ShowcasePage) {
  return page.group === "overview" ? "#/components/" : `#/${page.group}/${page.id}`
}

export function resolvePage(hash: string): ShowcasePage {
  const path = hash.split("?")[0]
  if (["", "#", "#/", "#/components", "#/components/"].includes(path)) return overviewPage
  return catalogPages.find((page) => pageHref(page) === path) ?? catalogPages[0]
}

export function resolveExample(hash: string) {
  const id = new URLSearchParams(hash.split("?")[1]).get("example")
  return id && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ? id : undefined
}
