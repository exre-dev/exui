import { lazy, type ComponentType } from "react"
import { catalogPages } from "./catalog"
import { componentLoaders } from "./component-loaders.generated"

type PageLoader = () => Promise<{ default: ComponentType }>
const components: Readonly<Record<string, PageLoader>> = componentLoaders

export const pageComponents = new Map(catalogPages.map((page) => [page.id, lazy(async () => {
  if (page.group === "exui") {
    const { pages } = await import("./pages/exui")
    const component = pages[page.id]
    if (!component) throw new Error(`Missing preview: ${page.id}`)
    return { default: component }
  }
  const loader = components[page.id]
  if (!loader) throw new Error(`Missing preview loader: ${page.id}`)
  const loaded = await loader()
  if (!loaded.default) throw new Error(`Missing preview: ${page.id}`)
  return loaded
})]))
