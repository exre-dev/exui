import { memo, type ComponentType } from "react"
import { Preview, PreviewGrid } from "./Preview"
import { useShowcaseLanguage, type ShowcaseLanguage } from "./language"

export interface ExampleEntry {
  readonly id: string
  readonly order: number
  readonly layout: "half" | "full"
  readonly Component: ComponentType
  readonly title?: Readonly<Record<ShowcaseLanguage, string>>
}

export const ExampleGallery = memo(function ExampleGallery({ examples, extensions = [] }: {
  examples: readonly ExampleEntry[]
  extensions?: readonly ExampleEntry[]
}) {
  const { language } = useShowcaseLanguage()
  return <PreviewGrid>
    {examples.map(({ id, layout, Component }) => <Preview key={id} exampleId={id} wide={layout === "full"}><Component /></Preview>)}
    {extensions.map(({ id, layout, Component, title }) => <Preview key={id} shareId={id} kind="exui-extension" title={title?.[language]} wide={layout === "full"}><Component /></Preview>)}
  </PreviewGrid>
})
