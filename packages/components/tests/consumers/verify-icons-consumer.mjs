import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { realpathSync } from "node:fs"
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { runCommand } from "../../../../scripts/run-command.mjs"
import { assertPublishableManifest } from "../../../../scripts/package-contract.mjs"

const repositoryRoot = fileURLToPath(new URL("../../../..", import.meta.url))
const requireDocs = createRequire(new URL("../../../docs/package.json", import.meta.url))
// Vite loads a native Rolldown module on Windows. Keep it in a child process,
// which must exit before the controller removes the installed fixture tree.
if (process.argv[2] !== "--worker") {
  const directory = realpathSync.native(await mkdtemp(path.join(tmpdir(), "exui-glass-consumer-")))
  let code
  try {
    code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [fileURLToPath(import.meta.url), "--worker", directory, ...process.argv.slice(2)], { cwd: repositoryRoot, stdio: "inherit" })
      child.once("error", reject)
      child.once("close", (status) => resolve(status ?? 1))
    })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
  process.exit(code)
}
const temporary = process.argv[3]
const run = (command, args, cwd = temporary) => runCommand(command, args, cwd).stdout.trim()
const names = (await readdir(path.join(repositoryRoot, "packages/icons/glass-icons")))
  .filter((name) => name.endsWith(".svg")).sort()
let browser
let server

try {
  let tarball = process.argv[4]
  if (!tarball) {
    const packed = JSON.parse(run("pnpm", ["pack", "--json", "--pack-destination", temporary], path.join(repositoryRoot, "packages/components")))
    tarball = packed.filename
  }
  tarball = path.resolve(tarball)
  await writeFile(path.join(temporary, "package.json"), JSON.stringify({
    name: "exui-glass-icons-consumer", private: true, type: "module",
    dependencies: { "@exre/exui": `file:${tarball.replaceAll("\\", "/")}`, react: "19.2.7", "react-dom": "19.2.7" },
    devDependencies: { "@types/react": "^19.2.17", "@types/react-dom": "^19.2.3", typescript: "~6.0.2", vite: "^8.1.1" },
  }, null, 2))
  console.log("[icons] Installing isolated packed consumer")
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"])
  assertPublishableManifest(JSON.parse(await readFile(path.join(temporary, "node_modules/@exre/exui/package.json"), "utf8")))
  const requireConsumer = createRequire(path.join(temporary, "package.json"))
  assert.throws(() => requireConsumer.resolve("@exre/exui-icons"), /Cannot find module/,
    "the private icons workspace must not be installed")
  await writeFile(path.join(temporary, "tsconfig.json"), JSON.stringify({
    compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: false, noEmit: true, lib: ["ES2022", "DOM"], types: ["react", "react-dom"] },
    include: ["src"],
  }))
  await mkdir(path.join(temporary, "src"))
  const assets = names.map((name, index) => `import asset${index} from "@exre/exui/icons/glass-icons/${name}"`).join("\n")
  const records = names.map((name, index) => {
    const symbol = name.replace(/\.svg$/, "").split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("") + "Icon"
    return `{ name: ${JSON.stringify(name)}, Component: Icons.${symbol}, url: asset${index} }`
  }).join(",\n")
  await writeFile(path.join(temporary, "src/app.tsx"), `
import * as Icons from "@exre/exui/icons/glass-icons"
import type { GlassIconProps } from "@exre/exui/icons/glass-icons"
import { createRef } from "react"
${assets}
export const cameraRef = createRef<SVGSVGElement>()
const props: GlassIconProps = { size: "8rem", ref: cameraRef }
const records = [${records}]
export function App() {
  return <main>
    <section id="sizing"><Icons.CameraIcon {...props} data-testid="default" title="Camera" /><Icons.CameraIcon size={64} data-testid="pixels" /><Icons.CameraIcon size="3rem" width="2rem" data-testid="explicit" /></section>
    <section id="gallery" style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:16}}>{records.map(({name, Component, url}) => <article key={name} data-name={name} style={{background:"#18202d",padding:8}}><span style={{color:"white"}}>{name}</span><Component data-testid="inline" /><img data-testid="asset" src={url} width={128} height={128} alt={name} /></article>)}</section>
  </main>
}
`)
  await writeFile(path.join(temporary, "src/main.tsx"), `import {hydrateRoot} from "react-dom/client";import {App,cameraRef} from "./app";Object.assign(window,{glassIconRef:cameraRef});hydrateRoot(document.getElementById("root")!,<App/>);`)
  await writeFile(path.join(temporary, "src/single.tsx"), `import {createRoot} from "react-dom/client";import {CameraIcon} from "@exre/exui/icons/glass-icons";createRoot(document.getElementById("root")!).render(<CameraIcon title="Camera"/>);`)
  await writeFile(path.join(temporary, "index.html"), '<!doctype html><html style="font-size:16px"><body><div id="root"><!--ssr--></div><script type="module" src="/src/main.tsx"></script></body></html>')
  await writeFile(path.join(temporary, "single.html"), '<!doctype html><div id="root"></div><script type="module" src="/src/single.tsx"></script>')
  console.log("[icons] Strict types, tree-shaking and SSR")
  run(process.execPath, [requireConsumer.resolve("typescript/bin/tsc"), "-p", "tsconfig.json"])
  const { build, preview } = await import(pathToFileURL(requireConsumer.resolve("vite")).href)
  await build({ root: temporary, configFile: false, logLevel: "error", build: { outDir: "dist-single", rolldownOptions: { input: path.join(temporary, "single.html") } } })
  const singleFiles = await readdir(path.join(temporary, "dist-single/assets"))
  const singleCode = (await Promise.all(singleFiles.filter((name) => name.endsWith(".js")).map((name) => readFile(path.join(temporary, "dist-single/assets", name), "utf8")))).join("\n")
  const cameraSource = await readFile(path.join(repositoryRoot, "packages/icons/glass-icons/camera.svg"), "utf8")
  const walletSource = await readFile(path.join(repositoryRoot, "packages/icons/glass-icons/wallet.svg"), "utf8")
  const cameraGeometry = /\bd="([^"]+)"/.exec(cameraSource)[1].slice(0, 50)
  const walletGeometry = /\bd="([^"]+)"/.exec(walletSource)[1].slice(0, 50)
  assert.ok(singleCode.includes(cameraGeometry), "the used icon must be in the production bundle")
  assert.ok(!singleCode.includes(walletGeometry), "unused icon artwork must tree-shake")
  assert.ok(!singleFiles.some((name) => name.endsWith(".css")), "icons must not pull ExUI CSS")
  await build({ root: temporary, configFile: false, logLevel: "error", build: { ssr: "src/app.tsx", outDir: "dist-ssr" } })
  const React = requireConsumer("react")
  const { renderToString } = requireConsumer("react-dom/server")
  const { App } = await import(pathToFileURL(path.join(temporary, "dist-ssr/app.js")).href)
  const markup = renderToString(React.createElement(App))
  assert.match(markup, /width="8rem"/)
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length, "SSR icon IDs must be unique across the gallery and repeats")
  const html = await readFile(path.join(temporary, "index.html"), "utf8")
  await writeFile(path.join(temporary, "index.html"), html.replace("<!--ssr-->", markup))
  await build({ root: temporary, configFile: false, logLevel: "error", build: { outDir: "dist" } })
  server = await preview({ root: temporary, configFile: false, logLevel: "error", preview: { host: "127.0.0.1", port: 0 } })
  const { chromium } = requireDocs("playwright")
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()) })
  await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" })
  await page.getByTestId("default").waitFor()
  await page.waitForFunction(() => window.glassIconRef?.current === document.querySelector('[data-testid="default"]'))
  const initialId = await page.getByTestId("default").locator("[id]").first().getAttribute("id")
  for (const [root, expected] of [[16, 128], [32, 256]]) {
    await page.evaluate((size) => { document.documentElement.style.fontSize = `${size}px` }, root)
    assert.equal(await page.getByTestId("default").evaluate((svg) => svg.getBoundingClientRect().width), expected)
    assert.equal(await page.getByTestId("pixels").evaluate((svg) => svg.getBoundingClientRect().width), 64)
    assert.equal(await page.getByTestId("explicit").evaluate((svg) => svg.getBoundingClientRect().width), root * 2)
    assert.equal(await page.getByTestId("default").locator("[id]").first().getAttribute("id"), initialId,
      "a root-font change must not replace icon instance identities")
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = "16px" })
  const results = await page.evaluate(async () => {
    const allIds = [...document.querySelectorAll("[id]")].map((element) => element.id)
    if (new Set(allIds).size !== allIds.length) throw new Error("duplicate hydrated IDs")
    const results = []
    const rasterize = async (source) => {
      const image = new Image()
      image.src = source
      await image.decode()
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 128
      const context = canvas.getContext("2d")
      context.drawImage(image, 0, 0, 128, 128)
      return context.getImageData(0, 0, 128, 128).data
    }
    for (const article of document.querySelectorAll("article[data-name]")) {
      const svg = article.querySelector("svg")
      const localIds = new Set([...svg.querySelectorAll("[id]")].map((element) => element.id))
      const xml = new XMLSerializer().serializeToString(svg)
      for (const [, urlRef, hrefRef] of xml.matchAll(/(?:url\(#([^)]*)\)|(?:href|xlink:href)="#([^"]+)")/g)) {
        if (!localIds.has(urlRef || hrefRef)) throw new Error(`${article.dataset.name}: reference escapes its instance`)
      }
      // Serialize at the asset's natural dimensions; rem has a different base
      // in an SVG image document than in its hosting page.
      const copy = svg.cloneNode(true)
      copy.setAttribute("width", "128")
      copy.setAttribute("height", "128")
      const inline = await rasterize("data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(copy)))
      const asset = await rasterize(article.querySelector("img").src)
      let error = 0, painted = 0
      for (let index = 0; index < asset.length; index++) error += Math.abs(asset[index] - inline[index])
      for (let index = 3; index < asset.length; index += 4) painted += asset[index]
      if (painted === 0) throw new Error(`${article.dataset.name}: empty artwork`)
      if (asset[3] > 5) throw new Error(`${article.dataset.name}: opaque canvas background`)
      const meanError = error / asset.length
      if (meanError > 0.5) throw new Error(`${article.dataset.name}: SVG/React pixel error ${meanError}`)
      results.push({ name: article.dataset.name, meanError, cornerAlpha: asset[3] })
    }
    return results
  })
  assert.equal(results.length, 50)
  assert.deepEqual(errors, [], "packed production icons must hydrate without errors")
  const output = path.join(repositoryRoot, "output/playwright")
  await mkdir(output, { recursive: true })
  await page.screenshot({ path: path.join(output, "glass-icons.png"), fullPage: true })
  console.log(`[icons] Passed: ${results.length} SVG/React pairs, transparent backgrounds, isolated IDs, SSR/hydration, 8rem scaling, strict types and tree-shaking`)
} finally {
  await browser?.close()
  if (server) await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()))
}
