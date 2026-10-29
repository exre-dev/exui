import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = fileURLToPath(new URL("..", import.meta.url))
const source = path.resolve(packageRoot, "../icons/dist")
const target = path.join(packageRoot, "dist/icons")
const entries = await readdir(path.join(source, "glass-icons"))
for (const required of ["index.js", "index.d.ts", "camera.svg", "camera.svg.d.ts"]) {
  if (!entries.includes(required)) throw new Error(`Missing built icon artifact: ${required}`)
}
const manifest = JSON.parse(await readFile(path.resolve(source, "../package.json"), "utf8"))
if (manifest.name !== "@exre/exui-icons" || manifest.private !== true) {
  throw new Error("Icons must remain a private workspace")
}
// This destination is owned solely by the public icon artifacts. Replace it
// after Vite clears dist, so removed icons cannot survive the next tarball.
if (path.relative(packageRoot, target) !== path.join("dist", "icons")) throw new Error("Invalid icons output path")
await rm(target, { recursive: true, force: true })
await mkdir(path.dirname(target), { recursive: true })
await cp(source, target, { recursive: true })
console.log(`Copied ${entries.filter((name) => name.endsWith(".svg")).length} glass SVGs and React modules into dist/icons`)
