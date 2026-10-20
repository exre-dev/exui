import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { basename, delimiter, dirname, join } from "node:path"

function windowsPackageManager(command) {
  if (!["npm", "pnpm"].includes(command)) return undefined
  const entry = process.env.npm_execpath
  if (entry && basename(entry).startsWith(command) && existsSync(entry)) return entry
  // A pinned Node runtime may be separate from the npm/Corepack installation.
  const directories = [dirname(process.execPath), ...(process.env.PATH ?? "").split(delimiter)]
  const paths = command === "npm" ? ["npm/bin/npm-cli.js"] : ["corepack/dist/pnpm.js", "pnpm/bin/pnpm.cjs"]
  for (const directory of directories) {
    for (const path of paths) {
      const filename = join(directory, "node_modules", path)
      if (existsSync(filename)) return filename
    }
  }
  throw new Error(`Cannot find the installed ${command} JavaScript CLI on PATH`)
}

export function runCommand(command, args, cwd, { allowFailure = false } = {}) {
  // Windows .cmd shims need a shell. Invoke npm/Corepack with Node instead
  // so spaces, quotes and shell metacharacters remain literal arguments.
  const cli = process.platform === "win32" ? windowsPackageManager(command) : undefined
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
