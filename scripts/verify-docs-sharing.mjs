import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadShareExamples } from './docs-sharing.mjs'
import { startStaticServer } from './verify-docs-static.mjs'
import { examplePath, normalizeBase } from '../packages/docs/lib/site-contract.mjs'

const repository = fileURLToPath(new URL('../', import.meta.url))
const output = path.resolve(repository, process.argv[2] ?? 'packages/docs/build/client')
const base = normalizeBase(process.argv[3] ?? '/')
const examples = await loadShareExamples(repository)
const { server, origin } = await startStaticServer(output, base)
try {
  for (const example of examples) {
    const url = examplePath(example.id, base)
    const [html, markdown, json] = await Promise.all([
      fetch(origin + url),
      fetch(origin + url + 'source.md'),
      fetch(origin + url + 'source.json'),
    ])
    assert.equal(html.status, 200, url)
    assert.match(html.headers.get('content-type') ?? '', /^text\/html/)
    assert.ok((await html.text()).includes(example.id), `Unreadable share HTML ${example.id}`)
    assert.equal(markdown.status, 200, `${url}source.md`)
    assert.match(markdown.headers.get('content-type') ?? '', /^text\/markdown/)
    const sourceMarkdown = await markdown.text()
    assert.ok(sourceMarkdown.includes(`Example ID: \`${example.id}\``))
    assert.equal(json.status, 200, `${url}source.json`)
    assert.match(json.headers.get('content-type') ?? '', /^application\/json/)
    const sourceJson = await json.json()
    assert.equal(sourceJson.schemaVersion, 1)
    assert.equal(sourceJson.id, example.id)
    assert.equal(sourceJson.family, example.page.id)
    assert.ok(sourceJson.files.length > 0)
    for (const file of sourceJson.files) assert.ok(sourceMarkdown.includes(`### ${file.path}`), `${example.id}/${file.path}`)
  }
  console.log(`Verified ${examples.length} static HTML, Markdown and JSON sharing triples over HTTP at ${base}`)
} finally {
  await new Promise(resolve => server.close(resolve))
}
