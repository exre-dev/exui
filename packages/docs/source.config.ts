import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { docsFrontmatterSchema } from "./lib/content-schema"

export const zhDocs = defineDocs({
  dir: "content/zh-CN",
  docs: { schema: docsFrontmatterSchema },
})

export const enDocs = defineDocs({
  dir: "content/en",
  docs: { schema: docsFrontmatterSchema },
})

export default defineConfig()
