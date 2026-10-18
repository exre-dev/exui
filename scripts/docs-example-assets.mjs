import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, realpathSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const repository = path.resolve(import.meta.dirname, '..')
const ts = createRequire(path.join(repository, 'packages/docs/package.json'))('typescript')
const manifestDirectory = 'packages/docs/upstream/reui'
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const assert = (condition, target, reason) => { if (!condition) throw new Error(`${target}: ${reason}`) }
const readJson = filename => JSON.parse(readFileSync(filename, 'utf8'))

function targetPath(value, prefix = 'public/examples/reui/') {
  assert(typeof value === 'string' && value.startsWith(prefix) && !/[\\:]/.test(value)
    && ![...value].some(character => character.charCodeAt(0) < 32)
    && value.split('/').every(part => part && part !== '.' && part !== '..' && !/[. ]$/.test(part)), String(value), 'unsafe asset target path')
  return value
}
function httpsSource(value, target) {
  let url
  try { url = new URL(value) } catch { throw new Error(`${target}: invalid source URL ${value}`) }
  assert(url.protocol === 'https:' && url.hostname && !url.username && !url.password, target, `invalid source URL ${value}`)
}
function bytesAt(showcase, target) {
  targetPath(target)
  const filename = path.resolve(showcase, target)
  assert(filename.startsWith(path.resolve(showcase) + path.sep), target, 'asset path escapes Showcase')
  let current = showcase
  for (const segment of target.split('/')) {
    current = path.join(current, segment)
    assert(existsSync(current), target, 'missing asset file or parent directory')
    assert(!lstatSync(current).isSymbolicLink(), target, 'symlink asset path is forbidden')
  }
  assert(lstatSync(filename).isFile(), target, 'asset target is not a regular file')
  assert(realpathSync(filename).startsWith(realpathSync(showcase) + path.sep), target, 'real asset path escapes Showcase')
  return readFileSync(filename)
}
function manifest(manifestValue, name) {
  assert(manifestValue?.schemaVersion === 1 && manifestValue.base === 'packages/docs', name, 'invalid schemaVersion or target base')
  assert(Array.isArray(manifestValue.files) && manifestValue.files.length > 0, name, 'missing file records')
}
function managedFiles(showcase, relative, visit) {
  const filename = path.join(showcase, relative)
  assert(existsSync(filename), relative, 'missing managed asset directory')
  const info = lstatSync(filename)
  assert(!info.isSymbolicLink(), relative, 'symlink or junction in managed assets is forbidden')
  if (info.isDirectory()) for (const entry of readdirSync(filename).sort()) managedFiles(showcase, `${relative}/${entry}`, visit)
  else { assert(info.isFile(), relative, 'managed asset is not a regular file'); visit(relative) }
}
function finiteImageLookups(source, owner, showcase, rows, requireReference) {
  const imports = source.statements.filter(node => ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier) && /^\.\/assets\.generated(?:\.ts)?$/.test(node.moduleSpecifier.text) && node.importClause?.name)
  if (!imports.length) return { calls: 0, urls: [] }
  const aliases = new Set(imports.map(node => node.importClause.name.text))
  const nodes = []; const definitions = new Map()
  function collect(node) {
    nodes.push(node)
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) definitions.set(node.name.text, node.initializer)
    ts.forEachChild(node, collect)
  }
  collect(source)
  const calls = nodes.filter(node => ts.isCallExpression(node) && ts.isIdentifier(node.expression) && aliases.has(node.expression.text))
  if (!calls.length) return { calls: 0, urls: [] }
  const lookupPath = path.posix.join(path.posix.dirname(owner), 'assets.generated.ts')
  const lookupSource = ts.createSourceFile(lookupPath, readFileSync(path.join(showcase, lookupPath), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const lookup = new Map()
  function entries(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'assets' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      for (const property of node.initializer.properties) {
        assert(ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.name) && ts.isStringLiteralLike(property.initializer), lookupPath, 'image lookup must contain static source/target pairs')
        assert(!lookup.has(property.name.text), lookupPath, `duplicate image lookup source ${property.name.text}`)
        lookup.set(property.name.text, property.initializer.text)
      }
    }
    ts.forEachChild(node, entries)
  }
  entries(lookupSource)
  function values(node, environment, seen = new Set()) {
    if (!node) return null
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return values(node.expression, environment, seen)
    if (ts.isStringLiteralLike(node)) return [node.text]
    if (ts.isNumericLiteral(node)) return [Number(node.text)]
    if (ts.isIdentifier(node)) {
      if (environment.has(node.text)) return environment.get(node.text)
      if (seen.has(node.text)) return null
      return values(definitions.get(node.text), environment, new Set([...seen, node.text]))
    }
    if (ts.isBinaryExpression(node) && [ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken].includes(node.operatorToken.kind)) {
      const left = values(node.left, environment, seen); const right = values(node.right, environment, seen)
      return left && right ? left.flatMap(a => right.map(b => node.operatorToken.kind === ts.SyntaxKind.PlusToken ? a + b : a - b)) : null
    }
    if (ts.isTemplateExpression(node)) {
      let result = [node.head.text]
      for (const span of node.templateSpans) {
        const possible = values(span.expression, environment, seen)
        if (!possible) return null
        result = result.flatMap(prefix => possible.map(value => prefix + value + span.literal.text))
      }
      return result
    }
    return null
  }
  function bindings(node) {
    const environment = new Map()
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (ts.isArrowFunction(parent) && ts.isCallExpression(parent.parent) && ts.isPropertyAccessExpression(parent.parent.expression) && parent.parent.expression.name.text === 'map') {
        const receiver = parent.parent.expression.expression
        if (ts.isCallExpression(receiver) && receiver.expression.getText(source) === 'Array.from' && receiver.arguments[0] && ts.isObjectLiteralExpression(receiver.arguments[0])) {
          const length = receiver.arguments[0].properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(source) === 'length')
          const possible = length && values(length.initializer, environment)
          const index = parent.parameters[1]?.name
          if (possible?.length === 1 && Number.isSafeInteger(possible[0]) && possible[0] >= 0 && index && ts.isIdentifier(index)) environment.set(index.text, Array.from({ length: possible[0] }, (_, i) => i))
        }
      }
      if ((ts.isArrowFunction(parent) || ts.isFunctionExpression(parent)) && parent.parameters.length && ts.isVariableDeclaration(parent.parent) && ts.isIdentifier(parent.parent.name)) {
        const name = parent.parent.name.text
        for (let i = 0; i < parent.parameters.length; i++) {
          const possible = nodes.filter(candidate => ts.isCallExpression(candidate) && ts.isIdentifier(candidate.expression) && candidate.expression.text === name).flatMap(candidate => values(candidate.arguments[i], environment) ?? [])
          if (possible.length && ts.isIdentifier(parent.parameters[i].name)) environment.set(parent.parameters[i].name.text, [...new Set(possible)])
        }
      }
    }
    return environment
  }
  const resolved = new Set()
  for (const call of calls) {
    const possible = values(call.arguments[0], bindings(call))
    assert(possible && possible.every(value => typeof value === 'string'), owner, `image lookup argument is not a finite supported source expression: ${call.arguments[0]?.getText(source)}`)
    for (const url of possible) {
      assert(lookup.has(url), url, `missing finite image lookup (${owner})`)
      const target = lookup.get(url)
      requireReference(target, owner)
      assert(rows.some(row => row.source === url && row.target === `public${target}`), target, `image lookup source lacks matching provenance: ${url} (${owner})`)
      resolved.add(url)
    }
  }
  return { calls: calls.length, urls: [...resolved] }
}
function staticReferences(showcase, records, emoji, rows) {
  const referenced = new Set()
  const imageUrls = new Set(); let imageLookupCalls = 0
  const emojiBase = `/examples/reui/emoji/${emoji.package}-${emoji.version}`
  function requireReference(value, owner) {
    const target = targetPath(`public${value.split(/[?#]/)[0]}`)
    assert(records.get(target.toLowerCase())?.target === target, target, `static reference missing provenance (${owner})`)
    referenced.add(target)
  }
  function sourceTree(directory) {
    if (!existsSync(directory)) return
    assert(!lstatSync(directory).isSymbolicLink(), directory, 'source symlink is forbidden during static reference audit')
    if (lstatSync(directory).isDirectory()) { for (const name of readdirSync(directory).sort()) sourceTree(path.join(directory, name)); return }
    if (!/\.[cm]?[jt]sx?$/.test(directory) || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(directory)) return
    const owner = path.relative(showcase, directory).replaceAll('\\', '/')
    const source = ts.createSourceFile(directory, readFileSync(directory, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const strings = []; const countries = new Set(); const locales = new Set(); let dynamicFlags = false
    function literalValues(node, callback) { if (ts.isStringLiteralLike(node)) callback(node.text); ts.forEachChild(node, child => literalValues(child, callback)) }
    const locale = value => { if (/^[a-z]{2}(?:-[A-Z]{2})?$/.test(value)) locales.add(value.split('-')[0]) }
    function inspect(node) {
      if (ts.isStringLiteralLike(node)) strings.push(node.text)
      if (ts.isPropertyAssignment(node) && ['flag', 'code', 'countryCode'].includes(node.name.getText(source).replaceAll('"', '').replaceAll("'", '')) && ts.isStringLiteralLike(node.initializer) && /^[a-z]{2}$/i.test(node.initializer.text)) countries.add(node.initializer.text.toLowerCase())
      if (ts.isArrayLiteralExpression(node) && node.elements.length && node.elements.every(value => ts.isStringLiteralLike(value) && /^[a-z]{2}$/i.test(value.text))) for (const value of node.elements) countries.add(value.text.toLowerCase())
      if (ts.isTemplateExpression(node) && /^\/examples\/reui\/(?:photos|flags|emoji)\//.test(node.head.text)) {
        assert(node.head.text === '/examples/reui/flags/' && node.templateSpans.length === 1 && node.templateSpans[0].literal.text === '.svg', owner, 'unsupported dynamic managed asset reference; use a finite static lookup')
        dynamicFlags = true
      }
      if ((ts.isPropertyAssignment(node) || ts.isJsxAttribute(node)) && node.name.getText(source) === 'locale' && node.initializer) literalValues(node.initializer, locale)
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && /LOCALES/i.test(node.name.text) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) for (const property of node.initializer.properties) if (property.name) locale(property.name.getText(source).replaceAll('"', '').replaceAll("'", ''))
      ts.forEachChild(node, inspect)
    }
    inspect(source)
    const images = finiteImageLookups(source, owner, showcase, rows, requireReference)
    imageLookupCalls += images.calls
    for (const url of images.urls) imageUrls.add(url)
    for (const value of strings) {
      if (!/^\/examples\/reui\/(?:photos|flags|emoji)\//.test(value)) continue
      if (value.replace(/\/$/, '') === emojiBase) {
        const configured = locales.size ? locales : new Set(['en'])
        for (const language of configured) for (const name of ['data.json', 'messages.json']) requireReference(`${emojiBase}/${language}/${name}`, owner)
        requireReference(`${emojiBase}/en/shortcodes/github.json`, owner)
      } else requireReference(value, owner)
    }
    if (dynamicFlags) {
      assert(countries.size, owner, 'dynamic flag reference has no finite static country-code configuration')
      for (const code of countries) requireReference(`/examples/reui/flags/${code}.svg`, owner)
    }
  }
  for (const relative of ['src/showcase/examples', 'src/showcase/pages/components']) sourceTree(path.join(showcase, relative))
  return { referencedFiles: referenced.size, imageLookupCalls, finiteImageUrls: imageUrls.size }
}

/** Raw-byte verification only. No download, mutation, source upgrade or digest acceptance. */
export function validateExampleAssets({ root = repository, assets, flags, emoji }) {
  manifest(assets, 'asset-provenance.json'); manifest(flags, 'flag-provenance.json'); manifest(emoji, 'emoji-provenance.json')
  const showcase = path.resolve(root, 'packages/docs')
  const rows = []; const records = new Map(); const sourceTargets = new Set()
  function record(file, prefix, kind) {
    targetPath(file.target, prefix); httpsSource(file.source, file.target)
    assert(/^[a-f0-9]{64}$/.test(file.sha256 ?? ''), file.target, 'invalid SHA-256 lock')
    assert(file.bytes === undefined || Number.isSafeInteger(file.bytes) && file.bytes >= 0, file.target, 'invalid byte count')
    const pair = `${file.source}\n${file.target}`
    assert(!sourceTargets.has(pair), file.target, 'duplicate source-target record'); sourceTargets.add(pair)
    const previous = records.get(file.target.toLowerCase())
    if (previous) assert(previous.target === file.target && previous.sha256 === file.sha256 && (previous.bytes === undefined || file.bytes === undefined || previous.bytes === file.bytes), file.target, 'conflicting shared asset alias')
    else records.set(file.target.toLowerCase(), file)
    rows.push({ ...file, kind })
  }
  for (const file of assets.files) {
    record(file, 'public/examples/reui/photos/', 'image')
    assert(['downloaded', 'substituted'].includes(file.status), file.target, 'invalid image provenance status')
    httpsSource(file.request, file.target)
    assert(typeof file.adaptation === 'string' && file.adaptation.trim(), file.target, 'missing image adaptation provenance')
    assert(Array.isArray(file.examples) && file.examples.length && file.examples.every(id => /^c-[a-z0-9-]+-\d+$/.test(id)), file.target, 'invalid source example references')
    if (file.status === 'downloaded') httpsSource(file.resolved, file.target)
    else {
      httpsSource(file.substituteSource, file.target)
      assert(typeof file.originalFailure === 'string' && file.originalFailure.trim(), file.target, 'missing original substitution failure evidence')
      assert(assets.files.some(other => other.status === 'downloaded' && other.source === file.substituteSource && other.target === file.target && other.sha256 === file.sha256), file.target, 'substitution must reference the same archived replacement bytes')
    }
  }

  assert(flags.preservedSources === 'public/examples/reui/flags/sources.json', 'flag-provenance.json', 'missing preserved original flag manifest relationship')
  const retainedBytes = bytesAt(showcase, flags.preservedSources)
  assert(/^[a-f0-9]{64}$/.test(flags.preservedSourcesSha256 ?? '') && digest(retainedBytes) === flags.preservedSourcesSha256, flags.preservedSources, 'preserved flag metadata SHA-256 mismatch')
  const retained = JSON.parse(retainedBytes.toString('utf8'))
  assert(Array.isArray(retained.files) && retained.files.length === 10, flags.preservedSources, 'expected ten original proof flags')
  const originalFlags = new Map()
  for (const original of retained.files) {
    assert(/^[a-z]{2}\.svg$/.test(original.file ?? '') && !originalFlags.has(original.file), flags.preservedSources, `invalid or duplicate preserved flag ${original.file}`)
    assert(/^[a-f0-9]{64}$/.test(original.sha256 ?? ''), original.file, 'invalid preserved flag SHA-256')
    const source = `https://flagcdn.com/${original.file}`
    assert(original.source === source, original.file, 'invalid preserved flag source')
    originalFlags.set(original.file, original)
  }
  const codes = new Set()
  for (const file of flags.files) {
    record(file, 'public/examples/reui/flags/', 'flag')
    assert(/^[a-z]{2}$/.test(file.code ?? '') && !codes.has(file.code), file.target, 'invalid or duplicate flag country code'); codes.add(file.code)
    assert(file.target === `public/examples/reui/flags/${file.code}.svg` && file.source === `https://flagcdn.com/${file.code}.svg`, file.target, 'flag code/source/target mismatch')
    const original = originalFlags.get(`${file.code}.svg`)
    if (original) assert(file.owner === 'existing-style-proof' && file.staged === false && file.sha256 === original.sha256 && file.source === original.source, file.target, 'preserved original flag relationship or SHA-256 changed')
    else assert(file.owner === 'migration' && file.staged === true, file.target, 'invalid migration flag ownership provenance')
  }
  for (const [filename] of originalFlags) assert(flags.files.some(file => file.code === filename.slice(0, -4)), `public/examples/reui/flags/${filename}`, 'missing preserved original flag record')

  assert(emoji.package === 'emojibase-data' && /^\d+\.\d+\.\d+$/.test(emoji.version ?? ''), 'emoji-provenance.json', 'invalid emoji package/version')
  const emojiPrefix = `public/examples/reui/emoji/${emoji.package}-${emoji.version}/`
  const emojiSource = `https://cdn.jsdelivr.net/npm/${emoji.package}@${emoji.version}/`
  for (const file of emoji.files) {
    record(file, emojiPrefix, 'emoji')
    assert(file.source === emojiSource + file.target.slice(emojiPrefix.length), file.target, 'emoji pinned source/version/target mismatch')
    assert(Number.isSafeInteger(file.bytes) && file.bytes > 0, file.target, 'missing emoji byte count')
  }
  assert(emoji.files.some(file => file.target === emojiPrefix + 'LICENSE' && file.source === emojiSource + 'LICENSE'), emojiPrefix + 'LICENSE', 'missing emoji LICENSE provenance')

  let totalBytes = 0
  const verified = new Map()
  for (const file of rows) {
    let bytes = verified.get(file.target)
    if (!bytes) {
      bytes = bytesAt(showcase, file.target); verified.set(file.target, bytes); totalBytes += bytes.length
      assert(digest(bytes) === file.sha256, file.target, 'SHA-256 byte mismatch')
    }
    if (file.bytes !== undefined) assert(bytes.length === file.bytes, file.target, `byte count mismatch (expected ${file.bytes}, received ${bytes.length})`)
  }
  const actual = new Set()
  for (const relative of ['public/examples/reui/photos', 'public/examples/reui/flags', 'public/examples/reui/emoji']) managedFiles(showcase, relative, target => {
    if (target === flags.preservedSources) return
    assert(records.get(target.toLowerCase())?.target === target, target, 'unrecorded managed asset is not in provenance manifests')
    actual.add(target)
  })
  for (const file of records.values()) assert(actual.has(file.target), file.target, 'missing managed provenance target')
  const references = staticReferences(showcase, records, emoji, rows)
  return { records: rows.length, uniqueFiles: records.size, sharedAliases: rows.length - records.size, preservedFlags: originalFlags.size, imageRecords: assets.files.length, flagRecords: flags.files.length, emojiRecords: emoji.files.length, bytes: totalBytes, ...references }
}

export function checkExampleAssets({ root = repository } = {}) {
  return validateExampleAssets({ root, assets: readJson(path.join(root, manifestDirectory, 'asset-provenance.json')), flags: readJson(path.join(root, manifestDirectory, 'flag-provenance.json')), emoji: readJson(path.join(root, manifestDirectory, 'emoji-provenance.json')) })
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(checkExampleAssets(), null, 2)) } catch (error) { console.error(error.message); process.exitCode = 1 }
}
