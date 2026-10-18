import type { Plugin } from "vite"
import { createExampleSourceJson, createSourceDocument, findRepositoryRoot, loadShareExamples } from "../../../scripts/docs-sharing.mjs"

export function exampleSources(): Plugin {
  return {
    name: "exui-docs-example-sources",
    apply: "serve",
    configureServer(server) {
      const { base, root } = server.config
      const repository = findRepositoryRoot(root)
      server.middlewares.use(async (request, response, next) => {
        if (request.method !== "GET" && request.method !== "HEAD") return next()
        const pathname = new URL(request.url ?? "/", "http://docs.local").pathname
        if (!pathname.startsWith(base)) return next()
        const match = /^examples\/([a-z0-9]+(?:-[a-z0-9]+)*)\/source\.(json|md)$/.exec(pathname.slice(base.length))
        if (!match) return next()
        try {
          const example = (await loadShareExamples(repository)).find(example => example.id === match[1])
          response.setHeader("Cache-Control", "no-cache")
          if (!example) {
            response.statusCode = 404
            response.setHeader("Content-Type", "text/plain; charset=utf-8")
            response.end("Unknown example")
            return
          }
          const document = createSourceDocument(repository, example, base)
          const json = match[2] === "json"
          const body = json ? JSON.stringify(await createExampleSourceJson(repository, example, document)) + "\n" : document.markdown
          response.setHeader("Content-Type", `${json ? "application/json" : "text/markdown"}; charset=utf-8`)
          response.end(request.method === "HEAD" ? undefined : body)
        } catch (error) { next(error) }
      })
    },
  }
}
