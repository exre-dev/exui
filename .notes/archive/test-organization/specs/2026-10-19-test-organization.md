# 测试归档、统一入口与价值审查

状态：2026-10-19 已完成实现与本地分段验收。不新增 tooling 工作区，仓库工具测试归入 `packages/components/tests/tooling/`。最终结果和中断边界见 [验收报告](../completion.md)；下文审查盘点描述实施前的工作区。

## 用户要求与完成标准

1. 测试统一放在所属子包的 `tests/`；测试夹具、截图基线和专用消费者验证器一起归档。
2. 根目录提供一个完整、可发现的 `pnpm test` 入口；支持子包和单文件的定向运行。
3. 保留能防止真实回归的测试；删除重复执行、已退出生产的外壳断言和只锁定源码写法的断言。

本次不调整公开组件行为，不发布、不提交、不改写已有业务修改。审查期间工作区正在发生其他修改；以下结论针对读取时的工作区，实施前须重新确认入口和文件内容，迁移最新内容。

## 审查方式与边界

- 盘点所有 Node 与 Vitest 测试文件、根/子包脚本、CI 和发布工作流，检查测试收集与构建依赖。
- 对照生产入口 `packages/docs/app/`，区分当前文档站、共享组件/示例和仅用于旧 Showcase 的外壳。
- 深读候选重复项、源码快照、真实消费者验证器，以及表单/消息/缩放/资源恢复等关键边界；以具体断言判断价值，不以文件数、断言数或覆盖率判断。
- 本轮没有执行完整浏览器、静态站点或 packed-consumer 验收，也没有测量完整运行时间。不能把以下删减建议当成已验证的等价替换。
- 最新盘点为 34 个 Node 文件、59 个浏览器文件。Node 数量包括审查期间新增的 `tasks`、`dev`、`docs-library-reload` 回归；它们不是本次审查新增的实现。

## 已确认的问题

### 统一命令目前存在，但语义还没有覆盖全部测试

审查开始时根目录没有 `test`，之后工作区出现了 `scripts/tasks.mjs`、`test/check/verify` 入口。最新 `tasks.mjs` 的 `test` 分支只执行 Node 回归，然后返回；Chromium、打包消费者和静态站点检查在 `verify` 分支。测试清单仍匹配 `scripts/**/*.test.mjs` 和两个子包的 `scripts/`，迁移时必须同步修改。不能再基于旧清单新增另一套 runner。

证据：`package.json`、`scripts/tasks.mjs:7` 及其 `mode === "test"` 分支。

### 两处开发服务器测试重复启动同一配置

`scripts/docs-sharing.test.mjs:61` 与 `scripts/docs-dev-sources.test.mjs:14` 都对 `/` 和 `/exui/` 启动真实 docs Vite，检查 JSON、Markdown 和缺失示例。前者独有完整响应等价、查询参数和 no-cache 断言；后者独有 HEAD 语义和隔离 cacheDir。保留这些不同断言，合并到一个 endpoint suite，而不是删掉真实服务器覆盖。

### 手工检查图没有承担图片回归判定

`Tabs.vrt.test.tsx:119` 只复用前面已经验证的可见性，再将 PNG 写到 `output/`；它没有比较图片。删除这个重复用例。`ComponentsOverview.vrt.test.tsx` 中的人工截图调用也不作为自动门禁；保留该文件的真实缩略图加载/交互断言，迁移到当前 Router 宿主后再删除旧外壳套件。

### 有些断言锁定源码表达式，而不是用户可观察行为

`scripts/docs-example-copy.test.mjs:384` 固定 59 条记录，并将每个 `aria-label` 初始化表达式的 `getText()` 与清单逐字比较。等价的 helper 提取、变量重命名或表达式调整也会失败，且通过不代表浏览器计算出了正确的 accessible name。

同文件 `all remaining source templates and string additions have explicit retention evidence` 对模板/加法表达式做逐字清单比较，也会把普通实现调整变成审查快照更新。移除表达式快照的测试职责，保留词典和插值完整性、用户输入不被翻译、SSR/浏览器显示与键盘可达性。原始来源审计资料只有在确认没有其他维护工具使用后才删除。

### 旧外壳覆盖与生产站点已经分叉

生产 `vite.config.ts` 使用 React Router，页面从 `app/routes/` 进入；`ShowcaseCatalog`、`ShowcaseLocale`、`ShowcaseSharing` 仍挂载旧 `Showcase`，断言 hash 路由、旧设置栏、旧双复制按钮或旧 Button 页面截图。新站的对应入口是 `DocsOverview`、`DocsSettings`、`DocsExamples` 与构建后静态验证器。

这些旧文件不能整批机械删除：共享复制 hook 的通用 MIME 接受、同页 target 切换保留草稿、全部缩略图懒加载等仍有价值的断言，要先转移到新站宿主。旧 `ShowcaseExampleCoverage` 和 `ShowcaseExampleInteractions` 大量验证真实共用示例，不应因为文件名带 Showcase 被删除。

### CI 清单与正在修改的根脚本需要一起收敛

原 CI 中 `test:docs-capabilities` 已包含 `scripts/exui-skill/sync-references.test.mjs`，之后又直接执行同文件。原链存在重复运行。最新根脚本已收敛到 tasks runner，而读取时 CI 仍引用多个被移除的旧命令。实施时统一更新 CI、release/tag 工作流、根与子包 manifest、TESTING 和 README，不保留第二份手工 Node 文件清单。

这是工作区尚在修改中的接线状态，不是已提交版本或远端 CI 的故障结论。

## 推荐结构

```text
packages/
  tokens/tests/                 Token 策略与语义别名
  components/tests/
    node/                        rem、specifier、Chart SSR
    upstream/                    ReUI 恢复、同步、导出、CSS 闭包
    consumers/                   实际 tarball 的类型、SSR、浏览器验证和夹具
    tooling/                     仓库级开发、发布与 Skill 检查
      release/                   发布计划、registry 与 manifest 契约
      skill/                     引用同步与隔离 Skill 示例消费
  docs/tests/
    node/                        内容、资源、源码导出、文案、开发服务器
    browser/                     当前站点、共享示例与公开包浏览器消费
    fixtures/                    文案清单、静态站点清单等测试专用输入
    integration/                 构建后根路径/子路径站点和分享验证器
    browser/__screenshots__/     保留的真实截图基线
```

按用户修正，仓库级 tasks/watch、发布和 Skill 检查统一放入 `packages/components/tests/tooling/`，用子目录标明职责。不新增 workspace、manifest、锁文件 importer 或测试框架；公开包的现有 files 白名单不包含 tests。根 `tests/` 不符合本次用户要求，不采用。

浏览器套件暂由 docs 工作区持有，因为它本来就是公开包的真实消费端，还需要完整 docs 样式层。仅重定向目录与导入，不将其改成组件源码 alias。测试中专用的 `ComponentRecipeContract`、环境快照等夹具一起迁移；生产使用的示例、Provider 和样式保持原职责。

生产构建或维护命令使用的脚本继续留在 `scripts/`，例如源锁校验、内容生成和实际发布命令。专供验收的 `verify-packages`、React/Form consumer、docs static/sharing 以及 Skill example verifier 移入相应 `tests/`。对共用函数要先查清生产调用，不能按 `verify-` 名称机械移动。

## 根命令契约

- `pnpm test`：完整测试入口，准备必需的公共产物后执行所有保留的 Node、浏览器、独立打包消费者、Skill 消费示例、构建后静态站点测试。它不发布、打标签或上传产物。
- `pnpm test:node`：较快的全部 Node 回归；这相当于当前新 runner 的默认 test 分支。
- `pnpm test:visual`：保留独立的浏览器入口；名称兼容现有使用，文档说明包含行为/几何而非只有截图。
- 定向 Node：`pnpm test:node <子包/tests/下的文件路径>`，路径原样透传，不经 shell 拼接。
- 定向 browser：`pnpm --filter @exre/exui-docs exec vitest run tests/browser/<suite>.vrt.test.tsx`。
- `pnpm check`：类型、lint、生成物/源锁一致性检查；与测试的职责在 TESTING 中明确。
- `pnpm verify`：完整交付验证，复用同一编排中的 check 与 test 阶段；避免同一前置构建和 suite 重复执行。

`pnpm test` 是标准命令拼写；不另建名为 `pnpm:test` 的重复脚本。Chromium 安装是明确的首次环境准备，不在每次测试时重复下载。依赖公共产物的阶段按顺序执行，不能让新旧声明或两种 base 的 docs 输出互相覆盖。

统一入口从 `packages/*/tests/**/*.test.mjs` 和明确的 Vitest include 收集测试。消费者和静态 verifier 属于同一编排的不同阶段，不把它们重复包装成另一份行为测试。加入一个针对实际发现结果的轻量检查，防止测试遗留在 `src/`/`scripts/` 后被静默漏收。

## 具体删减与合并清单

| 位置 | 处理 | 必须保住的证据 |
| --- | --- | --- |
| `docs-sharing.test.mjs` 中的真实 Vite endpoint 用例 | 合入 `docs-dev-sources`，删除重复 server 启动 | JSON/Markdown 完整内容、HEAD、缺失 ID、no-cache、查询参数、两种 base |
| `Tabs.vrt.test.tsx` 最后一个 inspection 用例 | 删除 | 前两个几何、状态、焦点用例继续保留 |
| `ComponentsOverview.vrt.test.tsx` | 有价值部分并入 `DocsOverview`，再删除旧文件 | 全家族缩略图懒加载、无运行异常、单一链接/inert、设置更新 |
| `ShowcaseCatalog.vrt.test.tsx` | 删除旧 shell 专属套件与三张旧 shell 基线 | 当前 Router 路由/历史、组件覆盖由生产站点用例与共享示例覆盖承担 |
| `ShowcaseLocale.vrt.test.tsx` | 删除旧 shell 套件 | `DocsSettings` 的持久化、语言导航与草稿；补足真实 preference remount，而非旧存储键 |
| `ShowcaseSharing.vrt.test.tsx` | 共用 hook 边界迁入 `DocsExamples` 后删除旧 shell 套件 | 失败不谎报成功、通用 MIME、Markdown 内容、同页 target 草稿 |
| `FormSurfaces` + `FormSurfaceOutline` | 合并为同一主题 fixture 的 `FormAppearance` | 背景一致与边框规则各自保留，不能把二者视作同一个断言 |
| `docs-example-copy` 中表达式逐字快照 | 移除/改为结果级断言，清理确认无引用的快照输入 | 模板参数安全、双语词典、用户原文、真实 SSR 与可访问名称 |
| CI 的 Skill sync 重复调用 | 只收集一次 | 同步器负例覆盖和隔离 example 编译仍运行 |
| 两种 Sonner upload 并发用例 | 都保留 | `c-sonner-10` 是 interval 清理；`c-sonner-21` 是独立 toast 更新/外部通知保留，不是重复 |
| Node 策略测试与浏览器样式测试 | 都保留 | 策略反例证明校验器能拒绝坏输入；浏览器验证最终 CSS 结果，层级不同 |
| workspace 浏览器与 tarball 浏览器 | 都保留并限定各自范围 | 前者覆盖完整 docs CSS；后者覆盖打包缺文件、依赖、类型和真实安装 |

按此方案，现有浏览器文件预计由 59 收敛到 54，独有行为转移后不减少有效覆盖。该数量是方案预期，不是已实施的验收结果，也不是删减目标。

## 各套件的保留依据

下表覆盖盘点时的全部 Node 与 browser 文件；同一组文件共享相近职责时合并列出。默认保留指保留其行为覆盖，并不要求维持原文件拆分。

### Node

| 原文件 | 归属 | 结论与具体价值 |
| --- | --- | --- |
| `tokens/scripts/color-contrast-policy.test.mjs` | tokens | 保留：透明合成、品牌阈值与错误输入反例 |
| `tokens/scripts/foundation-reference-policy.test.mjs` | tokens | 保留：未声明引用、literal 替代、映射漏项 |
| `tokens/scripts/glass-policy.test.mjs` | tokens | 保留：材质派生、状态与对比度边界 |
| `tokens/scripts/reui-semantic-alias.test.mjs` | tokens | 保留：公开别名仍引用规范变量 |
| `tokens/scripts/token-length-policy.test.mjs` | tokens | 保留：rem 与显式固定像素例外 |
| `components/scripts/module-specifiers.test.mjs` | components/node | 保留：声明扫描器真实 module specifier 边界 |
| `components/scripts/rem.test.mjs` | components/node | 保留：SSR fallback、ownerDocument 共享、观察器释放 |
| `scripts/chart-style.test.mjs` | components/node | 保留：SSR 配置不能逃逸为 script 或额外 CSS rule |
| `scripts/reui-restore.test.mjs` | components/upstream | 保留：下载/缓存篡改、越界、原子失败、dirty Git blob |
| `scripts/reui-sync.test.mjs` | components/upstream | 保留：规范哈希、更新原子性和已有 adapter 保全 |
| `scripts/reui-exports.test.mjs` | components/upstream | 保留：公开符号漏导出、CRLF 兼容与真正漂移 |
| `scripts/reui-luma.test.mjs` | components/upstream | 保留：实际 cn-* 标记 CSS 闭包与生成漂移 |
| `scripts/docs-content.test.mjs` | docs/node | 保留：双语链接、路由、MDX、公开代码块边界 |
| `scripts/docs-static.test.mjs` | docs/node | 保留：base/traversal、文件冲突和缺失路径 |
| `scripts/docs-example-base.test.mjs` | docs/node | 保留：真实源码变换仅作用于应变换的本地资源 |
| `scripts/docs-dev-sources.test.mjs` | docs/node | 保留并合并 endpoint 重复覆盖 |
| `scripts/docs-library-reload.test.mjs` | docs/node | 保留：真实 Vite 缓存先复现旧 CSS，再验证 reload 后新结果 |
| `scripts/docs-example-assets.test.mjs` | docs/node | 保留：字节、锁、license、路径、junction 与遗漏审计 |
| `scripts/docs-examples.test.mjs` | docs/node | 保留：恢复原子性、完整 ID、AST 闭包、生成不会覆盖手工文件 |
| `scripts/docs-example-styles.test.mjs` | docs/node | 保留：防止私有工具类再次注入 reset、root 品牌或扩大扫描 |
| `scripts/docs-example-copy.test.mjs` | docs/node | 保留行为与词典检查；移除源码表达式快照 |
| `scripts/docs-example-copy-ssr.test.mjs` | docs/node | 保留：真实示例的翻译与业务值保留，非 mock 文案 |
| `scripts/docs-sharing.test.mjs` | docs/node | 保留：源码闭包、HTML 转义、独立源码编译；移出重复 server 用例 |
| `scripts/docs-snippets.test.mjs` | docs/node | 保留：摘录漂移、换行、Glass type fixture 与 Form prop 摘录。后者测试的是生成结果，不能误删为文档字符串快照 |
| `scripts/exui-capabilities.test.mjs` | docs/node | 保留：来源接受、导出映射、边界替换与失败不写入 |
| `scripts/docs-pages.test.mjs` | docs/node | 保留：运行实际 guard；旧 SHA、错误 run attempt、丢失 dotfile/资源、symlink |
| `scripts/run-command.test.mjs` | tooling/dev | 保留：Windows 空格/字面参数、cwd、退出/启动错误与真实 CLI |
| `scripts/watch.test.mjs` | tooling/dev | 保留：真实 watcher 的生成 CSS 循环、完成通知和失败退出 |
| `scripts/dev.test.mjs` | tooling/dev | 保留：就绪后启动、重载与后代进程清理 |
| `scripts/tasks.test.mjs` | tooling/dev | 保留：失败短路、路径透传、实际子进程边界与产物依赖顺序；更新统一入口契约 |
| `scripts/release-bootstrap/npm.test.mjs` | tooling/release | 保留：registry 错误不能变成 publish，已存在版本幂等 |
| `scripts/release-bootstrap/package-contract.test.mjs` | tooling/release | 保留：包 manifest 的依赖/peer/导出反例 |
| `scripts/release-bootstrap/runtime.test.mjs` | tooling/release | 保留：真实本地 Git 的标签恢复、冲突、私有包排除与限定提交 |
| `scripts/exui-skill/sync-references.test.mjs` | tooling/skill | 保留：离线锁、路径边界、部分归档和预检原子性 |

### 浏览器

所有原文件位于 `packages/docs/src/showcase/`，后续位于 `packages/docs/tests/browser/`。

| 文件或文件组 | 结论与具体价值 |
| --- | --- |
| `Accordion` | 保留：展开/嵌套内容不被异步测量裁切 |
| `Attachment` | 保留：同心圆角、inset、公开 token 覆盖和真实 assistant 示例 |
| `Badge` | 保留：实际合成后的文字对比度、尺寸、公共 CSS 与自定义颜色 |
| `ButtonGroup` | 保留：连接边界、Select 隐藏节点、方向和键盘焦点 |
| `Calendar` | 保留：single/multiple/range 的实际边缘形状 |
| `CalendarLayouts` | 保留：全部真实日历示例窄容器和选中预约状态 |
| `CalendarCopy` | 保留：预设翻译与用户编辑原文的区分 |
| `CalendarRemSizing` | 保留：Gantt/calendar 手势在 root 变化时取消或重算 |
| `Cascader` | 保留：真实权限选择的 checked 标记被应用 CSS 隐藏的风险 |
| `Checkbox`、`RadioGroup` | 保留：控件选中与外层标签背景的独立绘制、真实点击和键盘 |
| `ComplexRemSizing` | 保留：虚拟化缓存、拖动、树缩进和显式像素覆盖 |
| `ComponentRecipeContract` | 保留：公开组件的计算样式、交互与 24 张真实图片比较基线 |
| `ComponentsOverview` | 合入 `DocsOverview`，移除旧 hash shell 依赖与人工截图 |
| `DataGridRemSizing` | 保留：sticky/scrollbar/virtual geometry 的跨层一致性 |
| `Dialog`、`DialogEnhancements`、`DialogComposition` | 保留：dismiss/focus、quick/composed API、响应式独立滚动、只加载 public CSS 的兼容边界各不相同 |
| `DocsExamples` | 保留并接收共享复制边界：真实源码抽屉、Portal 密度、取消、重试、草稿 |
| `DocsFormGallery` | 保留：真实 Form/Field host、规范归属、独立草稿与容器布局 |
| `DocsOverview` | 保留并接收全部缩略图/设置断言：实际 Router adapter、计数、inert 与导航 |
| `DocsSettings` | 保留：真实 Settings 的键盘、存储、语言 URL 与草稿 |
| `EmojiPicker` | 保留：hideSearch、焦点、虚拟网格和保留选择 |
| `ExMessage` | 保留：容量、期限、早期完成/撤销、StrictMode 和宿主订阅时序 |
| `ExuiCapabilities` | 保留：真实公开变体、Select API、源码抽屉接线 |
| `ExUIPages` | 保留：共享生产示例中的 loading 所有权和配置式确认/重置；与 Form 低层状态测试层级不同 |
| `FieldLayout` | 保留：实际可聚焦元素关联、refs、SSR/hydration、独立容器换行 |
| `Filters` | 保留：生产样式下 chip 边界、可读路径、custom renderer |
| `Form` | 保留：Input/Output、错误作用域、快照与稳定键 |
| `FormApi` | 保留：统一 Form 分支、配置错误和 schema/instance 切换 |
| `FormAsync` | 保留：异步过期结果、取消、提交锁与 batch 合并 |
| `FormContentSizing` | 保留：真实可交互 sizing 示例中窄行与草稿 |
| `FormControls` | 保留：控件真实 focus/blur/value 绑定和 File URL 生命周期 |
| `FormSteps` | 保留：导航作用域、受控确认/撤销与过期跳转 |
| `FormSurfaceOutline`、`FormSurfaces` | 合并 fixture，完整保留边框与背景两个契约 |
| `Glass` | 保留：computed style、标记落点、seed 生命周期和降级；不声称判断折射图片 |
| `InputGroup` | 保留：一次背景、一层焦点/错误 ring |
| `InteractiveCursor` | 保留：跨组件公共 cursor 契约及 deliberate exceptions；不是第三方通用功能重测 |
| `NavigationMenu` | 保留：完整应用 CSS 下 viewport hit-test 和键盘关闭 |
| `PhoneInput` | 保留：匹配尺寸、空状态可见性、搜索选择和焦点 |
| `Questionnaire` | 保留：Card 网格叠放、选择绘制、按钮高度和长描述不裁切 |
| `RemSizing` | 保留：CSS rem 配方及固定像素例外；与 JS/第三方 rem 套件边界不同 |
| `Resizable` | 保留：真实应用 CSS 下 separator hit area、指针和键盘 |
| `RuntimeRemSizing` | 保留：动态观察器、owner document 和显式 offset |
| `Scrollspy` | 保留：全部 section 的双向关联与多实例隔离 |
| `ShowcaseCatalog`、`ShowcaseLocale`、`ShowcaseSharing` | 按前述转移清单淘汰旧外壳测试 |
| `ShowcaseExampleCoverage` | 保留真实示例逐族检查；把加载宿主切换为生产 `ComponentExamplesHost`，不保留旧路由枚举断言 |
| `ShowcaseExampleInteractions` | 保留具体业务交互；用生产 host 与真实语言/密度 Provider 代替旧 shell，移除纯旧导航 UI 依赖 |
| `ShowcaseExampleStyles` | 保留：私有 Tailwind 与公开控件样式的交互及实例连续性 |
| `Sonner` | 保留：真实 custom toast 绘制层的圆角、宽度与进度状态 |
| `StaticRemSizing` | 保留：静态 CSS/SVG scaling 与固定 hairline |
| `Tabs` | 保留几何/状态/焦点；删除纯 inspection 图片用例 |
| `ThirdPartyRemSizing` | 保留：Recharts、Sonner、Resizable 等 ExUI 包装默认值和显式覆盖 |
| `Toggle` | 保留：持久选中、hover、disabled 与 Glass 组合 |
| `Trace` | 保留：公开 disclosure、可访问状态和动态示例 |
| `TraceCopy` | 保留：流式任务与语言切换的原实例、timer 和累计次数 |

## 实施顺序与验收

1. 以当前工作区为基线，保存迁移文件和基线的校验值；不回退已有未提交更改。
2. 先迁移 Node tests/fixtures 与其导入、cwd/root 推导，接入子包和根收集；保留原有测试行为。
3. 迁移 browser suites、专用 fixture 和 24 张保留基线，修改 Vitest include、docs TS include、lint 和 gitignore。基线迁移应字节一致，不重新采图来掩盖回归。
4. 迁移专用 consumer/static verifier；真实构建/维护脚本继续留在 `scripts/`。
5. 按删减表逐项合并和转移，先证明目标 suite 覆盖独有断言，再删除原用例；不为了缩短运行提高 timeout 或放宽断言。
6. 在现有 tasks runner 中接入统一契约，CI 调用同一编排。发布工作流保留必要的发布前验证，避免触发发布或移除其保护。
7. 更新 TESTING、README、必要的工程文档。只有实施并验证后的稳定知识才更新 `.ai/`；本设计本身不直接沉淀成已落地事实。
8. 跑 Node 全量、定向迁移 suite、完整 Windows Chromium、packed consumer 与两种 base 的静态验证；按仓库政策完成 typecheck/lint/build，并报告任何阻塞。

验收必须同时证明：测试未遗留在 `src/`/`scripts/`；所有保留文件被收集；失败向根命令和 CI 返回非零；基线无非预期变化；独立 tarball 消费仍不依赖 workspace 私有入口；没有无依据的删减或只更新 snapshot 的绿灯。

## 本轮执行证据

运行：

```powershell
node --test scripts/docs-example-styles.test.mjs scripts/run-command.test.mjs scripts/tasks.test.mjs scripts/release-bootstrap/npm.test.mjs scripts/release-bootstrap/package-contract.test.mjs
```

结果：22 tests、22 pass、0 fail、0 skipped。该证据只覆盖命令列出的当前工具/策略/manifest 回归，不代表迁移完成、完整测试通过或远端 CI 已验收。迁移和删减均尚未进行。
