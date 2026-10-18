import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadShareExamples, writeShareSources } from './docs-sharing.mjs'
import { normalizeBase } from '../packages/docs/lib/site-contract.mjs'

const repository = fileURLToPath(new URL('../', import.meta.url))
const defaultDocsRoot = path.join(repository, 'packages/docs')

export { normalizeBase }

function safeRelative(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || path.posix.isAbsolute(value) || value.split('/').some(part => !part || part === '.' || part === '..')) throw new Error(`Unsafe relative path: ${value}`)
  return value
}

function within(parent, relative) {
  const resolvedParent = path.resolve(parent)
  const resolved = path.resolve(parent, safeRelative(relative))
  if (!resolved.startsWith(resolvedParent + path.sep)) throw new Error(`Path escapes ${parent}: ${relative}`)
  return resolved
}

function contentsEqual(left, right) {
  const digest = filename => createHash('sha256').update(readFileSync(filename)).digest('hex')
  return statSync(left).size === statSync(right).size && digest(left) === digest(right)
}

function allFiles(directory, prefix = '') {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed in static input: ${path.join(directory, entry.name)}`)
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    return entry.isDirectory() ? allFiles(path.join(directory, entry.name), relative) : [relative]
  })
}

export function buildStaticMapping({ base = '/', prerenderPaths, publicFiles = [], assetFiles = [] }) {
  const normalizedBase = normalizeBase(base)
  if (!Array.isArray(prerenderPaths) || !prerenderPaths.length) throw new Error('Missing prerender path list')
  const prefix = normalizedBase.slice(1)
  const mapping = []
  const add = (source, target) => mapping.push({ source: safeRelative(source), target: safeRelative(target) })
  for (const route of prerenderPaths) {
    if (typeof route !== 'string' || !route.startsWith('/') || route.startsWith('//') || /[\\?#]/.test(route) || route.split('/').some(segment => segment === '.' || segment === '..')) throw new Error(`Unsafe prerender path: ${route}`)
    const relative = route.replace(/^\/+|\/+$/g, '')
    if (relative && !/^[a-zA-Z0-9._~/-]+$/.test(relative)) throw new Error(`Unsafe prerender path: ${route}`)
    if (relative.startsWith('search/')) {
      if (!/^search\/(zh-CN|en)\/index\.json$/.test(relative)) throw new Error(`Unexpected search resource: ${route}`)
      add(`${prefix}${relative}`, relative)
      add(`${prefix}${relative}.data`, `${relative}.data`)
      continue
    }
    if (relative && relative !== '404' && !/^(?:zh-CN|en)\/docs(?:\/(?:components|exui)|\/[a-z0-9-]+\/[a-z0-9-]+)?$|^examples\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(relative)) throw new Error(`Unexpected prerender route: ${route}`)
    const directory = relative ? `${relative}/` : ''
    add(`${prefix}${directory}index.html`, `${directory}index.html`)
    const data = relative ? `${relative}/_.data` : '_.data'
    add(`${prefix}${data}`, data)
    if (relative === '404') add(`${prefix}404/index.html`, '404.html')
  }
  for (const file of assetFiles) add(file, file)
  for (const file of publicFiles) add(file, file)
  return mapping
}

export async function normalizeDocsStatic({ docsRoot = defaultDocsRoot, base = process.env.EXUI_DOCS_BASE ?? '/', prerenderPaths, shareExamples } = {}) {
  const normalizedBase = normalizeBase(base)
  const absoluteDocsRoot = path.resolve(docsRoot)
  const build = path.join(absoluteDocsRoot, 'build')
  const client = path.join(build, 'client')
  const publicDirectory = path.join(absoluteDocsRoot, 'public')
  assert.equal(path.dirname(client), build)
  if (!existsSync(client) || !statSync(client).isDirectory()) throw new Error(`Missing React Router client output: ${client}`)
  const manifest = prerenderPaths ?? JSON.parse(readFileSync(path.join(absoluteDocsRoot, '.generated/prerender-paths.json'), 'utf8')).paths
  const examples = shareExamples ?? await loadShareExamples(repository)
  const mapping = buildStaticMapping({
    base: normalizedBase,
    prerenderPaths: manifest,
    publicFiles: allFiles(publicDirectory),
    assetFiles: allFiles(path.join(client, 'assets'), 'assets'),
  })
  const stagingName = `.static-staging-${process.pid}-${Date.now()}`
  const staging = within(build, stagingName)
  mkdirSync(staging)
  const targets = new Map()
  try {
    for (const { source, target } of mapping) {
      const from = within(client, source)
      const to = within(staging, target)
      if (!existsSync(from) || !statSync(from).isFile()) throw new Error(`Missing static source ${source}`)
      const previous = targets.get(target)
      if (previous) {
        if (!contentsEqual(previous, from)) throw new Error(`Conflicting static target ${target}: ${previous} and ${from}`)
        continue
      }
      mkdirSync(path.dirname(to), { recursive: true })
      copyFileSync(from, to)
      if (!contentsEqual(from, to)) throw new Error(`Static copy corrupted ${source}`)
      targets.set(target, from)
    }
    for (const example of examples) {
      if (!manifest.includes(`/examples/${example.id}/`)) throw new Error(`Share page missing from prerender list: ${example.id}`)
      if (!targets.has(`examples/${example.id}/index.html`)) throw new Error(`Share HTML missing: ${example.id}`)
    }
    await writeShareSources(staging, examples, normalizedBase, repository)
    for (const example of examples) for (const filename of ['source.md', 'source.json']) {
      if (!statSync(within(staging, `examples/${example.id}/${filename}`)).isFile()) throw new Error(`Share source missing ${example.id}/${filename}`)
    }
    const backupName = `.static-backup-${process.pid}-${Date.now()}`
    const backup = within(build, backupName)
    renameSync(client, backup)
    try { renameSync(staging, client) } catch (error) { renameSync(backup, client); throw error }
    rmSync(backup, { recursive: true, force: true })
    return { output: client, files: allFiles(client).length, prerenderPaths: manifest.length, examples: examples.length, base: normalizedBase }
  } catch (error) {
    // Keep the staging directory for diagnosis; the original client output stays intact.
    throw new Error(`Static normalization failed (staging: ${staging}): ${error.message}`, { cause: error })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  normalizeDocsStatic().then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error); process.exitCode = 1 })
}
