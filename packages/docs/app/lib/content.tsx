import collections from "../../.source/browser"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { DocsBody } from "fumadocs-ui/layouts/glass/page"

const options = {
  component({ default: MDX }: { default: React.ComponentType<{ components?: typeof defaultMdxComponents }> }) {
    return <DocsBody><MDX components={defaultMdxComponents} /></DocsBody>
  },
}
const loaders = {
  "zh-CN": collections.zhDocs.createClientLoader(options),
  en: collections.enDocs.createClientLoader(options),
}

export function DocumentBody({ locale, path }: { locale: "zh-CN" | "en"; path: string }) {
  return loaders[locale].useContent(path)
}
