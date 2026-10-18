import { normalizeBase } from "../../lib/site-contract.mjs"

export const base = normalizeBase(import.meta.env.BASE_URL)

// Fumadocs content URLs are public URLs; Router adds its basename to app paths.
export function appPath(href: string) {
  return base !== "/" && href.startsWith(base) ? `/${href.slice(base.length)}` : href
}
