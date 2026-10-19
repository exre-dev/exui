import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { pathToFileURL } from "node:url"
import { libraryReload } from "../packages/docs/lib/library-reload.mjs"

const requireDocs = createRequire(new URL("../packages/docs/package.json", import.meta.url))
const updatesPage = message => ["full-reload", "update"].includes(message?.type)

async function waitForUpdate(messages) {
  const deadline = Date.now() + 4_000
  while (!messages.some(updatesPage) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 25))
  assert.ok(messages.some(updatesPage), "expected a Vite page update")
}

test("library output cannot bypass build success, and docs edits keep native updates", async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), "exui-build-barrier-")))
  let server
  try {
    const docs = join(root, "packages/docs")
    const library = join(root, "packages/components/dist")
    await mkdir(join(docs, ".generated"), { recursive: true })
    await mkdir(library, { recursive: true })
    const marker = join(docs, ".generated/library-rebuild")
    const stylesheet = join(library, "library.css")
    const entry = join(docs, "entry.js")
    const stylesheetUrl = "/@fs/" + stylesheet.replaceAll("\\", "/")
    await writeFile(marker, "1")
    await writeFile(stylesheet, ":root { --library: before; }")
    await writeFile(entry, 'import "../components/dist/library.css"; export const docs = "before";')
    const { createServer } = await import(pathToFileURL(requireDocs.resolve("vite")).href)
    server = await createServer({
      root: docs,
      configFile: false,
      logLevel: "silent",
      server: { port: 0, fs: { allow: [root] } },
      plugins: [libraryReload(marker, [library])],
    })
    await server.listen()
    await server.transformRequest("/entry.js")
    assert.match((await server.transformRequest(stylesheetUrl)).code, /before/)
    const messages = []
    const send = server.ws.send.bind(server.ws)
    server.ws.send = (...args) => { messages.push(args[0]); return send(...args) }
    await new Promise(resolve => setTimeout(resolve, 150))
    await writeFile(stylesheet, ":root { --library: after; }")
    await new Promise(resolve => setTimeout(resolve, 250))
    assert.equal(messages.some(updatesPage), false, "partial or failed output must not update the page")
    assert.match((await server.transformRequest(stylesheetUrl)).code, /before/)
    await writeFile(marker, "2")
    await waitForUpdate(messages)
    assert.ok(messages.some(message => message?.type === "full-reload"))
    assert.match((await server.transformRequest(stylesheetUrl)).code, /after/)
    messages.length = 0
    await server.transformRequest("/entry.js")
    await writeFile(entry, 'import "../components/dist/library.css"; export const docs = "after";')
    await waitForUpdate(messages)
  } finally {
    await server?.close()
    await rm(root, { recursive: true, force: true })
  }
})
