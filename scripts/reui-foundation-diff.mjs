import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { restoreReuiSnapshot } from './reui-restore.mjs'

const root = path.resolve(import.meta.dirname, '..')
const snapshotRoot = path.join(root, 'packages/components/upstream/reui')
await restoreReuiSnapshot({ snapshot: snapshotRoot })
const manifest = JSON.parse(readFileSync(path.join(snapshotRoot, 'manifest.json'), 'utf8'))
const sha = (value) => createHash('sha256').update(value.replace(/\r\n/g, '\n')).digest('hex')
const entries = []
for (const file of manifest.files.filter((entry) => entry.adaptation === 'exui-foundation-adapter')) {
  const source = path.join('packages/components/upstream/reui/source', file.source).replaceAll('\\', '/')
  const target = path.join('packages/components/src', file.target).replaceAll('\\', '/')
  let patch = ''
  try {
    patch = execFileSync('git', ['diff', '--no-index', '--ignore-space-at-eol', '--', source, target], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  } catch (error) {
    if (error.status !== 1) throw error
    patch = error.stdout
  }
  patch = patch.replace(/\r\n/g, '\n')
  const patchFile = path.join(snapshotRoot, 'adapters/ui', `${path.basename(file.target)}.patch`)
  const targetText = readFileSync(path.join(root, target), 'utf8')
  entries.push({
    source: file.source,
    target: file.target,
    sourceSha256: file.sourceSha256,
    adaptedSha256: sha(targetText),
    patch: patch ? path.relative(snapshotRoot, patchFile).replaceAll('\\', '/') : null,
    changedLines: patch.split('\n').filter((line) => /^[+-][^+-]/.test(line)).length,
    category: patch ? 'reviewable ExUI adaptation' : 'source-identical',
  })
  if (process.argv.includes('--write')) {
    if (patch) { mkdirSync(path.dirname(patchFile), { recursive: true }); writeFileSync(patchFile, patch) }
  } else if (patch) {
    if (!existsSync(patchFile) || readFileSync(patchFile, 'utf8') !== patch) throw new Error(`foundation diff stale: ${file.target}`)
  } else if (existsSync(patchFile)) throw new Error(`unexpected foundation diff: ${file.target}`)
}
const reportFile = path.join(snapshotRoot, 'foundation-adapters.json')
const report = `${JSON.stringify({ schemaVersion: 1, upstreamCommit: manifest.commit, files: entries }, null, 2)}\n`
if (process.argv.includes('--write')) writeFileSync(reportFile, report)
else if (readFileSync(reportFile, 'utf8') !== report) throw new Error('foundation adapter report is stale')
console.log(`Foundation source comparison: ${entries.length} files, ${entries.filter((entry) => entry.patch).length} adapted, ${entries.filter((entry) => !entry.patch).length} source-identical`)
