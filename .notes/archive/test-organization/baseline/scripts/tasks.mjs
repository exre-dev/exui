import { spawn as nodeSpawn } from "node:child_process"
import { fileURLToPath, pathToFileURL } from "node:url"
import path from "node:path"

const root = fileURLToPath(new URL("../", import.meta.url))
const usage = "Usage: node scripts/tasks.mjs <build|typecheck|check|test|verify> [test-files...]"
const nodeTests = [
  "scripts/**/*.test.mjs",
  "packages/components/scripts/**/*.test.mjs",
  "packages/tokens/scripts/**/*.test.mjs",
]

export async function runTasks(mode, files = [], { env = process.env, spawn = nodeSpawn, log = console.log } = {}) {
  if (!["build", "typecheck", "check", "test", "verify"].includes(mode) || (mode !== "test" && files.length)) throw new Error(usage)
  const pnpmPath = env.npm_execpath
  if (!pnpmPath) throw new Error("Run through pnpm, or set npm_execpath to the pnpm JavaScript CLI entry.")

  async function stage(label, args, overrides = {}) {
    log(`[tasks] ${label}`)
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, args, { cwd: root, env: { ...env, ...overrides }, stdio: "inherit", shell: false })
      child.once("error", (error) => reject(new Error(`${label}: ${error.message}`, { cause: error })))
      child.once("close", (code, signal) => {
        if (code === 0) resolve()
        else reject(new Error(`${label} exited with ${signal ?? code}`))
      })
    })
  }
  const pnpm = (label, args, overrides) => stage(label, [pnpmPath, ...args], overrides)
  const workspace = (label, name, command, overrides) => pnpm(label, ["--filter", name, command], overrides)
  const node = (label, ...args) => stage(label, args)

  async function prepareTokens() {
    // Both emitting compilers also typecheck. The check must precede any build
    // that regenerates tracked CSS, so drift remains a failure instead of a fix.
    await workspace("Token ESM and declarations", "@exre/exui-tokens", "build:js")
    await workspace("Token CommonJS and declarations", "@exre/exui-tokens", "build:cjs")
    await workspace("Token parity, CSS drift and policies", "@exre/exui-tokens", "check:built")
  }

  async function prepareTypes() {
    await workspace("Component types", "@exre/exui", "typecheck")
    await node("Public Token entries", "packages/components/scripts/copy-tokens-dist.mjs")
    await workspace("Public component declarations", "@exre/exui", "build:types")
    await workspace("Docs types", "@exre/exui-docs", "typecheck")
  }

  async function sourceChecks() {
    for (const [label, script] of [
      ["Component source locks and adapters", "reui-sync.mjs"],
      ["Component public exports", "reui-exports.mjs"],
      ["Foundation patches", "reui-foundation-diff.mjs"],
      ["Luma recipes", "generate-reui-luma.mjs"],
    ]) await node(label, `scripts/${script}`, "--check")
  }

  async function consistencyChecks() {
    await node("Docs content", "scripts/docs-content.mjs", "check")
    await node("Docs example coverage", "scripts/docs-examples.mjs", "check")
    await node("Docs example assets", "scripts/docs-example-assets.mjs")
    await node("Docs capabilities", "scripts/exui-capabilities.mjs", "--check")
    await node("Skill source references", "scripts/exui-skill/sync-references.mjs", "--check")
    await node("Skill inventories", "scripts/exui-skill/update-inventories.mjs", "--check")
    await node("Skill links and structure", "scripts/exui-skill/verify.mjs")
  }

  async function docsOutput(base) {
    await node(`Docs static output (${base})`, "scripts/verify-docs-static.mjs", "packages/docs/build/client", base)
    await node(`Docs sharing (${base})`, "scripts/verify-docs-sharing.mjs", "packages/docs/build/client", base)
  }

  if (mode === "build") {
    await workspace("Build Tokens", "@exre/exui-tokens", "build")
    await workspace("Build components", "@exre/exui", "build")
    await workspace("Build docs", "@exre/exui-docs", "build")
    return
  }

  if (mode === "check" || mode === "verify") await sourceChecks()
  await prepareTokens()
  if (mode === "typecheck" || mode === "check") {
    await prepareTypes()
    if (mode === "check") {
      await node("Token behavior regressions", "--test", "packages/tokens/scripts/**/*.test.mjs")
      await pnpm("Lint workspaces and tooling", ["lint"])
      await consistencyChecks()
    }
    return
  }

  // Node SSR regressions, skill examples and browser consumers all import the
  // built public package. Prepare it once even for focused test invocations.
  await workspace("Build components", "@exre/exui", "build")
  if (mode === "test") {
    await node("Node regressions", "--test", ...(files.length ? files : nodeTests))
    return
  }

  await pnpm("Lint workspaces and tooling", ["lint"])
  await consistencyChecks()
  // Component/docs builds include their typechecks; declarations are already
  // emitted by the component build, so verify never reruns those prerequisites.
  await workspace("Build docs (/)", "@exre/exui-docs", "build", { EXUI_DOCS_BASE: "/" })
  await node("Node regressions", "--test", ...nodeTests)
  await node("Docs public snippets", "scripts/docs-snippets.mjs")
  await node("Docs example production styles and Chromium", "scripts/docs-example-styles.mjs")
  await node("Skill examples", "scripts/exui-skill/verify-examples.mjs")
  await pnpm("Visual Chromium suite", ["test:visual"])
  await node("Packed consumers", "scripts/verify-packages.mjs")
  await node("Release configuration", "scripts/release-bootstrap/verify.mjs", "--root", ".")
  await pnpm("Whitespace check", ["exec", "git", "diff", "--check"])
  await docsOutput("/")
  // Keep the final verified output at the Pages prefix. These three stages
  // must remain consecutive because both builds replace the same directory.
  await workspace("Build docs (/exui/)", "@exre/exui-docs", "build", { EXUI_DOCS_BASE: "/exui/" })
  await docsOutput("/exui/")
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  runTasks(process.argv[2], process.argv.slice(3)).catch((error) => {
    console.error(`[tasks] ${error.message}`)
    process.exitCode = 1
  })
}
