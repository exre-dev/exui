import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { formatExampleTemplate } from '../../src/showcase/examples/_shared/example-copy-format.ts'

const dictionary = {
  'Meeting at {time}': '会议时间：{time}',
  '{count} of {total} uploaded': '已上传 {count}/{total} 个文件',
  'User {name}: {name}': '用户 {name}：{name}',
  'Design review': '设计评审',
}
const chinese = (template) => dictionary[template] ?? template

test('formats English and translated Chinese templates with the same actual values', () => {
  assert.equal(formatExampleTemplate('Meeting at {time}', { time: '09:30' }), 'Meeting at 09:30')
  assert.equal(formatExampleTemplate('Meeting at {time}', { time: '09:30' }, chinese), '会议时间：09:30')
  assert.equal(formatExampleTemplate('{count} of {total} uploaded', { count: 0, total: 4 }, chinese), '已上传 0/4 个文件')
})
test('repeated, zero and empty parameters are substituted without truthiness fallback', () => {
  assert.equal(formatExampleTemplate('User {name}: {name}', { name: '' }), 'User : ')
  assert.equal(formatExampleTemplate('User {name}: {name}', { name: 0 }, chinese), '用户 0：0')
})
test('user text stays raw even if it is English copy or contains placeholders and replacement tokens', () => {
  const name = 'Design review {name} $&\n用户原文'
  assert.equal(formatExampleTemplate('User {name}: {name}', { name }, chinese), `用户 ${name}：${name}`)
  assert.equal(formatExampleTemplate('User {name}: {name}', { name: 'Design review' }, chinese), '用户 Design review：Design review')
})
test('unknown templates fall back to the developer supplied English template', () => {
  assert.equal(formatExampleTemplate('Unknown {value}', { value: '原文' }, chinese), 'Unknown 原文')
})
test('missing parameters fail explicitly and inherited object keys cannot satisfy placeholders', () => {
  assert.throws(() => formatExampleTemplate('Meeting at {time}', {}, chinese), /Missing example copy parameter: time/)
  assert.throws(() => formatExampleTemplate('{toString}', {}), /Missing example copy parameter: toString/)
})

test('every explicit example template has complete Chinese copy and matching interpolation arguments', () => {
  const require = createRequire(new URL('../../package.json', import.meta.url))
  const ts = require('typescript')
  const root = path.resolve('packages/docs/src/showcase/examples')
  const files = fs.readdirSync(root, { recursive: true }).filter((file) => /(^|[\\/])c-[^\\/]+\.tsx$/.test(file))
  const placeholders = (text) => [...new Set([...text.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map((match) => match[1]))].sort()
  function variants(node) {
    if (ts.isStringLiteral(node)) return [node.text]
    if (ts.isParenthesizedExpression(node)) return variants(node.expression)
    if (ts.isConditionalExpression(node)) return [...variants(node.whenTrue), ...variants(node.whenFalse)]
    assert.fail(`Display template must be an explicit literal or choice: ${node.getText()}`)
  }
  let calls = 0
  for (const relative of files) {
    const source = fs.readFileSync(path.join(root, relative), 'utf8')
    const sf = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const copyPath = path.join(root, relative.split(/[\\/]/)[0], 'copy.generated.ts')
    const copySource = fs.readFileSync(copyPath, 'utf8')
    const copy = JSON.parse(copySource.slice(copySource.indexOf('{'), copySource.lastIndexOf('}') + 1))
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(sf) === 'formatExample') {
        calls++
        const keys = variants(node.arguments[0])
        assert.ok(ts.isObjectLiteralExpression(node.arguments[1]), `${relative}: arguments must be explicit`)
        const arguments_ = node.arguments[1].properties.map((property) => property.name.getText(sf)).sort()
        for (const key of keys) {
          assert.ok(Object.hasOwn(copy, key), `${relative}: missing Chinese template ${key}`)
          assert.ok(/[\u3400-\u9fff]/.test(copy[key]) || !/[A-Za-z]/.test(copy[key].replace(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g, "")), `${relative}: untranslated template ${key}`)
          assert.deepEqual(placeholders(key), placeholders(copy[key]), `${relative}: Chinese placeholders ${key}`)
          assert.deepEqual(placeholders(key), arguments_, `${relative}: parameter bindings ${key}`)
          const values = Object.fromEntries(arguments_.map((name) => [name, `{${name}} $& 英文UserValue`]))
          const translated = formatExampleTemplate(key, values, (template) => copy[template])
          for (const value of Object.values(values)) assert.ok(translated.includes(value), `${relative}: altered parameter`)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
  assert.ok(calls > 0)
})

test('finite display and ARIA branches have exact runtime dictionary keys', () => {
  const require = createRequire(new URL('../../package.json', import.meta.url))
  const ts = require('typescript')
  const root = path.resolve('packages/docs/src/showcase/examples')
  const retained = new Map([
    ['cascader/c-cascader-9.tsx', new Set(['true', 'false'])],
    ['filters/c-filters-9.tsx', new Set(['example.com'])],
    ['emoji-picker/c-emoji-picker-7.tsx', new Set(['Kudos for Daniel Kim posted in #platform'])],
  ])
  const literals = (node) => ts.isStringLiteralLike(node) ? [node.text]
    : ts.isConditionalExpression(node) ? [...literals(node.whenTrue), ...literals(node.whenFalse)]
      : ts.isParenthesizedExpression(node) ? literals(node.expression)
        : ts.isBinaryExpression(node) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(node.operatorToken.kind) ? [...literals(node.left), ...literals(node.right)] : []
  let checked = 0
  for (const relative of fs.readdirSync(root, { recursive: true }).filter((file) => /(^|[\\/])c-[^\\/]+\.tsx$/.test(file))) {
    const file = relative.replaceAll('\\', '/')
    const source = fs.readFileSync(path.join(root, relative), 'utf8')
    const sf = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const dictionarySource = fs.readFileSync(path.join(root, file.split('/')[0], 'copy.generated.ts'), 'utf8')
    const copy = JSON.parse(dictionarySource.slice(dictionarySource.indexOf('{'), dictionarySource.lastIndexOf('}') + 1))
    function visit(node) {
      const values = []
      if (ts.isCallExpression(node) && node.expression.getText(sf) === 'copyExample' && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) {
        const key = node.arguments[0].text.replace(/\s+/g, ' ').trim()
        if (/[A-Za-z]/.test(key)) assert.ok(Object.hasOwn(copy, key), `${file}: missing explicit display/ARIA copy key ${key}`)
      }
      if (ts.isCallExpression(node) && node.expression.getText(sf) === 'copyExample' && node.arguments[0] && !ts.isStringLiteralLike(node.arguments[0])) values.push(...literals(node.arguments[0]))
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sf) === 'ExampleText') {
        for (const child of node.children) if (ts.isJsxExpression(child) && child.expression && !ts.isStringLiteralLike(child.expression)) values.push(...literals(child.expression))
      }
      for (const value of new Set(values)) {
        if (!/[A-Za-z]/.test(value) || retained.get(file)?.has(value)) continue
        const key = value.replace(/\s+/g, ' ').trim()
        assert.ok(Object.hasOwn(copy, key), `${file}: missing conditional display key ${key}`)
        assert.match(copy[key], /[\u3400-\u9fff]/, `${file}: untranslated conditional display key ${key}`)
        checked++
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
  assert.ok(checked > 100)
})

test('Trace preview text has Chinese copy or a specific raw-value retention', () => {
  const require = createRequire(new URL('../../package.json', import.meta.url))
  const ts = require('typescript')
  const root = path.resolve('packages/docs/src/showcase/examples/trace')
  const retained = JSON.parse(fs.readFileSync('packages/docs/tests/fixtures/showcase-copy-trace-literals.json', 'utf8'))
  const key = ({ file, text }) => `${file}\n${text}`
  const actual = []
  for (const file of fs.readdirSync(root).filter(name => /^c-trace-\d+\.tsx$/.test(name))) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const dictionarySource = fs.readFileSync(path.join(root, 'copy.generated.ts'), 'utf8')
    const copy = JSON.parse(dictionarySource.slice(dictionarySource.indexOf('{'), dictionarySource.lastIndexOf('}') + 1))
    function visit(node) {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sf) === 'ExampleText') {
        for (const child of node.children) {
          if (!ts.isJsxText(child)) continue
          const text = child.getText(sf).replace(/\s+/g, ' ').trim()
          if (/[A-Za-z]/.test(text) && !Object.hasOwn(copy, text)) actual.push({ file, text })
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
  for (const row of retained) assert.ok(row.reason.length >= 20, `Missing raw-value reason: ${key(row)}`)
  assert.deepEqual(actual.map(key).sort(), retained.map(key).sort(), 'Trace preview copy or raw-value retention drift')
})

test('fixed schema, tree leaf, phase task, step and slider label sets are closed over Chinese copy', () => {
  const require = createRequire(new URL('../../package.json', import.meta.url))
  const ts = require('typescript')
  const root = path.resolve('packages/docs/src/showcase/examples')
  const specs = [
    ['filters/c-filters-2.tsx', ['CORE', 'GENERIC', 'OBJECTS']],
    ['stepper/c-stepper-20.tsx', ['match', 'links', 'items'], ['label', 'name', 'title', 'step', 'severity', 'badge']],
    ['stepper/c-stepper-21.tsx', ['areas', 'statusLabels']],
    ['stepper/c-stepper-43.tsx', ['phases']],
    ['stepper/c-stepper-44.tsx', ['phases']],
    ['questionnaire/c-questionnaire-4.tsx', ['QUESTIONS']],
    ['questionnaire/c-questionnaire-2.tsx', ['WORKFLOWS', 'REVIEWERS', 'CADENCES'], ['label']],
    ['slider/c-slider-12.tsx', ['labels']],
    ['button-group/c-button-group-41.tsx', ['models'], ['tooltip']],
    ['button-group/c-button-group-42.tsx', ['orderTypes'], ['tooltip']],
    ['button-group/c-button-group-45.tsx', ['environments'], ['tooltip']],
    ['cascader/c-cascader-19.tsx', ['workflow'], ['hint']],
    ['file-type/c-file-type-13.tsx', ['FILES'], ['caption']],
    ['filters/c-filters-8.tsx', ['PLANS'], ['hint']],
    ['attachment/c-attachment-5.tsx', ['QUEUE'], ['note', 'detail']],
    ['file-type/c-file-type-5.tsx', ['FAMILY_NAMES'], [], true],
    ['file-type/c-file-type-6.tsx', ['FAMILY_LABELS'], [], true],
    ['dialog/c-dialog-9.tsx', ['shortcuts'], ['action']],
    ['dropdown-menu/c-dropdown-menu-11.tsx', ['notifications'], ['action', 'time']],
    ['item/c-item-12.tsx', ['activities'], ['action', 'time']],
    ['marker/c-marker-5.tsx', ['CHANGES'], ['kind']],
    ['popover/c-popover-2.tsx', ['sides'], [], false, 'array'],
    ['sheet/c-sheet-3.tsx', ['sides'], [], false, 'array'],
    ['tooltip/c-tooltip-2.tsx', ['sides'], [], false, 'titlecase-array'],
    ['signature-pad/c-signature-pad-9.tsx', ['INPUT_LABEL'], [], true],
    ['scroll-area/c-scroll-area-3.tsx', ['products'], ['support', 'api', 'backups', 'analytics', 'users']],
    ['table/c-table-1.tsx', ['invoices'], ['paymentMethod']],
    ['table/c-table-9.tsx', ['activities'], ['action']],
    ['table/c-table-11.tsx', ['products'], ['stockStatus']],
    ['table/c-table-12.tsx', ['apiKeys'], ['permissions']],
    ['table/c-table-13.tsx', ['files'], ['sharing']],
    ['table/c-table-15.tsx', ['leaders'], ['level']],
    ['timeline/c-timeline-6.tsx', ['pipelineSteps'], ['duration']],
    ['timeline/c-timeline-11.tsx', ['activities'], ['action']],
    ['sortable/c-sortable-3.tsx', ['defaultOptionGroups'], ['value']],
    ['sidebar/c-sidebar-1.tsx', ['DEPLOYMENTS'], ['time']],
    ['sidebar/c-sidebar-4.tsx', ['ACTIVITY'], ['time']],
    ['table/c-table-9.tsx', ['activities'], ['timestamp']],
    ['table/c-table-12.tsx', ['apiKeys'], ['lastUsed']],
    ['table/c-table-13.tsx', ['files'], ['modified']],
    ['timeline/c-timeline-4.tsx', ['*'], ['date']],
    ['timeline/c-timeline-10.tsx', ['*'], ['date']],
    ['timeline/c-timeline-11.tsx', ['activities'], ['date']],
    ['filters/c-filters-5.tsx', ['RANGE_PRESETS'], [], false, 'tuple-first'],
    ['input/c-input-22.tsx', ['getHint'], [], false, 'returns'],
    ['input/c-input-23.tsx', ['getStrengthText'], [], false, 'returns'],
    ['file-type/c-file-type-9.tsx', ['describe'], [], false, 'returns'],
    ['trace/c-trace-4.tsx', ['EXPLORER_CALLS', 'AGENTS'], ['name', 'title', 'description', 'result'], false, 'trace-display'],
    ['trace/c-trace-5.tsx', ['COUNT_WORDS'], ['plan', 'done'], false, 'trace-display'],
    ['trace/c-trace-5.tsx', ['VERBS'], [], false, 'trace-verbs'],
    ['trace/c-trace-7.tsx', ['LOOKUPS'], ['pending', 'running', 'done', 'finding'], false, 'trace-display'],
    ['trace/c-trace-9.tsx', ['JOBS'], ['title'], false, 'trace-display'],
    ['progress/c-progress-4.tsx', ['getStatusMessage'], [], false, 'returns'],
    ['slider/c-slider-8.tsx', ['getLabel'], [], false, 'returns'],
    ['kanban/c-kanban-1.tsx', ['COLUMN_TITLES'], [], true],
    ['kanban/c-kanban-2.tsx', ['COLUMN_TITLES'], [], true],
    ['alert-dialog/c-alert-dialog-10.tsx', ['*file*'], [], false, 'tuple-first'],
    ['questionnaire/c-questionnaire-1.tsx', ['*'], ['hint']],
    ['questionnaire/c-questionnaire-2.tsx', ['*'], ['hint']],
    ...[18,23,24,25,26,27,28,30,31,36,37,38,39,40,41,42].map((number) => [`stepper/c-stepper-${number}.tsx`, ['*'], ['summary', 'detail', 'caption', 'note']]),
  ]
  const technical = /^(?:3WIM|SKU|PayPal|Q[1-4]|USD|EUR|GBP|JPY|EMEA|APAC|LATAM|VIP|[\d.]+ (?:B|KB|MB|GB)|\d+(?:m|s)(?: ?\d+s)?)$/
  let checked = 0
  const failures = []
  const narrativeKeys = [], hintKeys = []
  for (const [relative, declarations, properties = ['label', 'name', 'title', 'step', 'severity'], objectValues, mode] of specs) {
    const source = fs.readFileSync(path.join(root, relative), 'utf8')
    const sf = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const copySource = fs.readFileSync(path.join(root, relative.split('/')[0], 'copy.generated.ts'), 'utf8')
    const copy = JSON.parse(copySource.slice(copySource.indexOf('{'), copySource.lastIndexOf('}') + 1))
    const keys = new Set()
    const add = (node) => {
      if (node && ts.isStringLiteralLike(node)) keys.add(mode === 'titlecase-array' ? node.text[0].toUpperCase() + node.text.slice(1) : node.text)
      else if (node && ts.isConditionalExpression(node)) { add(node.whenTrue); add(node.whenFalse) }
    }
    function values(node) {
      if (mode === 'returns' && ts.isReturnStatement(node)) add(node.expression)
      if (ts.isPropertyAssignment(node) && properties.includes(node.name.getText(sf))) {
        add(node.initializer)
        if (ts.isArrayLiteralExpression(node.initializer)) node.initializer.elements.forEach(add)
        if (mode === 'trace-display' && ts.isObjectLiteralExpression(node.initializer)) node.initializer.properties.forEach(property => {
          if (ts.isPropertyAssignment(property)) add(property.initializer)
        })
      }
      if (ts.isArrayLiteralExpression(node)) {
        if (mode === 'trace-verbs') node.elements.forEach(add)
        if (mode === 'tuple-first' && node.elements[0] && ts.isStringLiteralLike(node.elements[0])) add(node.elements[0])
        if (mode?.includes('array')) node.elements.forEach(add)
        if (['match', 'labels'].includes(node.parent.name?.getText(sf)) || ['items', 'tasks'].includes(node.parent.name?.getText(sf))) node.elements.forEach(add)
        const type = node.elements[1]
        if (type && ts.isStringLiteralLike(type) && ['text', 'select', 'number', 'boolean', 'multiselect'].includes(type.text)) {
          add(node.elements[0])
          const options = node.elements[2]
          if (options && ts.isArrayLiteralExpression(options)) options.elements.forEach(add)
        }
      }
      if (ts.isCallExpression(node) && node.expression.getText(sf) === 'toOptions' && node.arguments[0] && ts.isArrayLiteralExpression(node.arguments[0])) node.arguments[0].elements.forEach(add)
      ts.forEachChild(node, values)
    }
    function visit(node) {
      if (mode === 'returns' && ts.isFunctionDeclaration(node) && node.name && declarations.includes(node.name.text)) values(node.body)
      if (ts.isVariableDeclaration(node) && (declarations.includes('*') || declarations.includes(node.name.getText(sf))) && node.initializer) {
        const initializer = ts.isAsExpression(node.initializer) ? node.initializer.expression : node.initializer
        values(initializer)
        if (node.name.getText(sf) === 'OBJECTS' && ts.isObjectLiteralExpression(initializer)) for (const property of initializer.properties) keys.add(property.name.getText(sf).replace(/^['"]|['"]$/g, ''))
        if (objectValues && ts.isObjectLiteralExpression(initializer)) for (const property of initializer.properties) add(property.initializer)
        if (node.name.getText(sf) === 'statusLabels') for (const property of node.initializer.expression.properties) add(property.initializer)
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
    if (declarations.includes('*file*')) values(sf)
    function auditedFields(node) {
      if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.initializer)) {
        if (/stepper\/c-stepper-(18|23|24|25|26|27|28|30|31|36|37|38|39|40|41|42)\.tsx/.test(relative) && ['summary','detail','caption','note'].includes(node.name.getText(sf))) narrativeKeys.push(node.initializer.text)
        if (/questionnaire\/c-questionnaire-[12]\.tsx/.test(relative) && properties.includes('hint') && node.name.getText(sf) === 'hint') hintKeys.push(node.initializer.text)
      }
      ts.forEachChild(node, auditedFields)
    }
    auditedFields(sf)
    for (const key of keys) {
      if (!/[A-Za-z]/.test(key) || technical.test(key)) continue
      if (!Object.hasOwn(copy, key)) failures.push(`${relative}: missing fixed display label ${key}`)
      else if (!/[\u3400-\u9fff]/.test(copy[key])) failures.push(`${relative}: untranslated fixed display label ${key}`)
      checked++
    }
  }
  assert.ok(checked > 100)
  assert.deepEqual(failures, [])
  const digest = (keys) => createHash('sha256').update(JSON.stringify([...new Set(keys)].sort())).digest('hex')
  assert.equal(narrativeKeys.length, 77)
  assert.equal(digest(narrativeKeys), '5ce6d37c79f3f2e8774db075e099a575f30eced109a8e201767c8ccb8d879581')
  assert.equal(hintKeys.length, 15)
  assert.equal(digest(hintKeys), '451c094e58d0a78e223100c57f4c2ed4eea4443c8616b28276c9c2a3855228e7')
  for (const [relative, keys] of [
    ['questionnaire/c-questionnaire-5.tsx', ['Skipped']],
    ['stepper/c-stepper-36.tsx', ['Done', 'Pending', 'Rail', '+1 day']],
    ['questionnaire/c-questionnaire-5.tsx', ['Not answered']],
    ['questionnaire/c-questionnaire-6.tsx', ['A region you manage is available on Enterprise. Pick another plan, or change the region.']],
    ['stepper/c-stepper-41.tsx', ['completed', 'upcoming']],
    ['sonner/c-sonner-4.tsx', ['Processing...']],
    ['sortable/c-sortable-8.tsx', ['Could not save the new order. Restored.']],
    ['signature-pad/c-signature-pad-3.tsx', ['Unnamed signer']],
  ]) {
    const source = fs.readFileSync(path.join(root, relative), 'utf8')
    const copySource = fs.readFileSync(path.join(root, relative.split('/')[0], 'copy.generated.ts'), 'utf8')
    const copy = JSON.parse(copySource.slice(copySource.indexOf('{'), copySource.lastIndexOf('}') + 1))
    for (const key of keys) {
      assert.ok(source.includes(JSON.stringify(key)), `${relative}: audited state key moved: ${key}`)
      assert.match(copy[key] ?? '', /[\u3400-\u9fff]/, `${relative}: missing state display key ${key}`)
    }
  }
  const fixed = JSON.parse(fs.readFileSync(path.resolve('packages/docs/tests/fixtures/showcase-copy-fixed-display-keys.json'), 'utf8'))
  for (const { file, keys, evidence } of fixed) {
    assert.ok(evidence)
    const sf = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const literals = new Set()
    function collect(node) { if (ts.isStringLiteralLike(node)) literals.add(node.text); ts.forEachChild(node, collect) }
    collect(sf)
    const copySource = fs.readFileSync(path.join(root, file.split('/')[0], 'copy.generated.ts'), 'utf8')
    const copy = JSON.parse(copySource.slice(copySource.indexOf('{'), copySource.lastIndexOf('}') + 1))
    for (const key of keys) {
      assert.ok(literals.has(key), `${file}: audited fixed display key moved: ${key}`)
      assert.match(copy[key] ?? '', /[\u3400-\u9fff]/, `${file}: missing fixed display key ${key}`)
    }
  }
})

test('public display props use explicit current-language copy at their consumer boundary', () => {
  const require = createRequire(new URL('../../package.json', import.meta.url))
  const ts = require('typescript')
  const root = path.resolve('packages/docs/src/showcase/examples')
  const targets = new Map([
    ['date-selector/c-date-selector-1.tsx', new Set(['inputHint'])],
    ['date-selector/c-date-selector-2.tsx', new Set(['inputHint'])],
    ['filters/c-filters-7.tsx', new Set(['emptyMessage'])],
    ['filters/c-filters-10.tsx', new Set(['emptyMessage'])],
    ...Array.from({ length: 8 }, (_, index) => [`command/c-command-${index + 1}.tsx`, new Set(['heading'])]),
  ])
  let checked = 0
  for (const [file, attributes] of targets) {
    const sf = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const copySource = fs.readFileSync(path.join(root, file.split('/')[0], 'copy.generated.ts'), 'utf8')
    const copy = JSON.parse(copySource.slice(copySource.indexOf('{'), copySource.lastIndexOf('}') + 1))
    let found = 0
    function visit(node) {
      if (ts.isJsxAttribute(node) && attributes.has(node.name.getText(sf))) {
        assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${file}: untranslated display prop ${node.name.getText(sf)}`)
        const expression = node.initializer.expression
        assert.ok(expression && ts.isCallExpression(expression) && expression.expression.getText(sf) === 'copyExample' && ts.isStringLiteralLike(expression.arguments[0]), `${file}: display prop must use explicit copy`)
        const key = expression.arguments[0].text
        assert.match(copy[key] ?? '', /[\u3400-\u9fff]/, `${file}: missing display prop copy ${key}`)
        found++; checked++
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
    assert.ok(found > 0, `${file}: audited display prop disappeared`)
  }
  assert.ok(checked >= 19)
})
