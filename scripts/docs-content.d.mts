export type Locale = "zh-CN" | "en"
export type Group = "getting-started" | "components" | "exui" | "tokens"
export type DocPage = {
  id: string
  locale: Locale
  group: Group
  title: string
  description: string
  slug: string[]
  contentPath: string
  exampleFamily?: string
  full: boolean
}
export declare function loadPages(root?: string): Promise<DocPage[]>
export declare function writeContentManifest(root?: string): Promise<string>
