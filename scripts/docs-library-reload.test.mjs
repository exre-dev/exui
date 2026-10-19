import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { pathToFileURL } from "node:url"
import { libraryReload } from "../packages/docs/lib/library-reload.mjs"

const requireDocs = createRequire(new URL("../packages/docs/package.json", import.meta.url))

test("completed library builds evict stale Vite transforms before requesting a page reload", async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), "exui-library-reload-")))
  let server
  try {
    const marker = join(root, "library-rebuild")
    const stylesheet = join(root, "library.css")
    await writeFile(marker, "1")
    await writeFile(stylesheet, ":root { --library: before; }")
    const { createServer } = await import(pathToFileURL(requireDocs.resolve("vite")).href)
    server = await createServer({
      root,
      configFile: false,
      logLevel: "silent",
      server: { port: 0, watch: { ignored: ["**/library.css"] } },
      plugins: [libraryReload(marker)],
    })
    await server.listen()
    assert.match((await server.transformRequest("/library.css")).code, /before/)
    await writeFile(stylesheet, ":root { --library: after; }")
    assert.match((await server.transformRequest("/library.css")).code, /before/, "fixture must reproduce a cached library stylesheet")
    const sent = []
    const send = server.ws.send.bind(server.ws)
    server.ws.send = (...args) => { sent.push(args[0]); return send(...args) }
    await new Promise(resolve => setTimeout(resolve, 100))
    await writeFile(marker, "2")
    const deadline = Date.now() + 4_000
    while (!sent.some(message => message?.type === "full-reload") && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 25))
    }
    assert.ok(sent.some(message => message?.type === "full-reload"), "completed library build must request a full reload")
    assert.match((await server.transformRequest("/library.css")).code, /after/)
    assert.equal(await readFile(marker, "utf8"), "2")
  } finally {
    await server?.close()
    await rm(root, { recursive: true, force: true })
  }
})
