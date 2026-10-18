export const locales = ["zh-CN", "en"]

export const preferenceKeys = Object.freeze({
  theme: "exui-docs-theme",
  density: "exui-docs-density",
  language: "exui-docs-language",
})

const segmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const groups = new Set(["getting-started", "components", "exui", "tokens"])

export function normalizeBase(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\?#%]/.test(value)) {
    throw new TypeError("EXUI_DOCS_BASE must be an absolute pathname")
  }
  const parts = value.split("/").filter(Boolean)
  if (parts.some((part) => part === "." || part === ".." || !/^[A-Za-z0-9_-]+$/.test(part))) {
    throw new TypeError("EXUI_DOCS_BASE contains an invalid segment")
  }
  return parts.length ? `/${parts.join("/")}/` : "/"
}

function requireLocale(locale) {
  if (!locales.includes(locale)) throw new TypeError(`Unsupported locale: ${String(locale)}`)
}

function requireId(id) {
  if (typeof id !== "string") throw new TypeError("Document ID must be a string")
  const parts = id.split("/")
  if (parts.length !== 2 || !groups.has(parts[0]) || !segmentPattern.test(parts[1])) {
    throw new TypeError(`Invalid document ID: ${id}`)
  }
  return parts
}

function requireExampleId(id) {
  if (typeof id !== "string" || !segmentPattern.test(id)) throw new TypeError(`Invalid example ID: ${String(id)}`)
}

export function docPath(locale, id, base = "/") {
  requireLocale(locale)
  const parts = requireId(id)
  return `${normalizeBase(base)}${locale}/docs/${parts.join("/")}/`
}

export function overviewPath(locale, base = "/", group) {
  requireLocale(locale)
  if (group !== undefined && group !== "components" && group !== "exui") throw new TypeError(`Invalid overview group: ${String(group)}`)
  return `${normalizeBase(base)}${locale}/docs/${group ? `${group}/` : ""}`
}

export function examplePath(id, base = "/") {
  requireExampleId(id)
  return `${normalizeBase(base)}examples/${id}/`
}

export function searchPath(locale, base = "/") {
  requireLocale(locale)
  return `${normalizeBase(base)}search/${locale}/index.json`
}

export function resolveLegacyHash(hash, locale, catalog, base = "/") {
  requireLocale(locale)
  normalizeBase(base)
  if (typeof hash !== "string" || !hash.startsWith("#")) return null
  const [path, query = ""] = hash.slice(1).split("?", 2)
  if (["", "/", "/components", "/components/"].includes(path)) {
    return overviewPath(locale, base)
  }
  const match = /^\/(components|exui)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path)
  if (!match || !Array.isArray(catalog) || !catalog.some((page) => page.group === match[1] && page.id === match[2])) return null
  const url = docPath(locale, `${match[1]}/${match[2]}`, base)
  const example = new URLSearchParams(query).get("example")
  return example && segmentPattern.test(example) ? `${url}?example=${encodeURIComponent(example)}` : url
}
