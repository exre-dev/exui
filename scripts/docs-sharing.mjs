import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'

export function findRepositoryRoot(start = process.cwd()) {
  let directory = path.resolve(start)
  while (true) {
    if (existsSync(path.join(directory, 'pnpm-workspace.yaml')) && existsSync(path.join(directory, 'packages/docs/package.json'))) return directory
    const parent = path.dirname(directory)
    if (parent === directory) throw new Error(`Cannot locate ExUI repository from ${start}`)
    directory = parent
  }
}

let repository
try { repository = findRepositoryRoot() }
catch { repository = findRepositoryRoot(fileURLToPath(import.meta.url)) }
const require = createRequire(path.join(repository, 'packages/docs/package.json'))
const ts = require('typescript')
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
const normalized = value => value.replaceAll('\\', '/')
const read = filename => readFileSync(filename, 'utf8').replaceAll('\r\n', '\n')
const parse = (filename, text) => ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const property = (node, name) => node.properties.find(item => item.name?.getText() === name)?.initializer

const codeLanguages = { ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx', json: 'json', css: 'css', html: 'html', md: 'markdown', mjs: 'javascript' }

export function sourceFiles(document) {
  const entry = [...document.files.keys()].find(name => name === document.entry)
  return [...document.files].sort(([left], [right]) =>
    left === entry ? -1 : right === entry ? 1 : left.localeCompare(right, 'en'),
  ).map(([filename, code]) => ({ path: filename, language: codeLanguages[path.extname(filename).slice(1)] ?? 'text', code }))
}

let highlighterPromise
const highlightedCache = new Map()
function highlight(highlighter, file) {
  const cacheable = file.code.length < 100_000
  const key = cacheable ? `${file.language}:${createHash('sha256').update(file.code).digest('hex')}` : null
  if (key && highlightedCache.has(key)) return highlightedCache.get(key)
  const html = highlighter.codeToHtml(file.code, {
    lang: file.language,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
  if (key) {
    highlightedCache.set(key, html)
    if (highlightedCache.size > 512) highlightedCache.delete(highlightedCache.keys().next().value)
  }
  return html
}

async function sourceHighlighter() {
  highlighterPromise ??= import(/* @vite-ignore */ pathToFileURL(require.resolve('shiki')).href).then(({ createHighlighter }) => createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['typescript', 'tsx', 'javascript', 'jsx', 'json', 'css', 'html', 'markdown', 'text'],
  }))
  return highlighterPromise
}

export async function createExampleSourceJson(root, example, document = createSourceDocument(root, example)) {
  const highlighter = await sourceHighlighter()
  return {
    schemaVersion: 1,
    id: example.id,
    family: example.page.id,
    files: sourceFiles(document).map(file => ({
      ...file,
      highlightedHtml: highlight(highlighter, file),
    })),
  }
}

export async function writeShareSources(output, examples, base = '/', root = repository) {
  for (const example of examples) {
    const directory = path.join(output, 'examples', example.id)
    const document = createSourceDocument(root, example, base)
    const source = await createExampleSourceJson(root, example, document)
    mkdirSync(directory, { recursive: true })
    writeFileSync(path.join(directory, 'source.md'), document.markdown)
    writeFileSync(path.join(directory, 'source.json'), JSON.stringify(source) + '\n')
  }
  return examples.length
}
const attribute = (node, name) => node.openingElement.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.text === name)?.initializer?.text

function walk(node, visit) {
  visit(node)
  ts.forEachChild(node, child => walk(child, visit))
}

export async function loadShareExamples(root = repository) {
  // Keep the maintenance tool at its real filesystem URL during RR server bundling.
  // It resolves TypeScript from packages/docs at module initialization.
  const { loadCatalog } = await import(/* @vite-ignore */ pathToFileURL(path.join(repository, 'scripts/docs-examples.mjs')).href)
  const catalog = await loadCatalog(root)
  const coverage = JSON.parse(read(path.join(root, 'packages/docs/upstream/reui/coverage.json')))
  const examples = coverage.examples.filter(example => example.status === 'adapted').map(example => ({
    id: example.id, source: example.target, page: catalog.find(page => page.id === example.family),
  }))
  const exuiSource = 'packages/docs/src/showcase/pages/exui.tsx'
  const exui = parse(exuiSource, read(path.join(root, exuiSource)))
  const pageFunctions = new Map()
  walk(exui, node => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'pages') {
      for (const item of node.initializer.properties) pageFunctions.set(item.initializer.text, item.name.text)
    }
  })
  for (const statement of exui.statements.filter(ts.isFunctionDeclaration)) {
    walk(statement, node => {
      if (!ts.isJsxElement(node) || node.openingElement.tagName.getText() !== 'Preview') return
      const id = attribute(node, 'shareId')
      if (!id) throw new Error(`Missing stable shareId in ${statement.name.text}`)
      examples.push({ id, source: exuiSource, functionName: statement.name.text, page: catalog.find(page => page.id === pageFunctions.get(statement.name.text)) })
    })
  }
  const directory = path.join(root, 'packages/docs/src/showcase/examples')
  for (const family of readdirSync(directory, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const filename = path.join(directory, family.name, 'exui-extensions.ts')
    if (!existsSync(filename)) continue
    const source = parse(filename, read(filename))
    const imports = new Map(source.statements.filter(ts.isImportDeclaration).filter(node => node.importClause?.name).map(node => [node.importClause.name.text, node.moduleSpecifier.text]))
    walk(source, node => {
      if (!ts.isVariableDeclaration(node) || node.name.getText() !== 'extensions') return
      for (const entry of node.initializer.elements) {
        const id = property(entry, 'id').text
        const component = property(entry, 'Component').text
        const sourceFile = resolveSourceFile(root, normalized(path.relative(path.join(root, 'packages/docs'), filename)), imports.get(component))
        examples.push({ id, source: normalized(path.relative(root, sourceFile)), page: catalog.find(page => page.id === family.name), extension: true })
      }
    })
  }
  const ids = new Set()
  for (const example of examples) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(example.id) || !example.page || ids.has(example.id)) throw new Error(`Invalid or duplicate share example ${example.id}`)
    ids.add(example.id)
  }
  return examples
}

export function resolveSourceFile(root, from, specifier) {
  if (typeof specifier !== 'string' || !specifier.startsWith('.')) throw new Error(`Invalid local module ${specifier}`)
  const sourceRoot = path.resolve(root, 'packages/docs/src')
  const target = path.resolve(root, 'packages/docs', path.dirname(from), specifier)
  const relative = path.relative(sourceRoot, target)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Source import escapes outside Showcase src: ${specifier}`)
  const candidates = [target, ...['.ts', '.tsx', '.json', '/index.ts', '/index.tsx'].map(suffix => target + suffix)]
  if (/\.js$/.test(target)) candidates.push(target.replace(/\.js$/, '.ts'), target.replace(/\.js$/, '.tsx'))
  const file = candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile())
  if (!file) throw new Error(`Cannot resolve missing helper ${specifier} from ${from}`)
  return file
}

function isolateExui(text, example) {
  const source = parse(example.source, text)
  const selected = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name.text === example.functionName)
  if (!selected) throw new Error(`Missing example function ${example.functionName}`)
  const transformed = ts.transform(selected, [context => {
    const visit = node => {
      if (ts.isJsxElement(node)) {
        const tag = node.openingElement.tagName.getText(source)
        if (tag === 'Preview' || tag === 'PreviewGrid') {
          const children = tag === 'Preview' && attribute(node, 'shareId') !== example.id ? [] : node.children.map(child => ts.visitNode(child, visit))
          return ts.factory.createJsxFragment(ts.factory.createJsxOpeningFragment(), children, ts.factory.createJsxJsxClosingFragment())
        }
      }
      return ts.visitEachChild(node, visit, context)
    }
    return node => ts.visitNode(node, visit)
  }])
  const statement = transformed.transformed[0]
  const entry = ts.factory.updateFunctionDeclaration(statement, [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ts.factory.createModifier(ts.SyntaxKind.DefaultKeyword)], statement.asteriskToken, statement.name, statement.typeParameters, statement.parameters, statement.type, statement.body)
  const statements = source.statements.filter(node => {
    if (ts.isImportDeclaration(node)) return node.moduleSpecifier.text !== '../Preview'
    if (ts.isFunctionDeclaration(node)) return node.name.text === 'useCopy'
    return ts.isVariableStatement(node) && !node.declarationList.declarations.some(declaration => declaration.name.getText(source) === 'pages')
  })
  const output = printer.printFile(ts.factory.updateSourceFile(source, [...statements, entry]))
  transformed.dispose()
  return output
}

function installedVersion(name) {
  for (const directory of require.resolve.paths(name) ?? []) {
    const manifest = path.join(directory, name, 'package.json')
    if (existsSync(manifest)) return JSON.parse(read(manifest)).version
  }
  let filename
  try { filename = require.resolve(`${name}/package.json`) } catch { filename = require.resolve(name) }
  let directory = path.dirname(filename)
  while (path.dirname(directory) !== directory) {
    const manifest = path.join(directory, 'package.json')
    if (existsSync(manifest)) {
      const data = JSON.parse(read(manifest))
      if (data.name === name) return data.version
    }
    directory = path.dirname(directory)
  }
  throw new Error(`Missing installed dependency version: ${name}`)
}

function codeBlock(filename, content) {
  const fence = '`'.repeat(Math.max(3, ...[...content.matchAll(/`+/g)].map(match => match[0].length + 1)))
  const extension = path.extname(filename).slice(1)
  return `### ${filename}\n\n${fence}${extension === 'json' ? 'json' : extension}\n${content.trimEnd()}\n${fence}\n`
}

export function createSourceDocument(root, example, base = '/') {
  if (!example) throw new Error('Missing share example')
  const files = new Map()
  const dependencies = new Set(['react', 'react-dom', '@exre/exui'])
  const assets = new Set()
  const projectRoot = path.join(root, 'packages/docs')
  const visit = (filename, override) => {
    const relative = normalized(path.relative(projectRoot, filename))
    if (files.has(relative)) return
    const text = override ?? read(filename)
    files.set(relative, text)
    for (const asset of text.matchAll(/\/examples\/reui\/[a-zA-Z0-9_./-]+/g)) assets.add(asset[0])
    if (/\.(?:ts|tsx)$/.test(filename)) {
      walk(parse(filename, text), node => {
        let specifier
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) specifier = node.moduleSpecifier.text
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) specifier = node.arguments[0].text
        if (!specifier) return
        if (specifier.startsWith('.')) visit(resolveSourceFile(root, relative, specifier))
        else if (!specifier.startsWith('node:')) dependencies.add(specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0])
      })
    }
  }
  const filename = path.join(root, example.source)
  const entry = normalized(path.relative(projectRoot, filename))
  visit(filename, example.functionName ? isolateExui(read(filename), example) : undefined)
  for (const css of ['example-theme.css', 'example-utilities.css']) visit(path.join(projectRoot, 'src/showcase', css))
  const devNames = ['vite', '@vitejs/plugin-react', 'typescript', 'tailwindcss', '@tailwindcss/vite', '@types/react', '@types/react-dom']
  const manifest = { private: true, type: 'module', scripts: { dev: 'vite', build: 'tsc --noEmit && vite build' }, dependencies: Object.fromEntries([...dependencies].sort().map(name => [name, installedVersion(name)])), devDependencies: Object.fromEntries(devNames.map(name => [name, installedVersion(name)])) }
  files.set('package.json', JSON.stringify(manifest, null, 2) + '\n')
  files.set('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2023', lib: ['ES2023', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, resolveJsonModule: true, esModuleInterop: true, noEmit: true }, include: ['src'] }, null, 2) + '\n')
  files.set('vite.config.ts', 'import { defineConfig } from "vite"\nimport react from "@vitejs/plugin-react"\nimport tailwindcss from "@tailwindcss/vite"\nexport default defineConfig({ plugins: [react(), tailwindcss()] })\n')
  files.set('index.html', '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>ExUI example</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n')
  files.set('src/main.tsx', `import { createRoot } from "react-dom/client"\nimport { ExMessageContext, GlassSeed, TooltipProvider } from "@exre/exui"\nimport "@exre/exui/style.css"\nimport "./showcase/example-utilities.css"\nimport "./example.css"\nimport Example from "./${entry.replace(/^src\//, '').replace(/\.(?:tsx?|jsx?)$/, '')}"\n\ncreateRoot(document.getElementById("root")!).render(\n  <TooltipProvider><GlassSeed /><ExMessageContext /><div className="exui-example-stage"><Example /></div></TooltipProvider>\n)\n`)
  const sharedLayout = read(path.join(projectRoot, 'src/showcase/ShowcasePages.css')).match(/\.showcase-(?:row|stack|stack-wide|sr-only)\s*\{[^}]*\}/g) ?? []
  files.set('src/example.css', 'body { margin: 0; background: var(--background); color: var(--foreground); font-family: var(--font-sans); }\n.exui-example-stage { display: flex; align-items: center; justify-content: center; min-height: 12rem; padding: 2rem; }\n' + sharedLayout.join('\n') + '\n')
  files.set('src/vite-env.d.ts', '/// <reference types="vite/client" />\n')
  const route = `${base}zh-CN/docs/${example.page.group}/${example.page.id}/?example=${example.id}`
  const label = `${example.page.name} · ${example.extension ? 'E' : ''}${(example.id.match(/-(\d+)$/)?.[1] ?? '1').padStart(2, '0')}`
  const license = read(path.join(root, 'packages/docs/upstream/reui/LICENSE.md'))
  const markdown = `# ${label}\n\nExample ID: \`${example.id}\`\n\n[Interactive preview](${route}) · [Share page](${base}examples/${example.id}/)\n\n## Setup\n\nRecreate the files below with the same relative paths, install with \`pnpm install\`, then run \`pnpm dev\`. React 19 and the public \`@exre/exui\` package are required. Local helper modules and the private Tailwind utility mapping are included; do not copy Showcase navigation or import component-library internals. Appearance uses the consuming project's defaults; no theme, density, language or interactive state is captured. The package version identifies the current library build, including local unpublished changes when used before release.\n\n## Files\n\n${[...files].map(([name, content]) => codeBlock(name, content)).join('\n')}\n## Assets\n\n${assets.size ? 'Download these assets into the matching public paths before running the example:\n\n' + [...assets].sort().map(asset => `- \`public${asset}\` — [download](${base}${asset.slice(1)})`).join('\n') : 'No additional binary assets are required.'}\n\n## Source attribution\n\n${example.functionName || example.extension ? "Example authored in the ExUI Showcase. The public ExUI components it uses include ReUI-derived implementations." : "Example adapted for ExUI from the pinned ReUI example collection."} Keep the following notice with reused ReUI source:\n\n${license}\n`
  return { markdown, files, entry, assets: [...assets] }
}

const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export function renderShareHtml(template, example, markdown, base = '/') {
  const route = `#/${example.page.group}/${example.page.id}?example=${example.id}`
  const content = `<article><h1>${escapeHtml(example.page.name)} — ${escapeHtml(example.id)}</h1><p><a href="${escapeHtml(base + route)}">Open interactive preview</a> · <a href="${escapeHtml(base)}examples/${example.id}/source.md">Markdown source</a></p><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(markdown)}</pre></article>`
  const html = template.replace(/<div id="root">\s*<\/div>/, () => `<div id="root" data-share-route="${escapeHtml(route)}">${content}</div>`)
  if (html === template) throw new Error('Cannot locate Showcase root in the HTML template')
  return html.replace('<head>', `<head><base href="${escapeHtml(base)}" /><link rel="alternate" type="text/markdown" href="${escapeHtml(base)}examples/${example.id}/source.md" />`)
}
