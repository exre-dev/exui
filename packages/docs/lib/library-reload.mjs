import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const docsRoot = fileURLToPath(new URL("../", import.meta.url))

export function libraryReload(
  marker = resolve(docsRoot, ".generated/library-rebuild"),
  libraryOutputs = [resolve(docsRoot, "../components/dist"), resolve(docsRoot, "../tokens/dist")],
) {
  marker = resolve(marker)
  return {
    name: "exui-library-reload",
    apply: "serve",
    config() {
      // Exclude half-written library output from Vite's native HMR channel.
      return { server: { watch: { ignored: libraryOutputs.map(output => resolve(output).replaceAll("\\", "/") + "/**") } } }
    },
    configureServer(server) {
      server.watcher.add(marker)
      const reload = (event, filename) => {
        if (!["add", "change"].includes(event) || resolve(filename) !== marker) return
        // A full reload alone still serves cached CSS/JS transforms from the old build.
        server.moduleGraph.invalidateAll()
        server.ws.send({ type: "full-reload" })
      }
      server.watcher.on("all", reload)
      server.httpServer?.once("close", () => server.watcher.off("all", reload))
    },
  }
}
