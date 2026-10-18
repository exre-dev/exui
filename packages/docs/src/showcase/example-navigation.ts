import { createContext } from "react"
import type { CatalogPage } from "./catalog"

export const ExampleNavigationContext = createContext<{
  page: CatalogPage
  target?: string
  docsMode?: boolean
  density?: "standard" | "compact"
} | null>(null)

export function examplePath(id: string) {
  return `${import.meta.env.BASE_URL}examples/${encodeURIComponent(id)}/`
}
