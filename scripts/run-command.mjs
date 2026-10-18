import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"

export function runCommand(command, args, cwd, { allowFailure = false } = {}) {
  // Windows .cmd shims need a shell. Invoke npm/Corepack with Node instead
  // so spaces, quotes and shell metacharacters remain literal arguments.
  const nodeModules = join(dirname(process.execPath), "node_modules")
  const cli = process.platform === "win32"
    ? { npm: join(nodeModules, "npm/bin/npm-cli.js"), pnpm: join(nodeModules, "corepack/dist/pnpm.js") }[command]
    : undefined
  const result = spawnSync(cli ? process.execPath : command, cli ? [cli, ...args] : args, {
    cwd,
    encoding: "utf8",
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 128 * 1024 * 1024,
  })
  const label = `${command} ${args.join(" ")}`
  if (result.error) throw new Error(`${label} failed to spawn: ${result.error.message}`)
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`${label} failed (${result.status}):\n${result.stdout ?? ""}\n${result.stderr ?? ""}`)
  }
  return result
}
