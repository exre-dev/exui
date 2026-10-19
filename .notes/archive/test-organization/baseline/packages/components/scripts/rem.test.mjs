import assert from "node:assert/strict"
import fs from "node:fs/promises"
import { test } from "node:test"
import ts from "typescript"

const source = await fs.readFile(new URL("../src/lib/rem.ts", import.meta.url), "utf8")
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } })
const { getRootRem, getRootRemStore, remToPixels, toCssLength } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`)

function documentFixture(initial = 16) {
  let fontSize = initial
  const resizeObservers = new Set()
  const mutationObservers = new Set()
  const events = new Map()
  const probes = new Set()
  const doc = {
    nodeType: 9,
    documentElement: {},
    body: { appendChild: node => probes.add(node) },
    createElement: () => ({ style: {}, setAttribute() {}, remove() { probes.delete(this) } }),
    defaultView: {
      getComputedStyle: () => ({ fontSize: `${fontSize}px` }),
      ResizeObserver: class {
        constructor(callback) { this.callback = callback }
        observe() { resizeObservers.add(this) }
        disconnect() { resizeObservers.delete(this) }
      },
      MutationObserver: class {
        constructor(callback) { this.callback = callback }
        observe() { mutationObservers.add(this) }
        disconnect() { mutationObservers.delete(this) }
      },
      addEventListener(type, listener) { events.set(type, listener) },
      removeEventListener(type, listener) { if (events.get(type) === listener) events.delete(type) },
    },
  }
  return {
    doc, probes, resizeObservers, mutationObservers, events,
    setFont(value, kind = "resize") {
      fontSize = value
      const observers = kind === "resize" ? resizeObservers : mutationObservers
      for (const observer of observers) observer.callback([])
    },
  }
}

test("rem defaults resolve against their own document and explicit pixel values remain pixels", () => {
  const first = documentFixture(16)
  const second = documentFixture(32)
  assert.equal(getRootRem(first.doc), 16)
  assert.equal(getRootRem({ ownerDocument: second.doc }), 32)
  assert.equal(remToPixels(1.25, first.doc), 20)
  assert.equal(remToPixels(1.25, second.doc), 40)
  assert.equal(toCssLength(undefined, "1.25rem"), "1.25rem")
  assert.equal(toCssLength(20, "1.25rem"), "20px")
  assert.equal(toCssLength("2rem", "1.25rem"), "2rem")
})

test("one document shares one probe, publishes dynamic root changes and cleans up its final subscriber", () => {
  const fixture = documentFixture(16)
  const store = getRootRemStore(fixture.doc)
  assert.equal(store, getRootRemStore(fixture.doc))
  let first = 0
  let second = 0
  const stopFirst = store.subscribe(() => first++)
  const stopSecond = store.subscribe(() => second++)
  assert.equal(fixture.probes.size, 1)
  fixture.setFont(21.328)
  assert.equal(store.getSnapshot(), 21.328)
  assert.equal(first, 1)
  assert.equal(second, 1)
  fixture.setFont(21.328, "mutation")
  assert.equal(first, 1, "unchanged root metrics do not notify React")
  stopFirst()
  fixture.setFont(32, "mutation")
  assert.equal(first, 1)
  assert.equal(second, 2)
  assert.equal(fixture.probes.size, 1)
  stopSecond()
  assert.equal(fixture.probes.size, 0)
  assert.equal(fixture.resizeObservers.size, 0)
  assert.equal(fixture.mutationObservers.size, 0)
  assert.equal(fixture.events.size, 0)
  const stopAgain = store.subscribe(() => {})
  assert.equal(store.getSnapshot(), 32)
  assert.equal(fixture.probes.size, 1)
  stopAgain()
})

test("documents remain independent and unavailable SSR metrics use the 16px design base", () => {
  const first = documentFixture(16)
  const second = documentFixture(32)
  const firstStore = getRootRemStore(first.doc)
  const secondStore = getRootRemStore(second.doc)
  const stopFirst = firstStore.subscribe(() => {})
  const stopSecond = secondStore.subscribe(() => {})
  first.setFont(20)
  assert.equal(firstStore.getSnapshot(), 20)
  assert.equal(secondStore.getSnapshot(), 32)
  assert.equal(getRootRem(null), 16)
  assert.equal(remToPixels(2, null), 32)
  stopFirst()
  stopSecond()
})
