import { readFile, mkdir, mkdtemp, writeFile, realpath, rm, symlink } from "node:fs/promises"
import { dirname, join, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { loadPages } from "./docs-content.mjs"
import { removeBounded } from "./exui-capabilities.mjs"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const docsRoot = join(repoRoot, "packages/docs")
const generatedRoot = join(docsRoot, ".generated")
const requireDocs = createRequire(join(docsRoot, "package.json"))
const ts = requireDocs("typescript")
const familyFence = /```tsx source="([a-z0-9]+(?:-[a-z0-9]+)*)"\n([\s\S]*?)\n```/g

export function firstFamilyExampleId(page) {
  return page.group === "exui" ? `exui-${page.exampleFamily}-1` : `c-${page.exampleFamily}-1`
}

export function createFamilySnippet(document, family) {
  const code = document.files.get(document.entry)
  if (!code) throw new Error(`Missing entry source ${document.entry}`)
  const source = ts.createSourceFile(document.entry, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const publicNames = new Map()
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== "@exre/exui") continue
    const named = statement.importClause?.namedBindings
    if (named && ts.isNamedImports(named)) for (const item of named.elements) if (!item.isTypeOnly) publicNames.set(item.name.text, item.propertyName?.text ?? item.name.text)
  }
  // The first DateSelector preview uses a local accessibility adapter whose props are
  // explicitly typed from the public DateSelector. Show the public name in the excerpt.
  if (family === "date-selector" && [...document.files.values()].some((text) => /DateSelector as PublicDateSelector\s*}\s*from\s*["']@exre\/exui["']/.test(text))) publicNames.set("DateSelector", "DateSelector")
  const candidates = []
  const isPublicTag = (tag) => publicNames.has(tag) || (tag.startsWith("Recharts.") && publicNames.has("Recharts"))
  function visit(node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node
      const tag = opening.tagName.getText(source)
      if (isPublicTag(tag)) candidates.push({ node, opening, tag })
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  const primary = family === "input-otp" ? "InputOTP" : family === "kbd" ? "Kbd" : family === "scrollspy" ? "Scrollspy" : family === "sonner" ? "Toaster" : family === "glass" ? "Card" : family === "chart" ? "ChartContainer" : family === "resizable" ? "ResizablePanelGroup" : family === "sidebar" ? "SidebarMenu" : family === "stepper" ? "StepperNav" : family.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")
  let selected = candidates.find(({ tag, opening }) => tag === primary && (family !== "glass" || opening.attributes.properties.some((item) => item.name?.getText(source) === "glass")))
  selected ??= candidates.find(({ tag }) => tag === primary) ?? candidates[0]
  if (!selected) throw new Error(`No public JSX composition in ${document.entry}`)
  const { node, tag } = selected
  let jsx = node.getText(source).trim()
  if (jsx.length > 650 || jsx.split("\n").length > 12) {
    function summarize(current, depth) {
      const open = ts.isJsxElement(current) ? current.openingElement : current
      const name = open.tagName.getText(source)
      const defining = name === "Form" ? ["form", "schema", "defaultValues", "fields", "onSubmit"] : name === "FormField" ? ["form", "name", "control", "render"] : []
      const attributes = open.attributes.properties.filter(ts.isJsxAttribute)
        .filter((item) => defining.includes(item.name.text) || (!["className", "style", "children"].includes(item.name.text) && item.getText(source).length <= 90))
        .filter((item, index) => defining.includes(item.name.text) || index < 3).map((item) => item.getText(source))
      const start = `<${name}${attributes.length ? ` ${attributes.join(" ")}` : ""}`
      const children = ts.isJsxElement(current) ? current.children.filter((child) => (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) && isPublicTag((ts.isJsxElement(child) ? child.openingElement : child).tagName.getText(source))).slice(0, 2) : []
      if (depth >= 2 || children.length === 0) return `${start} />`
      return `${start}>\n${children.map((child) => summarize(child, depth + 1).split("\n").map((line) => `  ${line}`).join("\n")).join("\n")}\n</${name}>`
    }
    jsx = summarize(node, 0)
  }
  const names = [...publicNames.keys()].filter((name) => jsx.includes(`<${name}`))
  if (!names.includes(tag)) names.unshift(tag)
  return `import { ${names.map((name) => publicNames.has(name) && publicNames.get(name) !== name ? `${publicNames.get(name)} as ${name}` : name).join(", ")} } from "@exre/exui"\n\n${jsx}`
}

export function extractVerifiedModules(source, path) {
  const modules = []
  const fence = /^```(tsx|ts)\s+verify\s*\n([\s\S]*?)^```\s*$/gm
  for (const match of source.replace(/\r\n?/g, "\n").matchAll(fence)) {
    const code = match[2].trim()
    if (!/^import\s/m.test(code) || !/^export\s/m.test(code)) throw new Error(`${path}: verify block must be a complete imported and exported module`)
    for (const specifier of code.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
      const publicIcon = specifier[1] === "@exre/exui/icons/glass-icons" || /^@exre\/exui\/icons\/glass-icons\/[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/.test(specifier[1])
      if (!publicIcon && !new Set(["@exre/exui", "@exre/exui/style.css", "@exre/exui/tokens", "@exre/exui/tokens/style.css", "@exre/exui/tokens/font.css", "@exre/exui/docs/theme.css", "lucide-react", "react", "zod"]).has(specifier[1])) {
        throw new Error(`${path}: unsupported import ${specifier[1]}`)
      }
    }
    modules.push({ language: match[1], code })
  }
  return modules
}

export function authoredGuideModules(source, path) {
  return extractVerifiedModules(removeBounded(source, "docs"), path)
}

export function addCapabilitySources(documents, examples, registry, makeDocument) {
  const byId = new Map(examples.map((example) => [example.id, example]))
  for (const capability of registry.capabilities) for (const id of capability.examples) {
    if (documents.has(id)) continue
    const example = byId.get(id)
    if (!example) throw new Error(`Missing capability example ${id}`)
    documents.set(id, makeDocument(example))
  }
  return documents
}

export function glassSurfaceTypeContract(registry) {
  const names = [...new Set(registry.capabilities.flatMap((item) => Object.values(item.surfaces ?? {}).flat()))].sort()
  if (!names.length) throw new Error("No registered Glass surfaces for public type verification")
  return `import type { ComponentProps } from "react"\nimport { ${names.join(", ")} } from "@exre/exui"\n\nexport const glassSurfaceContract = {\n${names.map((name) => `  ${name}: true satisfies ComponentProps<typeof ${name}>["glass"],`).join("\n")}\n}\n`
}

async function familySourceDocuments(pages, root) {
  const { loadShareExamples, createSourceDocument } = await import("./docs-sharing.mjs")
  const examples = await loadShareExamples(root)
  const byId = new Map(examples.map((example) => [example.id, example]))
  const documents = new Map()
  for (const page of pages.filter((item) => item.locale === "en" && item.exampleFamily)) {
    const id = firstFamilyExampleId(page)
    const example = byId.get(id)
    if (!example || example.page.id !== page.exampleFamily || example.page.group !== page.group) throw new Error(`${page.id}: first source example ${id} is missing or belongs to another family`)
    documents.set(id, createSourceDocument(root, example))
  }
  const families = pages.filter(item => item.locale === "en" && item.exampleFamily)
  if (documents.size !== families.length) throw new Error(`Family source coverage mismatch: ${documents.size} sources for ${families.length} families`)
  // Every authored extension is a public consumer, including secondary Form branches.
  for (const example of examples.filter(item => item.extension || item.page.id === "form")) if (!documents.has(example.id)) documents.set(example.id, createSourceDocument(root, example))
  const registry = JSON.parse(await readFile(join(root, "packages/docs/exui/capabilities.json"), "utf8"))
  addCapabilitySources(documents, examples, registry, (example) => createSourceDocument(root, example))
  return documents
}

export async function writeFamilySnippets(root = repoRoot) {
  const pages = await loadPages(root)
  const documents = await familySourceDocuments(pages, root)
  for (const page of pages.filter((item) => item.exampleFamily)) {
    const path = join(root, "packages/docs/content", page.locale, page.contentPath)
    let source = (await readFile(path, "utf8")).replaceAll("\r\n", "\n")
    const id = firstFamilyExampleId(page)
    const snippet = createFamilySnippet(documents.get(id), page.exampleFamily)
    const title = page.locale === "zh-CN" ? "当前示例源码摘录" : "Current example source excerpt"
    const linkText = page.locale === "zh-CN" ? "查看完整源码" : "View complete source"
    const block = `### ${title}\n\n\`\`\`tsx source="${id}"\n${snippet}\n\`\`\`\n\n[${linkText}](../../../../examples/${id}/)`
    if (familyFence.test(source)) {
      familyFence.lastIndex = 0
      source = source.replace(/### (?:当前示例源码摘录|Current example source excerpt)\n\n```tsx source="[^"]+"\n[\s\S]*?\n```\n\n\[[^\]]+\]\(\.\.\/\.\.\/\.\.\/\.\.\/examples\/[a-z0-9-]+\/\)/, block)
    } else {
      source = source.replace(/(## (?:基本用法|Basic usage)\n\n)[^\n]+\n\n/, "$1")
      source = `${source.trimEnd()}\n\n${block}\n`
    }
    await writeFile(path, source, "utf8")
  }
  return pages.filter((page) => page.locale === "en" && page.exampleFamily).length
}

async function verifyFamilySnippets(pages, root) {
  const documents = await familySourceDocuments(pages, root)
  for (const page of pages.filter((item) => item.exampleFamily)) {
    const path = join(root, "packages/docs/content", page.locale, page.contentPath)
    const source = await readFile(path, "utf8")
    validateFamilySnippet(page, source, documents.get(firstFamilyExampleId(page)), path)
  }
  return documents
}

export function validateFamilySnippet(page, source, document, path = page.contentPath) {
  source = source.replaceAll("\r\n", "\n")
  const fences = [...source.matchAll(familyFence)]
  const expectedId = firstFamilyExampleId(page)
  if (fences.length !== 1 || fences[0][1] !== expectedId) throw new Error(`${path}: exactly one source-linked ${expectedId} TSX excerpt is required`)
  const expectedCode = createFamilySnippet(document, page.exampleFamily)
  if (fences[0][2].trim() !== expectedCode.trim()) throw new Error(`${path}: source excerpt differs from ${expectedId}; run docs-snippets.mjs --write after reviewing source`)
  if (!source.includes(`](../../../../examples/${expectedId}/)`)) throw new Error(`${path}: complete source link is missing`)
  return expectedId
}

async function compileFamilySources(documents) {
  const fixture = await mkdtemp(join(generatedRoot, "source-consumers-"))
  try {
    const dependencies = new Set()
    for (const [id, document] of documents) {
      const manifest = JSON.parse(document.files.get("package.json"))
      for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) dependencies.add(name)
      for (const [filename, content] of document.files) {
        if (filename === "package.json" || filename === "tsconfig.json" || filename === "vite.config.ts") continue
        const target = join(fixture, "examples", id, filename)
        await mkdir(dirname(target), { recursive: true })
        await writeFile(target, content)
      }
    }
    for (const name of dependencies) {
      const source = await realpath(join(docsRoot, "node_modules", name))
      const target = join(fixture, "node_modules", name)
      await mkdir(dirname(target), { recursive: true })
      await symlink(source, target, "junction")
    }
    await writeFile(join(fixture, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        target: "ES2023", lib: ["ES2023", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler",
        jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: true, resolveJsonModule: true,
        esModuleInterop: true, allowArbitraryExtensions: true, types: ["react", "react-dom", "vite/client"],
      },
      include: ["examples/*/src/**/*"],
    }, null, 2))
    const tsc = join(docsRoot, "node_modules/typescript/bin/tsc")
    const result = spawnSync(process.execPath, [tsc, "-p", join(fixture, "tsconfig.json")], { cwd: fixture, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error(`Family source consumers failed to compile:\n${result.stdout}${result.stderr}`)
    return documents.size
  } finally {
    const canonicalRoot = await realpath(generatedRoot)
    const canonicalFixture = await realpath(fixture)
    if (!canonicalFixture.startsWith(`${canonicalRoot}${sep}`)) throw new Error("Family fixture escaped generated root")
    await rm(canonicalFixture, { recursive: true, force: true })
  }
}

export async function verifySnippets(root = repoRoot) {
  const pages = await loadPages(root)
  await mkdir(generatedRoot, { recursive: true })
  const familyDocuments = await verifyFamilySnippets(pages, root)
  const fixture = await mkdtemp(join(generatedRoot, "snippets-"))
  try {
    let count = 0
    for (const page of pages) {
      const path = join(root, "packages/docs/content", page.locale, page.contentPath)
      const source = await readFile(path, "utf8")
      const modules = extractVerifiedModules(source, path)
      // Styles documents component styling, standalone React artwork and an
      // asset URL separately; all three examples must remain type-checked.
      const expectedModules = page.id === "getting-started/skills" ? 0 : page.id === "getting-started/styles" ? 3 : 1
      if (["getting-started", "tokens"].includes(page.group) && authoredGuideModules(source, path).length !== expectedModules) {
        throw new Error(`${path}: guide must contain exactly ${expectedModules} verified module(s)`)
      }
      for (const module of modules) {
        await writeFile(join(fixture, `${page.locale}-${page.id.replace("/", "-")}-${count}.${module.language}`), `${module.code}\n`)
        count++
      }
    }
    const registry = JSON.parse(await readFile(join(root, "packages/docs/exui/capabilities.json"), "utf8"))
    await writeFile(join(fixture, "glass-surfaces.ts"), glassSurfaceTypeContract(registry))
    await writeFile(join(fixture, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        target: "ES2023", lib: ["ES2023", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler",
        jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: false, types: ["react", "react-dom"],
        allowSyntheticDefaultImports: true, noUncheckedSideEffectImports: true,
      },
      include: ["./*.ts", "./*.tsx", "./*.d.ts"],
    }, null, 2))
    const tsc = join(docsRoot, "node_modules/typescript/bin/tsc")
    const result = spawnSync(process.execPath, [tsc, "-p", join(fixture, "tsconfig.json")], { cwd: docsRoot, encoding: "utf8" })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error(`Verified snippets failed to compile:\n${result.stdout}${result.stderr}`)
    const familyCount = await compileFamilySources(familyDocuments)
    return { guides: count, families: familyCount }
  } finally {
    const canonicalRoot = await realpath(generatedRoot)
    const canonicalFixture = await realpath(fixture)
    if (!canonicalFixture.startsWith(`${canonicalRoot}${sep}`)) throw new Error("Snippet fixture escaped generated root")
    await rm(canonicalFixture, { recursive: true, force: true })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2] ?? "--verify"
  const run = mode === "--write" ? writeFamilySnippets : mode === "--verify" ? verifySnippets : () => { throw new Error("Usage: node scripts/docs-snippets.mjs [--verify|--write]") }
  run().then((result) => console.log(mode === "--write" ? `Wrote ${result} source-linked family snippets in two locales` : `Compiled ${result.guides} verified modules and ${result.families} complete family source consumers`)).catch((error) => { console.error(error); process.exitCode = 1 })
}
