import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { docsFrontmatterSchema } from "./lib/content-schema"
import { remarkContentLinks } from "./lib/content-links.mjs"
import { normalizeBase } from "./lib/site-contract.mjs"

export const zhDocs = defineDocs({
  dir: "content/zh-CN",
  docs: { schema: docsFrontmatterSchema },
})

export const enDocs = defineDocs({
  dir: "content/en",
  docs: { schema: docsFrontmatterSchema },
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkContentLinks, { base: normalizeBase(process.env.EXUI_DOCS_BASE ?? "/") }]],
  },
})
