# 公共包的入口与构建边界

最后更新：2026-10-28

## 源码布局

```text
packages/components/
├── components.json           shadcn/ui 生成配置（style: radix-luma，baseColor: olive，别名 @/*）
├── upstream/reui/            已提交的 manifest、许可、导出清单与适配补丁；忽略的原始源/样式缓存
├── index.ts 等价物 → src/index.ts
└── src/
    ├── index.ts              唯一公共导出汇总
    ├── index.css             组件样式表源，最终产出 dist/index.css
    ├── docs/theme.css        Fumadocs UI 主题契约源，最终产出 dist/docs/theme.css
    ├── components/
    │   ├── theme-provider.tsx
    │   ├── ui/*.tsx          ReUI 基础组件的 ExUI 适配
    │   ├── reui/            ReUI 复用组件适配
    │   └── patterns/         保留的 ExUI Form 等模式组件
    ├── hooks/               基础与表单 hooks
    ├── lib/forms/           表单状态与校验
    └── lib/utils.ts
```

基础可复用组件位于 `src/components/ui`，复杂 ReUI 组件位于 `src/components/reui`。表单模式组件位于 `src/components/patterns`，同源 hooks 位于 `src/hooks`，状态与校验边界位于 `src/lib/forms`；详见 [表单结构](forms.md)。固定的 ReUI revision 为 `067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a`，样式为 `radix-luma`，图标为 Lucide。库存覆盖 148 份原始源、82 个 ReUI 模块、4 个 hooks、62 份基础组件源；公开根入口新增导出 1102 个符号。上游 `form` 条目没有文件，以 ExUI Form 补足。`c-*` 示例和 Pro 组件不在当前公开面。`controls`、`layouts` 目录尚未建立。

构建与维护使用受版本控制的 `upstream/reui/inventory.json` 读取库存，不依赖本地开发笔记；可选参考归档也不是构建输入。

## 公开入口

`exports` 显式列出组件、Token、主题及图标集合入口；仅 SVG 资源使用限定在图标集内的路径模式：

| 入口 | 产物 | 契约 |
| --- | --- | --- |
| `@exre/exui` | `dist/exui.js` + `types/index.d.ts` | ESM only；React 19；需要 React 与 React DOM 在宿主中存在 |
| `@exre/exui/style.css` | `dist/index.css` | 完整组件样式，已内含 Token 变量与字体 |
| `@exre/exui/tokens` | `dist/tokens/index.js`（import）/ `dist/tokens/cjs/index.js`（require），各自绑定对应种类的声明 | 无 React 运行时与类型依赖 |
| `@exre/exui/tokens/style.css` | `dist/tokens/style.css` | 仅 Token 变量，保留三套主题 |
| `@exre/exui/tokens/font.css` | `dist/tokens/font.css` | 可选字体，资源可解析 |
| `@exre/exui/docs/theme.css` | `dist/docs/theme.css` | 未预编译的三条固定顺序 `@import`；要求消费者自装 `fumadocs-ui`，包不声明任何依赖 |
| `@exre/exui/icons/glass-icons` | `dist/icons/glass-icons/index.js` + `index.d.ts` | 独立 ESM React 图标集合，不引入主库或 CSS |
| `@exre/exui/icons/glass-icons/*.svg` | 对应 SVG + `.svg.d.ts` | 透明静态资源，打包器解析为 URL |

图标的私有源码、生成和复制所有权见 [Glass 图标](../icons/glass-icons.md)。

React 与 React DOM 是**可选 peer**，范围 `>=19.0.0 <20`，`peerDependenciesMeta.optional` 为 `true`。包不会代装它们；tokens-only 消费者不需要它们。`@exre/exui/docs/theme.css` 面向消费者自己的 Fumadocs 安装，manifest 中不出现 `fumadocs-ui`，理由与边界见 [[components/03-docs-theme-subpath]]。入口形状与依赖排除由 `scripts/package-contract.mjs` 的 `requireExportsEntry` / `assertPublishableManifest` 逐项锁死，任何尝试改动都会在 `pnpm verify:pack` 阶段失败。

包内还随 tarball 附带 `src/`（`files` 字段包含 `src/components`、`src/docs`、`src/hooks`、`src/lib`、`src/index.css`、`src/index.ts`）供参考与既有工具复制源码使用，但支持的消费边界只有 `exports`；复制源码的消费者自行承担第三方源码依赖。

## 导出汇总

`src/index.ts` 汇总三层：

- `src/components/theme-provider.tsx` 以**显式命名导出**给出 `ThemeProvider` 与 `useTheme`，不使用 `export *`。
- 既有基础组件与 `src/hooks/use-mobile`、`src/lib/utils` 维持逐文件公开；`Questionnaire` 在 `src/index.ts` 手写基础组件转发，其基础文件覆盖由 `packages/components/tests/upstream/reui-exports.test.mjs` 检查。ReUI 组件、4 个共享 hooks 与公开类型的显式根导出由 `scripts/reui-exports.mjs` 和 `upstream/reui/public-exports.json` 校验。与既有名称冲突的导出使用清单中的 `Reui` 前缀，私有 Context 值不公开。
- 表单组件、同源 hooks 和公开类型采用显式命名导出；私有 Context、协调器、绑定适配器与导航入口不从根公开。
- 全局通知入口由 Sonner 适配文件转发公开；实例和任务归属见 [`notifications`](notifications.md)。

新增或升级 ReUI 组件时必须同步库存、适配源、公开导出清单和 `src/index.ts`。`scripts/reui-sync.mjs --check` 比对原始源与适配哈希，`scripts/reui-foundation-diff.mjs --check` 校验基础文件的补丁，`scripts/reui-exports.mjs --check` 校验公开面。`--update` 是显式维护模式：先验证再写入，默认保留已有 ReUI 与基础 UI 适配、重写共享 source hooks，并重记当前适配哈希；它产生待审差异，不代表人工批准。`--accept-adapters` 可单独重记适配哈希，`--rebase-upstream` 会替换 `registry-json-luma` 类 ReUI 适配，需审查替换结果。

`upstream/reui/source/` 与 `style-luma.css` 是可重建的本地缓存，不进入 Git；manifest、许可证、公开清单与适配补丁仍受版本控制。`scripts/reui-restore.mjs` 按 manifest 的固定 GitHub revision 下载缺失项，并以源码哈希和 `assets` 中的许可/样式哈希校验；已有内容不匹配时失败，不自动覆盖。完整缓存不访问网络；显式 `EXUI_REUI_CHECKOUT` 可从本地 Git 对象读取相同 revision，恢复与更新均不再依赖个人临时目录。所有下载完成并通过锁定哈希后才写入，恢复操作不改写已审适配及清单。维护入口为 `node scripts/reui-restore.mjs` / `pnpm check`；组件 `build`、源码对照和样式校验入口会先补齐缓存。

## 样式表源

`src/index.css` 导入 `tailwindcss`、`tw-animate-css`、`shadcn/tailwind.css`、内部工作区的 `font.css` 与 `style.css`（构建期内联），以及 `./glass.css`、`./form.css` 和生成的 `./reui-luma.css`。随后用 `@custom-variant dark (&:is(.dark *))` 定义暗色变体，用 `@theme inline` 把短变量名映射为 Tailwind 的 `--color-*`，使工具类能读到 Token。`scripts/generate-reui-luma.mjs --check` 保证选用的 Luma 规则与组件 class 标记闭合。

manifest 中的 `radix-luma` 标识固定上游快照，基础 UI 仍允许独立的 ExUI 视觉适配。`Accordion` 的 Nova 视觉规则直接放在该组件的局部工具类中，不额外引入 Nova 全局样式；其上游身份与检查流程继续使用同一快照和适配补丁。消费约定见 [`Accordion appearance`](../../../skills/exui/references/exui/setup.md#accordion-appearance)。

`Input` 保留 Luma 在默认、悬停和禁用状态下的透明描边，但保留 1px 边框占位，避免尺寸变化；聚焦和无效状态仍使用 ExUI 的表单控件边框与阴影 Token。透明色与状态颜色均使用同一组任意属性工具类：`[border-color:transparent]` 避免消费应用更高样式层中的通用 `border-transparent` 覆盖公共包的聚焦和无效状态。此适配只作用于 `Input`，不改变供其他控件共享的表单 Token。消费说明由 `input-appearance` 能力片段同步至双语文档与消费 skill。

`package.json` 的 `sideEffects` 把 `*.css` 与 `src/index.css` 标为有副作用，避免打包器在树摇时丢掉样式导入。

## 构建边界

`vite.config.ts` 以库模式构建，入口 `src/index.ts`，输出 `dist/exui.js`、`dist/index.css` 与 `dist/bundled-modules.json`，格式仅 ESM。

外部化判定 `isHostRuntime` 只放行 `react`、`react-dom` 及其子路径（前缀匹配而非包含匹配，避免误放 `react-is`、`react-day-picker`、`react-resizable-panels` 等同样以 `react` 开头的包）。其余实现库全部被打进产物，原因见 [[components/01-bundle-implementation-dependencies]]。

两个自定义插件承担产物完整性：

- `externalRequireToImport`：把被打包的 CommonJS 模块里对宿主运行时的 `require("react"…)` 改写成注入的 ESM 命名空间导入，否则 Rolldown 的 ESM 输出会残留运行期 `require` 调用。判定条件要求文件确实形如 CommonJS，避免改写字符串或注释里出现 `require` 的 ESM 文件。
- `recordBundledModules`：在 `generateBundle` 阶段遍历 chunk 的模块图，回溯每个模块归属的包并记录真实版本，输出 `dist/bundled-modules.json`，供第三方 notices 覆盖实际打进产物的代码而非声明的依赖树。

## Fumadocs 主题契约的放置

`dist/docs/theme.css` 与 `types/docs/theme.css.d.ts` 由 `scripts/build-docs-theme.mjs` 生成，它是 **`build:types` 链的一步**，紧跟 `fix-css-dts.mjs`，排在 `bundle-types.mjs` 之前。

位置由所有权决定：`clean-types.mjs` 是 `build:types` 的第一步，会整体删除 `types/`，所以任何在 `types/` 里产出声明的步骤都必须是同一条链的一部分。把它放进 `build` 会留下一个只在特定顺序下发作的缺口——`pnpm typecheck` 会单独调用 `build:types`，把声明删掉且不再补回，`verify:pack` 随后报打包产物缺文件。注意 CI 的顺序是 `typecheck` → `build` → `verify:pack`，**恰好掩盖**这个缺口，所以它不会被 CI 自动拦住。

排在 `bundle-types.mjs` 之前，则让新声明进入声明整合的最终边界检查。

拷贝是逐字节的，因此源文件在 `.gitattributes` 里钉死 `eol=lf`，避免 CI 的 autocrlf 让产物字节随平台变化。三条 `@import` 的顺序由 `scripts/docs-theme-contract.mjs` 导出为单一常量，放置步骤与 `check-dist.mjs` 都读它，构建期与产物期不会各写一份而漂移。

## 声明产物

`build:types` 依次执行：`clean-types` → `tsc -p tsconfig.lib.json`（`emitDeclarationOnly` 到 `types/`）→ `tsc-alias`（把 `@/*` 别名改写成相对路径）→ `fix-css-dts` → `build-docs-theme` → `bundle-types`。最终 `types/index.d.ts` 与 `types/index.css.d.ts` 是入口，`types/vendor/` 承载内部化后的第三方类型。

目标是根声明只依赖包内声明、标准 TypeScript 类型与 React / React DOM 类型：不残留 `radix-ui`、`recharts` 等裸模块引用，也不借助 `any`、削减 props 或 ambient 空壳绕过检查。打包消费者门禁以 `skipLibCheck: false` 编译 React 消费者来验证这一点。

## 构建后检查

`check-dist.mjs` 在构建末尾扫描 `dist/` 与 `types/`：检查期望产物是否存在，并用 `module-specifiers.mjs` 抽取裸模块说明符，确保产物中没有解析不了的第三方导入。`generate-notices.mjs` 依据 `bundled-modules.json` 生成 `dist/third-party-notices.md`。

## 根字号尺寸边界

`lib/rem.ts` 与 `hooks/use-root-rem.ts` 是私有数字长度边界：按 document 共享1rem探针、ResizeObserver 与根元素属性观察，最后一个订阅者离开时移除。服务端及 hydration 首帧使用16px，挂载后按 owner ref 的 document 更新；无 ref 时使用执行环境的 document。CSS 可表达的尺寸直接用 rem，不为它们添加测量状态。规则及理由见 [[../../decisions/tokens/01-rem-scalable-lengths]]。

`lib/recharts.tsx` 在同一内置 Recharts 实例上适配 XAxis/YAxis/CartesianAxis 默认 UI 几何、Tooltip 和 Legend；`lib/tanstack-table.ts` 保留完整命名空间并包装 `useTable` 与 `createTableHook/useAppTable` 的默认列尺寸。TanStack v9 按 columns 身份缓存列定义，更新默认尺寸时需同步使此缓存失效。非 React 的 `constructTable` 保持上游像素默认值；表模型 hook 本身没有 DOM owner 参数，不能把任意跨 document portal 的归属当作已支持。

`third-party.css` 只覆盖 ExUI Toaster 和默认图例的尺寸。Sonner 的数字 gap 在封装层换算，调用方 style/toastOptions 合并；Resizable 缓存首次命中区对象，封装层更新自有对象以保持已有面板状态。InputOTP 私有密码管理器兼容分支的40px预留、18px探测没有可维护参数，仍是明确边界。`docs/theme.css` 在该入口适配 Fumadocs 已命名的位移动画与滚动条，其余预设与版本由消费者持有。
