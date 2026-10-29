import { spawn } from "node:child_process";
import { realpathSync, watch } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function startPnpm(args, root = process.cwd()) {
  if (!process.env.npm_execpath) throw new Error("Run this command through pnpm: pnpm dev");
  return spawn(process.execPath, [process.env.npm_execpath, ...args], {
    cwd: root,
    stdio: "inherit",
    detached: process.platform !== "win32",
  });
}

export async function stopChild(child) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise(resolveClose => child.once("close", resolveClose));
  if (process.platform === "win32") {
    // pnpm launches grandchildren; killing just its wrapper leaves Vite/tsc alive.
    const killer = spawn("taskkill.exe", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    killer.on("error", () => child.kill());
  } else {
    try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill(); }
  }
  const timeout = setTimeout(() => {
    try { process.kill(-child.pid, "SIGKILL"); } catch { child.kill("SIGKILL"); }
  }, 5_000);
  timeout.unref();
  await closed;
  clearTimeout(timeout);
}

export function watchLibrary({ root = process.cwd(), onBuild = () => {} } = {}) {
  // Canonical paths also avoid libuv fs-event assertions on Windows 8.3 temp paths.
  root = realpathSync.native(root);
  const targets = { tokens: false, components: false };
  const watchers = [];
  let building = false;
  let initialized = false;
  let closed = false;
  let debounceTimer;
  let child;
  let failedTokens = false;
  let resolveReady;
  let rejectReady;
  const ready = new Promise((resolveBuild, rejectBuild) => { resolveReady = resolveBuild; rejectReady = rejectBuild; });

  async function close() {
    if (closed) return;
    closed = true;
    if (!initialized) {
      const error = new Error("Library watch stopped before the initial build completed");
      error.name = "AbortError";
      rejectReady(error);
    }
    clearTimeout(debounceTimer);
    for (const watcher of watchers) watcher.close();
    await stopChild(child);
  }

  async function runPnpm(args) {
    child = startPnpm(args, root);
    await new Promise((resolveBuild, rejectBuild) => {
      child.once("error", rejectBuild);
      child.once("close", (code, signal) => {
        if (code === 0) resolveBuild();
        else rejectBuild(new Error(`pnpm ${args.join(" ")} exited with ${signal ?? code}`));
      });
    });
    child = undefined;
  }

  async function buildPendingTargets() {
    if (closed || building || (!targets.tokens && !targets.components)) return;
    building = true;
    const pending = { ...targets };
    targets.tokens = false;
    targets.components = false;
    try {
      if (pending.tokens) {
        failedTokens = true;
        await runPnpm(["--filter", "@exre/exui-tokens", "build"]);
        failedTokens = false;
      }
      if (pending.components && !closed) await runPnpm(["--filter", "@exre/exui", "build"]);
      if (!closed) {
        await onBuild({ initial: !initialized });
        initialized = true;
        resolveReady();
      }
    } catch (error) {
      if (!closed) {
        console.error(error);
        if (!initialized) { rejectReady(error); await close(); }
      }
    } finally {
      building = false;
      if (targets.tokens || targets.components) void buildPendingTargets();
    }
  }

  function scheduleBuild(target) {
    targets[target] = true;
    if (target === "tokens") targets.components = true;
    if (failedTokens) targets.tokens = true;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { void buildPendingTargets(); }, 150);
  }

  function watchDirectory(directory, target, shouldIgnore = () => false) {
    const watcher = watch(resolve(root, directory), { recursive: true }, (_eventType, filename) => {
      if (!shouldIgnore(filename?.toString())) scheduleBuild(target);
    });
    watcher.on("error", error => { rejectReady(error); void close(); });
    watchers.push(watcher);
  }

  watchDirectory("packages/tokens/src", "tokens", path => path === "style.css");
  watchDirectory("packages/tokens/scripts", "tokens");
  watchDirectory("packages/components/src", "components");
  watchDirectory("packages/components/scripts", "components");
  watchDirectory("packages/icons/glass-icons", "components");
  watchDirectory("packages/icons/src", "components");
  watchDirectory("packages/icons/scripts", "components");
  console.log("Watching Token and component sources for rebuilds. Press Ctrl+C to stop.");
  scheduleBuild("tokens");
  return { ready, close };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const library = watchLibrary();
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => { void library.close(); });
  try { await library.ready; } catch (error) { if (error.name !== "AbortError") process.exitCode = 1; }
}
