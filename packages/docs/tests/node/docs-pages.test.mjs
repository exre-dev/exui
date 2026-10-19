import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

const workflow = new URL('../../../../.github/workflows/docs-pages.yml', import.meta.url)
const require = createRequire(import.meta.url)
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const sha = 'a'.repeat(40)
const newerSha = 'b'.repeat(40)

// Execute the shipped inline guards; only the remote GitHub API is substituted.
async function execute(id, { run = {}, main = sha, env = {}, apiError } = {}) {
  assert.ok(existsSync(workflow), 'The Docs Pages workflow must exist')
  const step = readFileSync(workflow, 'utf8').split(/^      - name: /m)
    .find(value => new RegExp(`^        id: ${id}$`, 'm').test(value))
  assert.ok(step, `Missing guard step ${id}`)
  const source = step.match(/^          script: \|\r?\n((?:            .*\r?\n|\r?\n)+)/m)?.[1]
  assert.ok(source, `Missing inline script for ${id}`)
  const outputs = {}
  const notes = []
  const summary = {
    addHeading(value) { notes.push(value); return this },
    addRaw(value) { notes.push(value); return this },
    addLink(label, url) { notes.push(`${label}: ${url}`); return this },
    async write() {},
  }
  const context = {
    repo: { owner: 'exre-dev', repo: 'exui' },
    runId: 900,
    serverUrl: 'https://github.com',
    payload: { workflow_run: {
      name: 'CI', event: 'push', conclusion: 'success', head_branch: 'main',
      repository: { full_name: 'exre-dev/exui' },
      head_repository: { full_name: 'exre-dev/exui' },
      id: 101, run_attempt: 2, head_sha: sha, ...run,
    } },
  }
  const github = { rest: { repos: { async getBranch(args) {
    assert.deepEqual(args, { owner: 'exre-dev', repo: 'exui', branch: 'main' })
    if (apiError) throw apiError
    return { data: { commit: { sha: main } } }
  } } } }
  await new AsyncFunction('github', 'context', 'core', 'require', 'process', source.replace(/^            /gm, ''))(
    github, context, { summary, setOutput(name, value) { outputs[name] = String(value) } }, require,
    { env: { GITHUB_RUN_ATTEMPT: '3', SOURCE_SHA: sha, PAGES_BASE_PATH: '/exui', ...env } },
  )
  return { outputs, notes: notes.join('\n') }
}

test('a trusted current CI selects its exact attempt and a unique preparation artifact', async () => {
  const { outputs, notes } = await execute('source')
  assert.equal(outputs.current, 'true')
  assert.equal(outputs.source_sha, sha)
  assert.equal(outputs.source_run_id, '101')
  assert.equal(outputs.source_run_attempt, '2')
  assert.equal(outputs.source_artifact, 'docs-site-101-2')
  assert.equal(outputs.pages_artifact, 'github-pages-900-3')
  assert.match(notes, /https:\/\/github.com\/exre-dev\/exui\/actions\/runs\/101\/attempts\/2/)
  const rerun = await execute('source', { env: { GITHUB_RUN_ATTEMPT: '4' } })
  assert.equal(rerun.outputs.pages_artifact, 'github-pages-900-4')
})

test('untrusted events, failed CI, other branches and either foreign repository cannot prepare', async () => {
  for (const run of [
    { name: 'Other' }, { event: 'pull_request' }, { conclusion: 'failure' },
    { conclusion: 'cancelled' }, { head_branch: 'feature' },
    { repository: { full_name: 'fork/exui' } },
    { head_repository: { full_name: 'fork/exui' } }, { head_repository: null },
  ]) {
    const { outputs } = await execute('source', { run })
    assert.equal(outputs.current, 'false')
    assert.equal(outputs.pages_artifact, undefined)
  }
})

test('malformed source identifiers fail instead of selecting another run or attempt', async () => {
  for (const run of [
    { id: 0 }, { id: -1 }, { id: '101' }, { id: 1.5 }, { id: Number.MAX_SAFE_INTEGER + 1 },
    { run_attempt: undefined }, { run_attempt: 0 }, { run_attempt: '2' },
    { head_sha: undefined }, { head_sha: 'abc' }, { head_sha: 'g'.repeat(40) },
  ]) await assert.rejects(execute('source', { run }), /Invalid source/)
  await assert.rejects(execute('source', { env: { GITHUB_RUN_ATTEMPT: '0' } }), /Invalid preparation/)
})

test('a superseded source is skipped before download and again after taking the deployment slot', async () => {
  const prepared = await execute('source', { main: newerSha })
  assert.equal(prepared.outputs.current, 'false')
  assert.match(prepared.notes, /superseded/i)
  assert.match(prepared.notes, new RegExp(newerSha))
  const deployed = await execute('latest', { main: newerSha })
  assert.equal(deployed.outputs.publish, 'false')
  assert.match(deployed.notes, /superseded/i)
})

test('GitHub lookup failures never authorize preparation or deployment', async () => {
  for (const id of ['source', 'latest']) {
    await assert.rejects(execute(id, { apiError: new Error('GitHub unavailable') }), /GitHub unavailable/)
  }
})

test('deployment accepts the production prefix and rejects root, other and malformed bases', async () => {
  for (const base of ['/exui', '/exui/']) {
    const { outputs } = await execute('latest', { env: { PAGES_BASE_PATH: base } })
    assert.equal(outputs.publish, 'true')
  }
  for (const base of ['', '/', '/other', 'exui', '//exui', '/exui/../other']) {
    await assert.rejects(execute('latest', { env: { PAGES_BASE_PATH: base } }), /Pages base/)
  }
})

const files = [
  'index.html', '404.html', '_.data',
  'en/docs/index.html', 'en/docs/_.data', 'zh-CN/docs/index.html', 'zh-CN/docs/_.data',
  'search/en/index.json', 'search/zh-CN/index.json', 'assets/main.js',
  'examples/demo/index.html', 'examples/demo/source.md', 'examples/demo/source.json',
  '.data/route.json', '.well-known/site.json',
]

function siteFixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'exui-docs-pages-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  for (const filename of files) {
    const target = path.join(root, filename)
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, `fixture: ${filename}`)
  }
  return root
}

test('site validation preserves hidden files, route data and example sources byte for byte', async t => {
  const root = siteFixture(t)
  await execute('site', { env: { SITE_ROOT: root } })
  for (const filename of files) assert.equal(readFileSync(path.join(root, filename), 'utf8'), `fixture: ${filename}`)
})

test('incomplete sites, an extra enclosing directory and empty required assets fail', async t => {
  for (const missing of ['index.html', '404.html', '_.data', 'en/docs/index.html', 'search/zh-CN/index.json', 'examples/demo/source.md', 'examples/demo/source.json', 'assets']) {
    const root = siteFixture(t)
    rmSync(path.join(root, missing), { recursive: true, force: true })
    await assert.rejects(execute('site', { env: { SITE_ROOT: root } }), /Missing|Empty|ENOENT/)
  }
  const root = siteFixture(t)
  writeFileSync(path.join(root, 'assets/main.js'), '')
  await assert.rejects(execute('site', { env: { SITE_ROOT: root } }), /Empty/)
  const wrapper = mkdtempSync(path.join(os.tmpdir(), 'exui-docs-pages-wrapper-'))
  t.after(() => rmSync(wrapper, { recursive: true, force: true }))
  mkdirSync(path.join(wrapper, 'exui'))
  writeFileSync(path.join(wrapper, 'exui/index.html'), 'wrong outer directory')
  await assert.rejects(execute('site', { env: { SITE_ROOT: wrapper } }), /Missing|ENOENT/)
})

test('repository metadata and symlink escapes are rejected before Pages dereferences them', async t => {
  for (const directory of ['.git', '.github', 'examples/demo/.github']) {
    const root = siteFixture(t)
    mkdirSync(path.join(root, directory))
    await assert.rejects(execute('site', { env: { SITE_ROOT: root } }), /Forbidden/)
  }
  const root = siteFixture(t)
  const outside = siteFixture(t)
  symlinkSync(outside, path.join(root, 'escape'), process.platform === 'win32' ? 'junction' : 'dir')
  await assert.rejects(execute('site', { env: { SITE_ROOT: root } }), /link/i)
  await assert.rejects(execute('site', { env: { SITE_ROOT: path.join(root, 'escape') } }), /link/i)
})
