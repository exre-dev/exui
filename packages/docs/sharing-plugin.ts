import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import type { Plugin, ResolvedConfig } from "vite"
import { createSourceDocument, loadShareExamples, renderShareHtml } from "../../scripts/docs-sharing.mjs"

export function showcaseSharing(): Plugin {
  let config: ResolvedConfig
  return {
    name: "exui-showcase-sharing",
    configResolved(value) {
      config = value
      if (!config.base.startsWith("/") || config.base.startsWith("//")) throw new Error("Showcase sharing requires an absolute pathname base, such as / or /exui/")
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestPath = new URL(request.url ?? "/", "http://showcase.local").pathname
        const pathname = config.base !== "/" && requestPath.startsWith(config.base) ? `/${requestPath.slice(config.base.length)}` : requestPath
        const match = /^(?:\/examples\/)([a-z0-9]+(?:-[a-z0-9]+)*)(\/|\/index\.html|\/source\.md)?$/.exec(pathname)
        if (!match) return next()
        try {
          const root = path.resolve(config.root, "../..")
          const example = (await loadShareExamples(root)).find(example => example.id === match[1])
          if (!example) { response.statusCode = 404; response.end("Unknown Showcase example"); return }
          if (!match[2]) { response.statusCode = 302; response.setHeader("Location", `${config.base}examples/${example.id}/`); response.end(); return }
          const { markdown } = createSourceDocument(root, example, config.base)
          response.setHeader("Cache-Control", "no-cache")
          if (match[2] === "/source.md") { response.setHeader("Content-Type", "text/markdown; charset=utf-8"); response.end(markdown); return }
          const template = await server.transformIndexHtml(config.base, readFileSync(path.join(config.root, "index.html"), "utf8"))
          response.setHeader("Content-Type", "text/html; charset=utf-8")
          response.end(renderShareHtml(template, example, markdown, config.base))
        } catch (error) { next(error) }
      })
    },
    async writeBundle() {
      const root = path.resolve(config.root, "../..")
      const output = path.resolve(config.root, config.build.outDir)
      const template = readFileSync(path.join(output, "index.html"), "utf8")
      const examples = await loadShareExamples(root)
      for (const example of examples) {
        const { markdown } = createSourceDocument(root, example, config.base)
        const directory = path.join(output, "examples", example.id)
        mkdirSync(directory, { recursive: true })
        writeFileSync(path.join(directory, "source.md"), markdown)
        writeFileSync(path.join(directory, "index.html"), renderShareHtml(template, example, markdown, config.base))
      }
      config.logger.info(`Generated ${examples.length} readable Showcase example pages and source documents.`)
    },
  }
}
