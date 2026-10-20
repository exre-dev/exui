import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
const require = createRequire(path.resolve('packages/docs/package.json'))
const ts = require('typescript'), React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const packageRoot = fs.realpathSync('packages/docs/node_modules/@exre/exui')
const metadata = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
const exui = await import(pathToFileURL(path.resolve(packageRoot, metadata.exports['.'].import)).href)
const cache = new Map()
const treeConfigs = []
function load(file, rewrite = (source) => source, cacheKey = file) {
  if (cache.has(cacheKey)) return cache.get(cacheKey)
  const exports = {}; cache.set(cacheKey, exports)
  const code = ts.transpileModule(rewrite(fs.readFileSync(file, 'utf8')), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023, jsx: ts.JsxEmit.ReactJSX } }).outputText
  new Function('require', 'exports', code)((name) => {
    if (name === '@exre/exui') return exui
    if (name === '@headless-tree/react') {
      const module = require(name)
      return { ...module, useTree(config) { treeConfigs.push(config); return module.useTree(config) } }
    }
    if (name.startsWith('.')) {
      const target = path.resolve(path.dirname(file), name)
      const found = [target, target + '.ts', target + '.tsx'].find((entry) => fs.existsSync(entry) && fs.statSync(entry).isFile())
      if (found) return load(found)
    }
    return require(name)
  }, exports)
  return exports
}
const root = path.resolve('packages/docs/src/showcase')
const runtime = load(path.join(root, 'examples/_shared/example-runtime.tsx'))
const { formatExampleTemplate } = load(path.join(root, 'examples/_shared/example-copy-format.ts'))
const { LanguageContext } = load(path.join(root, 'language.ts'))

test('explicit template formatting never translates or recursively expands user parameters', () => {
  assert.equal(typeof formatExampleTemplate, 'function')
  const user = 'Design review $& {count}\n原文'
  assert.equal(formatExampleTemplate('User {name}: {count}', { name: user, count: 0 }), 'User Design review $& {count}\n原文: 0')
  assert.throws(() => formatExampleTemplate('Line {line}', {}), /line/)
})
test('real runtime SSR translates only the template and preserves English/Chinese values and spacing', () => {
  const dictionary = { 'Meeting at {time}': '会议时间：{time}', 'Design review': '设计评审' }
  function Probe() {
    const { format } = runtime.useExampleRuntime()
    assert.equal(typeof format, 'function')
    return React.createElement('p', null, format('Meeting at {time}', { time: 'Design review' }))
  }
  const render = (language) => renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language, setLanguage() {} } }, React.createElement(runtime.ExampleRuntimeProvider, { dictionary }, React.createElement(Probe))))
  assert.equal(render('en'), '<p>Meeting at Design review</p>')
  assert.equal(render('zh-CN'), '<p>会议时间：Design review</p>')
})

function renderScene(relative, language) {
  const Scene = load(path.join(root, 'examples', relative)).default
  return renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language, setLanguage() {} } }, React.createElement(exui.TooltipProvider, null, React.createElement(Scene))))
}
test('real TimePicker and Carousel SSR expose translated dynamic display and numbered image names', () => {
  assert.match(renderScene('time-picker/c-time-picker-1.tsx', 'en'), /Meeting at 14:30/)
  assert.match(renderScene('time-picker/c-time-picker-1.tsx', 'zh-CN'), /会议时间：14:30/)
  assert.match(renderScene('carousel/c-carousel-1.tsx', 'en'), /alt="Slide 1"/)
  assert.match(renderScene('carousel/c-carousel-1.tsx', 'zh-CN'), /alt="幻灯片 1"/)
})
test('real FileType queue SSR keeps original filenames inside translated state and action names', () => {
  const html = renderScene('file-type/c-file-type-8.tsx', 'zh-CN')
  assert.match(html, /已上传 1\/4 个文件，1 个失败/)
  assert.match(html, /aria-label="正在上传 q4-forecast.xlsx"/)
  assert.match(html, /aria-label="重试上传 brand-assets.zip"/)
  assert.match(html, /aria-label="取消上传 onboarding-walkthrough.mov"/)
})
test('real upload toast content SSR translates progress while leaving filename and percentage unchanged', () => {
  const { UploadToast } = load(path.join(root, 'examples/sonner/c-sonner-10.tsx'), (source) => source.replace('function UploadToast(', 'export function UploadToast('))
  const dictionary = load(path.join(root, 'examples/sonner/copy.generated.ts')).default
  const render = (progress) => renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language: 'zh-CN', setLanguage() {} } }, React.createElement(runtime.ExampleRuntimeProvider, { dictionary }, React.createElement(UploadToast, { progress }))))
  assert.match(render(37), /正在上传\.\.\. 37%/)
  assert.match(render(100), /完成<\/p>/)
  assert.match(render(37), /report-q4-2025.pdf/)
})

test('indirect attachment and duration copy reaches actual public SSR', () => {
  assert.match(renderScene('attachment/c-attachment-2.tsx', 'zh-CN'), /已附加 3\/6 个文件/)
  assert.match(renderScene('attachment/c-attachment-5.tsx', 'zh-CN'), /title="[^"]*（[^"]*）"/)
  assert.match(renderScene('time-picker/c-time-picker-8.tsx', 'en'), /Duration: 1 h/)
  assert.match(renderScene('time-picker/c-time-picker-8.tsx', 'zh-CN'), /时长：1 小时/)
  assert.match(renderScene('time-picker/c-time-picker-13.tsx', 'en'), /Wed, Oct 14 at 09:00/)
  assert.match(renderScene('time-picker/c-time-picker-13.tsx', 'zh-CN'), /10月14日（周三）09:00/)
})

test('actual tree callbacks update row ARIA on the same Headless instance without losing expansion', () => {
  const { createTree } = require('@headless-tree/core')
  renderScene('tree/c-tree-1.tsx', 'en')
  const english = treeConfigs.at(-1)
  renderScene('tree/c-tree-1.tsx', 'zh-CN')
  const chinese = treeConfigs.at(-1)
  const tree = createTree(english)
  tree.setMounted(true)
  tree.rebuildTree()
  const item = tree.getItemInstance('leads')
  const expanded = [...tree.getState().expandedItems]
  assert.equal(item.getProps()['aria-label'], 'Leads')
  tree.setConfig({ ...tree.getConfig(), getItemName: chinese.getItemName })
  assert.equal(tree.getItemInstance('leads'), item)
  assert.equal(item.getProps()['aria-label'], '潜在客户')
  assert.deepEqual(tree.getState().expandedItems, expanded)
  renderScene('stepper/c-stepper-20.tsx', 'zh-CN')
  const failed = treeConfigs.at(-1)
  assert.match(failed.getItemName({ getItemData: () => ({ name: 'Document validation', status: 'failed', issues: 1 }) }), /失败，1 个问题/)
  renderScene('stepper/c-stepper-21.tsx', 'zh-CN')
  const findings = treeConfigs.at(-1)
  assert.match(findings.getItemName({ getItemData: () => ({ name: 'Review', count: 2, severity: 'High', first: 0, last: 0 }) }), /严重程度：高/)
})

test('canonical scheduled and questionnaire state renders in both languages without changing stored keys', () => {
  const renderFixture = (relative, language, rewrite, cacheKey) => {
    const Scene = load(path.join(root, 'examples', relative), rewrite, cacheKey).default
    return renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language, setLanguage() {} } }, React.createElement(exui.TooltipProvider, null, React.createElement(Scene))))
  }
  const scheduled = (source) => source.replace('useState<string | null>(null)', 'useState<string | null>("Wed, Oct 14 at 09:00")')
  assert.match(renderFixture('time-picker/c-time-picker-13.tsx', 'en', scheduled, 'scheduled-scene'), /Scheduled for/)
  assert.match(renderFixture('time-picker/c-time-picker-13.tsx', 'zh-CN', scheduled, 'scheduled-scene'), /10月14日（周三）09:00/)
  assert.match(renderFixture('time-picker/c-time-picker-13.tsx', 'zh-CN', scheduled, 'scheduled-scene'), /计划时间/)
  const completed = (source) => source.replace('useState<string | null>(null)', 'useState<string | null>("warehouse")')
  const en = renderFixture('questionnaire/c-questionnaire-4.tsx', 'en', completed, 'completed-scene')
  const zh = renderFixture('questionnaire/c-questionnaire-4.tsx', 'zh-CN', completed, 'completed-scene')
  assert.match(en, /A warehouse table/)
  assert.doesNotMatch(zh, /warehouse table/)
  assert.match(zh, /流水线/)
})

test('reaction display metadata translates tone and count while canonical labels stay intact', () => {
  const en = renderScene('emoji-picker/c-emoji-picker-3.tsx', 'en')
  const zh = renderScene('emoji-picker/c-emoji-picker-3.tsx', 'zh-CN')
  assert.match(en, /aria-label="thumbs up, Medium skin tone, 2 reactions"/)
  assert.match(zh, /aria-label="赞，中等肤色，2 个回应"/)
  assert.match(zh, /Amara Okafor/)
  assert.doesNotMatch(zh, / and you/)
})

test('a newly selected emoji resolves from current public locale data after language changes', async () => {
  const originalFetch = globalThis.fetch
  const url = '/examples/reui/emoji/emojibase-data-17.0.0'
  globalThis.fetch = async (input) => {
    const pathname = new URL(typeof input === 'string' ? input : input.url, 'http://local.test').pathname
    const file = path.resolve('packages/docs/public', '.' + pathname)
    return fs.existsSync(file) ? new Response(fs.readFileSync(file), { status: 200 }) : new Response('', { status: 404 })
  }
  let english, chinese
  try {
    [english, chinese] = await Promise.all(['en', 'zh'].map((locale) => exui.loadEmojiPickerData({ locale, url })))
  } finally { globalThis.fetch = originalFetch }
  const canonical = { emoji: '🐳', label: '🐳', people: [], mine: true, tone: 0 }
  const Scene = load(path.join(root, 'examples/emoji-picker/c-emoji-picker-3.tsx'), (source) => source.replace('useState(INITIAL_REACTIONS)', `useState(${JSON.stringify([canonical])})`), 'new-reaction-scene').default
  const render = (language) => renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language, setLanguage() {} } }, React.createElement(exui.TooltipProvider, null, React.createElement(Scene))))
  const enLabel = exui.findEmoji(english.emojis, canonical.emoji).label
  const zhLabel = exui.findEmoji(chinese.emojis, canonical.emoji).label
  assert.notEqual(enLabel, zhLabel)
  assert.match(zhLabel, /[\u3400-\u9fff]/)
  assert.ok(render('en').includes(`aria-label="${enLabel}, 1 reaction"`))
  assert.ok(render('zh-CN').includes(`aria-label="${zhLabel}，1 个回应"`))
  assert.deepEqual(canonical, { emoji: '🐳', label: '🐳', people: [], mine: true, tone: 0 })
})

function renderStateFixture(relative, binding, value, language) {
  const file = path.join(root, 'examples', relative)
  const rewrite = (source) => {
    const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    let initial
    function visit(node) {
      if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.name.elements[0]?.getText(sf) === binding && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(sf) === 'useState') initial = node.initializer.arguments[0]
      ts.forEachChild(node, visit)
    }
    visit(sf)
    assert.ok(initial, `${relative}: missing state fixture boundary ${binding}`)
    return source.slice(0, initial.getStart(sf)) + JSON.stringify(value) + source.slice(initial.end)
  }
  const Scene = load(file, rewrite, `${file}:${binding}:${JSON.stringify(value)}`).default
  return renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value: { language, setLanguage() {} } }, React.createElement(exui.TooltipProvider, null, React.createElement(Scene))))
}

test('questionnaire completion translates original choice labels before English casing', () => {
  const result = { workflows: ['Daily digest'], reviewer: 'Whoever wrote the change', cadence: 'Every weekday morning' }
  const en = renderStateFixture('questionnaire/c-questionnaire-2.tsx', 'result', result, 'en')
  const zh = renderStateFixture('questionnaire/c-questionnaire-2.tsx', 'result', result, 'zh-CN')
  assert.match(en, /whoever wrote the change/)
  assert.match(en, /every weekday morning/)
  assert.doesNotMatch(zh, /whoever wrote the change|every weekday morning/)
  assert.match(zh, /审核人：/)
  assert.match(zh, /发送频率：/)
  assert.equal(result.reviewer, 'Whoever wrote the change')
})

test('only an empty signature name uses translated fallback, including an exact English-name collision', () => {
  const blank = renderStateFixture('signature-pad/c-signature-pad-3.tsx', 'submitted', { name: '', size: 1024 }, 'zh-CN')
  assert.match(blank, /未署名签署人/)
  for (const name of ['Unnamed signer', 'Design review {name}']) {
    const html = renderStateFixture('signature-pad/c-signature-pad-3.tsx', 'submitted', { name, size: 1024 }, 'zh-CN')
    assert.ok(html.includes(name))
    assert.doesNotMatch(html, /未署名签署人/)
  }
})
