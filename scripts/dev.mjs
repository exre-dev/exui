import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { startPnpm, stopChild, watchLibrary } from "./watch.mjs";

const marker = resolve("packages/docs/.generated/library-rebuild");
let revision = 0;
let docs;
let stopping = false;
const library = watchLibrary({
  async onBuild() {
    await mkdir(dirname(marker), { recursive: true });
    await writeFile(marker, String(++revision));
  },
});

async function stop() {
  if (stopping) return;
  stopping = true;
  await Promise.all([library.close(), stopChild(docs)]);
}

for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => { void stop(); });

try {
  await library.ready;
  if (!stopping) {
    docs = startPnpm(["--filter", "@exre/exui-docs", "dev", ...process.argv.slice(2)]);
    await new Promise((resolveExit, rejectExit) => {
      docs.once("error", rejectExit);
      docs.once("close", (code, signal) => {
        if (code !== 0 && !stopping) rejectExit(new Error(`Docs dev server exited with ${signal ?? code}`));
        else resolveExit();
      });
    });
  }
} catch (error) {
  if (!stopping) { console.error(error); process.exitCode = 1; }
} finally {
  await stop();
}
