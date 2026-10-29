import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const out = join(root, 'dist', 'glass-icons')
const generated = join(root, 'dist', '.glass-icons-source')
const assets = join(root, 'glass-icons')
const require = createRequire(import.meta.url)

await rm(join(root, 'dist'), { recursive: true, force: true })
await mkdir(generated, { recursive: true })
await mkdir(out, { recursive: true })
await copyFile(join(root, 'src', 'create-glass-icon.ts'), join(generated, 'runtime.ts'))
const files = (await readdir(assets)).filter((file) => file.endsWith('.svg')).sort()
const exports = ["export type { GlassIconColor, GlassIconProps } from './runtime.js'"]
for (const file of files) {
  const name = file.slice(0, -4)
  const symbol = name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('') + 'Icon'
  const svg = await readFile(join(assets, file), 'utf8')
  const markup = svg.replace(/^\s*<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  if (markup === svg) throw new Error(`Invalid SVG root: ${file}`)
  await writeFile(join(generated, `${name}.ts`), `import { createGlassIcon } from './runtime.js'\n\nexport const ${symbol} = /*#__PURE__*/ createGlassIcon(${JSON.stringify(markup)})\n`)
  exports.push(`export { ${symbol} } from './${name}.js'`)
  await copyFile(join(assets, file), join(out, file))
  await writeFile(join(out, `${file}.d.ts`), 'declare const url: string\nexport default url\n')
}
await writeFile(join(generated, 'index.ts'), `${exports.join('\n')}\n`)
await writeFile(join(generated, 'tsconfig.json'), JSON.stringify({
  extends: '../../tsconfig.json',
  compilerOptions: {
    noEmit: false,
    declaration: true,
    rootDir: '.',
    outDir: '../glass-icons',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
  },
  include: ['*.ts'],
}))
const tsc = require.resolve('typescript/bin/tsc')
const result = spawnSync(process.execPath, [tsc, '-p', join(generated, 'tsconfig.json')], { cwd: root, stdio: 'inherit' })
if (result.status !== 0) throw new Error(`TypeScript build failed: ${result.status ?? result.error}`)
await rm(generated, { recursive: true, force: true })
