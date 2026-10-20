import tailwindcss from "@tailwindcss/vite"
import { reactRouter } from "@react-router/dev/vite"
import { fumadocsMdx } from "fumadocs-mdx/vite"
import { defineConfig, type Plugin } from "vite"
import { exampleDependencies } from "./example-dependencies"
import { normalizeBase } from "./lib/site-contract.mjs"
import { exampleAssetBase } from "./lib/example-assets"
import { exampleSources } from "./lib/example-sources"
import { libraryReload } from "./lib/library-reload.mjs"
import { writeContentManifest } from "../../scripts/docs-content.mjs"

function contentManifest(): Plugin {
  return {
    name: "exui-docs-content",
    async buildStart() { await writeContentManifest() },
    configureServer(server) {
      let queue = Promise.resolve()
      server.watcher.on("all", (event, filename) => {
        if (!["add", "unlink", "change"].includes(event) || !/[\\/]content[\\/].*\.mdx$/.test(filename)) return
        queue = queue.then(async () => {
          await writeContentManifest()
          if (event !== "change") server.ws.send({ type: "full-reload" })
        }).catch(error => server.config.logger.error(String(error)))
      })
    },
  }
}

export default defineConfig({
  base: normalizeBase(process.env.EXUI_DOCS_BASE ?? "/"),
  server: { watch: { ignored: ["**/build/**"] } },
  plugins: [libraryReload(), exampleSources(), exampleAssetBase(), contentManifest(), ...fumadocsMdx({ macro: false }), tailwindcss(), reactRouter()],
  resolve: { dedupe: ["react", "react-dom"] },
  optimizeDeps: { include: exampleDependencies },
})
