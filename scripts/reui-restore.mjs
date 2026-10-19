import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const defaultSnapshot = path.join(root, 'packages/components/upstream/reui')
const sha = (value) => createHash('sha256').update(value.toString('utf8').replace(/\r\n/g, '\n')).digest('hex')

function requireCondition(condition, message) {
  if (!condition) throw new Error(message)
}

function validateIdentity(identity) {
  requireCondition(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/.test(identity.repository ?? ''), 'invalid ReUI GitHub repository')
  requireCondition(/^[a-f0-9]{40}$/.test(identity.commit ?? ''), 'invalid pinned ReUI commit')
}

function validatePath(filename) {
  requireCondition(typeof filename === 'string' && /^[\w./-]+$/.test(filename)
    && filename.split('/').every((part) => part && part !== '.' && part !== '..'), `invalid ReUI path: ${filename}`)
}

export async function readUpstreamFile(identity, source, { checkout = process.env.EXUI_REUI_CHECKOUT, fetchImpl = globalThis.fetch } = {}) {
  validateIdentity(identity)
  validatePath(source)
  if (checkout) {
    // Read Git blobs, never checkout bytes or an unpinned branch tip.
    return execFileSync('git', ['show', `${identity.commit}:${source}`], { cwd: checkout, maxBuffer: 32 * 1024 * 1024 })
  }
  const repository = identity.repository.slice('https://github.com/'.length)
  const url = `https://raw.githubusercontent.com/${repository}/${identity.commit}/${source}`
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(30_000) })
    requireCondition(response.ok, `HTTP ${response.status} for ${source}`)
    return Buffer.from(await response.arrayBuffer())
  } catch (error) {
    throw new Error(`Cannot download ReUI ${identity.commit}:${source}: ${error.message}. Retry node scripts/reui-restore.mjs when connectivity is available, or set EXUI_REUI_CHECKOUT to a local Git checkout containing the pinned commit.`, { cause: error })
  }
}

export async function restoreReuiSnapshot({ snapshot = defaultSnapshot, readSource } = {}) {
  const manifest = JSON.parse(readFileSync(path.join(snapshot, 'manifest.json'), 'utf8'))
  validateIdentity(manifest)
  requireCondition(Array.isArray(manifest.files) && manifest.files.length > 0, 'missing ReUI source lock')
  requireCondition(Array.isArray(manifest.assets)
    && manifest.assets.some((entry) => entry.source === 'LICENSE.md' && entry.target === 'LICENSE.md')
    && manifest.assets.some((entry) => entry.source === 'registry/styles/style-luma.css' && entry.target === 'style-luma.css'), 'missing ReUI asset hashes')
  const files = [
    ...manifest.files.map((entry) => ({ source: entry.source, target: `source/${entry.source}`, sha256: entry.sourceSha256 })),
    ...manifest.assets,
  ]
  const targets = new Set()
  for (const entry of files) {
    validatePath(entry.source)
    validatePath(entry.target)
    requireCondition(/^[a-f0-9]{64}$/.test(entry.sha256 ?? ''), `invalid ReUI hash: ${entry.source}`)
    requireCondition(!targets.has(entry.target), `invalid duplicate ReUI target: ${entry.target}`)
    targets.add(entry.target)
  }

  const missing = []
  for (const entry of files) {
    const filename = path.join(snapshot, entry.target)
    if (!existsSync(filename)) missing.push(entry)
    else requireCondition(sha(readFileSync(filename)) === entry.sha256, `ReUI cache hash mismatch: ${entry.target}. Remove the invalid cache file and run node scripts/reui-restore.mjs; tracked metadata and adapters must be reviewed separately.`)
  }

  const download = readSource ?? ((source) => readUpstreamFile(manifest, source))
  const pending = []
  let next = 0
  const workers = Array.from({ length: Math.min(8, missing.length) }, async () => {
    while (next < missing.length) {
      const entry = missing[next++]
      const bytes = await download(entry.source)
      requireCondition(sha(bytes) === entry.sha256, `ReUI download hash mismatch: ${entry.source}`)
      pending.push([path.join(snapshot, entry.target), bytes])
    }
  })
  const results = await Promise.allSettled(workers)
  const failure = results.find((result) => result.status === 'rejected')
  if (failure) throw failure.reason
  // Publish only after all existing and downloaded bytes pass their locks.
  // A failed download never replaces accepted adapters or leaves a partial cache.
  for (const [filename, bytes] of pending) {
    mkdirSync(path.dirname(filename), { recursive: true })
    writeFileSync(filename, bytes)
  }
  return { restored: pending.length, verified: files.length, commit: manifest.commit }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const index = process.argv.indexOf('--snapshot')
  requireCondition(index < 0 || process.argv[index + 1] && !process.argv[index + 1].startsWith('--'), 'missing --snapshot path')
  const result = await restoreReuiSnapshot({ snapshot: index < 0 ? defaultSnapshot : path.resolve(process.argv[index + 1]) })
  console.log(`ReUI restore: ${result.restored} restored, ${result.verified} verified (${result.commit})`)
}
