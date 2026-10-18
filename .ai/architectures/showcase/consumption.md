# Showcase 消费模型与视觉测试

> 本文记录迁移前 Showcase 外壳与保留的内部示例/测试夹具。其历史 `packages/showcase` 路径用于追溯原始证据；现行代码位于 `packages/docs/src/showcase/`，生产入口已改为静态文档站。当前结构见 [`docs/site.md`](../docs/site.md)，验证分工见 [`TESTING.md`](../../../TESTING.md#static-docs-site)。

最后更新：2026-10-16

## 应用

`packages/showcase` 是私有 Vite 应用（`@exre/exui-showcase`）。`main.tsx` 在 `StrictMode` 下渲染 `App → Showcase`；`ShowcaseStyles.ts` 集中导入公开 `@exre/exui/style.css`、私有示例工具类与现有页面样式。源码中不出现任何指向 `packages/components/src` 的路径或别名，`vite.config.ts` 与 `vitest.config.ts` 均注册 React 和 Tailwind 插件，没有组件源码的 `resolve.alias`。两份配置从 `example-dependencies.ts` 共享示例懒加载时需要预优化的依赖列表。

两个直接后果：

- 它消费的是**构建后的公共包产物**，不是组件源码。因此视觉测试前必须先完成一次 workspace 构建，否则测试会对着上一版产物运行。
- Showcase 用自己的 Tailwind 4.3.2 编译上游示例布局类；私有 `example-utilities.css` 只扫描 `examples/` 与 `pages/components/`，不导入 Preflight，也不设根品牌或密度变量。公开组件的 CSS 仍由公共包提供。私有样式边界只为 Showcase 示例服务，不扩展公共包的消费契约。

`packages/showcase/upstream/reui/source-lock.json` 固定来源与示例 ID，`coverage.json` 记录每例状态和家族模式。当前候选示例均指向已适配文件，通用家族均使用 `upstream` 模式；File Upload 原例按锁中记录排除。`scripts/showcase-examples.mjs` 校验锁、覆盖、页面绑定及生成产物。每族 `examples/<family>/index.generated.ts` 注册示例，`component-loaders.generated.ts` 按族导入组件页；`page-loaders.ts` 把各目录页包装并缓存为稳定的 `React.lazy` 身份。原先通用组件的五个聚合页模块已移除；五个 ExUI 页仍经原 `pages/exui` 模块加载。完整状态的检查方式见 [`TESTING.md`](../../../TESTING.md#reui-example-and-legacy-showcase-fixture-maintenance)。

示例的逐族双语文案在 `examples/<family>/copy.generated.ts`，共享语言与实例资源域在 [`examples/_shared/example-runtime.tsx`](../../../packages/docs/src/showcase/examples/_shared/example-runtime.tsx)。它为各预览提供稳定实例身份，并管理本例的异步任务与消息清理；业务值和输入草稿保持原义。图片、国旗与 emoji 的本地资源来源及字节校验分别记录在 `packages/showcase/upstream/reui/{asset,flag,emoji}-provenance.json`。这些私有数据不进入公共组件包。

部分原例需要的关联语义由 Showcase 消费侧提供：受影响的 Field/Label 等示例把 label 指向实际控件；[`stepper-runtime.tsx`](../../../packages/docs/src/showcase/examples/_shared/stepper-runtime.tsx) 用局部稳定 ID 把触发器与真实 panel 相连；[`date-selector-runtime.tsx`](../../../packages/docs/src/showcase/examples/_shared/date-selector-runtime.tsx) 将公开 DateSelector 内部两组选中 Tabs 指向当前真实日期或周期内容。Sidebar 的局部 Portal/overlay 定位与实例归属由 [`surface-runtime.tsx`](../../../packages/docs/src/showcase/examples/_shared/surface-runtime.tsx) 管理。这些辅助层不修改公共组件 API；运行前提见[视觉测试约束](../../knowledge/showcase/visual-test-constraints.md)。

## 组件目录

`Showcase` 是桌面组件预览应用，品牌名称为 ExUI。固定左侧导航包含“全部组件”入口，以及“通用组件”和“ExUI”两组，组内按组件名称的英文字母顺序展示 90 个组件家族页面；不提供目录搜索、移动布局或移动抽屉。通用组覆盖基础 UI 与 ReUI 家族，ExUI 组分别展示 ExForm、ExItem、ExMessage、Form、Glass。hooks、类型与纯 Provider 不独立成页，DirectionProvider 合并到输入组示例。首页卡片和侧栏采用同一分组和名称排序，不改变 `catalog.ts` 的页面注册顺序。

组件详情页包含当前组件名称、示例 HeaderBar 和真实预览，允许组件自身的标题、字段、校验错误、Tooltip 与 CodeBlock；没有外层说明、Agent 提示、安装/API/源码面板或 JSON 调试输出。`Preview.tsx` 与 `ShowcasePages.css` 提供双列小预览和通栏复杂预览，使用公开语义 Token。`ExampleGallery.tsx` 从注册项渲染官方示例的稳定 `data-example-id`；InputGroup 的 RTL 示例作为 ExUI 扩展，仅标记 `data-example-kind="exui-extension"`，不占用官方 ID。所有可分享预览的外层另有 `data-share-example-id`，ExUI 原生预览使用显式 `shareId`。`Showcase.css` 仍由共享样式入口导入。

`resolvePage` 将 `#/components/button`、`#/exui/glass` 等 hash 解析为详情页。空地址、`#/` 和 `#/components` 归一到首页 `#/components/`，Logo 与“全部组件”也指向首页；未知详情页面与组别不匹配继续回到 Button。首页不保留示例定位参数。导航使用真实锚点，监听 hashchange 支持浏览器前进和后退。`page-loaders.ts` 缓存稳定的 React.lazy 组件；切换主题、密度、语言不会替换当前页面实例。`ComponentRecipeContract.tsx` 是独立的确定性测试夹具，不进入用户目录。

`ComponentsOverview.tsx` 由同一个目录生成全部卡片，`ComponentsOverview.css` 提供随主区宽度调整列数的等尺寸网格。卡片接近视口时才懒加载该家族的第一份真实示例，避免导入整组详情页；五个 ExUI 家族使用 `OverviewExUIPreviews.tsx` 的精简组合。预览通过 ResizeObserver 缩放以适合固定区域，跟随共享主题、密度与语言。预览区域设为 `inert` 和 `aria-hidden`，导航链接是卡片内唯一可聚焦目标，通过覆盖层覆盖整张卡片，避免把示例控件嵌入链接。首页预览不加入官方示例清单或分享 ID。

`ShowcaseContent` 挂载唯一的 GlassSeed、TooltipProvider 和 ExMessageContext。消息页保存 loading 句柄，完成、关闭或页面卸载时清理；加载期间禁用普通消息发布，避免容量淘汰使句柄示例失效。消息控制器的边界见 [`components/ex-message`](../components/ex-message.md)。Tree 的真实 Headless Tree 实例与日期视图的 date-fns locale 由 Showcase 自己声明消费侧依赖。

### 示例分享与可读源码

`ExampleHeader.tsx` 展示组件内稳定编号及“复制链接”“复制源码”，官方编号取现有 ID 的数字后缀，扩展编号带 `E`。`example-navigation.ts` 提供当前页与目标示例的上下文；`?example=<id>` 位于现有 hash 路由内，同页目标切换保留组件实例。目标预览挂载后滚动定位并短暂高亮。

`scripts/showcase-sharing.mjs` 从覆盖表、ExUI 预览标记和扩展注册读取示例集合，并递归收集源码的本地依赖。ExUI 多预览页面按 TypeScript AST 提取选中预览，保留所属函数的状态、辅助声明与清理逻辑；导出物不包含预览容器、HeaderBar 或目录。Markdown 同时包含可运行的 Vite/React 入口、私有示例工具类、安装版本、资源链接及 ReUI 归属信息。

`sharing-plugin.ts` 在开发服务器按需返回资料，在生产构建结束时写入 `examples/<id>/index.html` 和 `source.md`。分享 HTML 本身含完整可读资料，复用构建后的应用脚本；浏览器入口在挂载前把地址切回应用根及具体 hash，随后展示原组件页。普通 HTTP 读取不执行该切换，直接取得当前例的源码。分享链接不携带主题、密度、语言或交互快照，访问者设置继续由现有本地存储管理。

生成器要求绝对路径形式的 Vite base，以确保固定入口和子目录部署的资源链接一致；可读源码不进入初始应用 JavaScript，只在点击复制时获取。测试与部署产物要求见 [`TESTING.md`](../../../TESTING.md#showcase-example-sharing)。

## 主题与密度

顶部设置支持 light、dark、pitch-black，以及 standard、compact 两种密度，选择持久化到 localStorage；存储不可用时仍可在当前页面切换。Showcase 自己管理根主题 class：纯黑同时设置 `dark` 与 `pitch-black`，以启用公共组件的 dark 变体；compact 对应 `density-compact`。卸载时恢复原始根 class。Glass 的开关与材质背景控件只放在 Glass 页面。

## 语言切换

`ShowcaseLanguageProvider` 只管理私有 Showcase 的英语与简体中文。首次读取浏览器 `navigator.language`（`zh` 前缀选中文，其余选英文）；手动选择写入 localStorage，后续访问优先使用该选择。切换时同步更新页面 `lang`，标题固定 ExUI，页面 hash 不变。组件/API 名称保持英文，预览可配置文案在渲染层通过 `preview-copy.ts` 或 ExUI 页的本地 hook 翻译。示例数据标识、选项 value、schema 与用户草稿保持稳定；既有旧测试夹具仍使用 `translations.ts`。

表单示例保留稳定的英文 Schema 和同一表单实例。公开组件的 `formatIssue` 只转换显示中的字段错误和摘要，不改写原始校验记录。日期与复杂控件通过公开 locale/i18n 配置翻译；公共 API 未暴露的底层文案不能由 Showcase 覆盖，例如 FormDateControl 月份格式、PhoneInput 搜索提示和 Rating 星级 aria。步骤、文件与关闭按钮的可配置文案见 [`components/forms`](../components/forms.md) 和公开组件参考文档。

## 视觉测试配置

`vitest.config.ts` 定义一个名为 `visual` 的 project：

| 项 | 取值 |
| --- | --- |
| `include` | `src/**/*.vrt.test.tsx` |
| `fileParallelism` | `false`（串行，避免多文件并发争用同一浏览器实例） |
| provider | `@vitest/browser-playwright` |
| contextOptions | `deviceScaleFactor: 1`、`locale: "en-US"`、`reducedMotion: "reduce"`、`timezoneId: "UTC"` |
| instances | `chromium-desktop` 1280×900、`chromium-mobile` 390×844 |

这些取值决定了截图的归一化程度：分数像素比、固定语言区域、禁用动效、固定时区。基线文件名按 `浏览器-平台` 归类，因此同一份用例在不同平台上会寻找不同的基线文件。

应用外壳与目录用例只在桌面实例执行；组件本身的 Dialog、Form、Tokens 等回归继续运行两个视口，不能据此声称 Showcase 支持手机。Showcase 自己的 `.gitignore` 仅放行经审阅的三张 Windows 桌面外壳基线，其余临时截图继续忽略。

## 测试套件

| 文件 | 关注点 | 是否记录截图 |
| --- | --- | --- |
| `ComponentRecipeContract.vrt.test.tsx` | 三套主题（`light` / `dark` / `pitch-black`）× 两种视口下的配方几何、计算样式与真实交互状态 | 是，四个场景各一张 |
| `RemSizing.vrt.test.tsx` | 根字号矩阵下的可缩放几何，以及固定像素例外 | 否 |
| `InteractiveCursor.vrt.test.tsx` | 交互元素的 `cursor` 取值与刻意保留的例外 | 否 |
| `InputGroup.vrt.test.tsx` | 输入组在多个状态下的背景与边框叠加 | 否 |
| `ShowcaseCatalog.vrt.test.tsx` | 桌面目录、hash 历史、设置保留草稿、中英逐页挂载、三个主题的 Button 页面 | 是，桌面应用外壳 |
| `ComponentsOverview.vrt.test.tsx` | 首页入口、全部家族卡片和分组排序、Logo/卡片/侧栏导航、浏览器历史、设置切换与全部缩略预览加载 | 否 |
| `ShowcaseLocale.vrt.test.tsx` | 手动语言持久化、预览文字切换、输入 DOM/草稿与按钮状态保留 | 否 |
| `ShowcaseExampleStyles.vrt.test.tsx` | 四个代表性 ReUI 示例的布局与交互、公开控件计算样式、主题/密度/语言切换后的实例保留 | 否 |
| `ShowcaseExampleCoverage.vrt.test.tsx` | 中英分别遍历所有目录页，核对逐例 ID、可见内容、DOM/SVG/ARIA 关联和浏览器资源错误 | 否 |
| `ShowcaseExampleInteractions.vrt.test.tsx` | 代表性交互、弹层、Chart、设置切换、实例范围及清理 | 否 |
| `ExUIPages.vrt.test.tsx` | Form 真实提交、ExForm 确认后提交与重置、消息句柄及页面卸载清理 | 否 |
| `Dialog.vrt.test.tsx` | 公开组合式 Dialog 的 portal、关闭与焦点行为 | 否 |
| `CalendarCopy.vrt.test.tsx` | 日历编辑时区分预设翻译与用户原文，语言切换不覆盖编辑草稿 | 否 |
| `ExMessage.vrt.test.tsx` | 全局消息的容量、时限、加载句柄与宿主生命周期 | 否 |
| `Form.vrt.test.tsx` | 错误摘要仅在显式组合时渲染、Input 草稿与 Output 输出的类型边界、错误归属与生命周期、作用域投影与只读快照、稳定键与脏值比较 | 否 |
| `FormAsync.vrt.test.tsx` | 异步校验的请求合并与批次合并、同步请求合并、本地成功不使整体转为有效、`reset` / `cancelPending` / `unmount` 的取消语义、提交锁期间的 touched 记录 | 否 |
| `FormControls.vrt.test.tsx` | 各内置控件在真实可聚焦元素上的绑定：日历弹层的默认日期与可选边界、Today 的出现条件、月份与年份下拉、Select 的标签与失焦、布尔与数组取值、radio 与多选中搜索文本与字段值的隔离 | 否 |
| `FormSteps.vrt.test.tsx` | 分步校验作用域、受控 `currentStep` 的确认与撤销、跨父级渲染保留草稿与待定导航、原生提前提交与业务提交的区别 | 否 |
| `ExItem.vrt.test.tsx` | 独立条目的内容限宽与对齐、表单布局继承与逐项覆盖、直接 `Input` 的 id 与 `aria-describedby` 关联、服务端渲染后生成 id 的保留、按自身宽度换行、span 与根 `div` 属性 | 否 |
| `FormContentSizing.vrt.test.tsx` | Showcase 中切换共享尺寸与对齐后草稿不丢失，窄行回退为填满可用宽度 | 否 |
| `FormSurfaceOutline.vrt.test.tsx` | 三套主题下每个表单输入表面都保留 1px 实线边框，既不透明也不与自身背景同色，且各表面颜色一致 | 否 |
| `FormSurfaces.vrt.test.tsx` | 文本、多选、日期与文件四类控件在空闲态使用同一个字段背景色 | 否 |

当前完整 Windows Chromium 视觉套件已覆盖中英文全部目录页、代表性交互和三张 Button 截图；测试运行约束见[视觉测试知识](../../knowledge/showcase/visual-test-constraints.md)，本次交付的独立结论见[最终复审](../../../.notes/showcase-component-pages/reviews/reui-example-coverage-final-review.md)。

### 公共夹具模式

各套件共享一套约定，新增用例应沿用：

- 用 `createRoot` 挂到自建容器，`beforeEach` 中 `document.body.replaceChildren(container)`，避免上一个用例的 DOM 残留。
- 注入一条禁用 `animation` / `transition` 的 `<style>`，让断言读到的不是过渡中间态。
- 断言前 `await document.fonts.ready`，否则字体替换会改变文本几何。
- 一套用例允许修改的环境（根字号、主题 class、`body` margin、滚动位置）在 `beforeEach` 快照、`afterEach` 恢复，而不是清空，以免抹掉应用或相邻用例设置的值。

`RemSizing.vrt.test.tsx` 的根字号矩阵为 `16px`、`21.328px`（16 × 1.333，覆盖分数布局）、`32px`（翻倍）。几何比较容差为 0.1 CSS px，浮层相对触发器的位置比较放宽到 1px，因为浮层坐标来自渲染矩形而非计算样式。浮层几何需要轮询到稳定后再读：Radix 在 resize observer 中异步重排，根字号变化后立即读取可能拿到旧位置。

`ComponentRecipeContract.vrt.test.tsx` 里点击会在后续渲染中不稳定的用例（例如选中态）先通过真实交互进入状态再断言，且 `RemSizing` 之所以不记录截图，是为了不给平台基线再增加一组需要维护的图片。

## 断言与基线的分工

两类断言并存，互不替代：

- **计算样式与几何断言**跨平台稳定，覆盖颜色、阴影、内边距、圆角、字号、间距以及交互后的状态值。
- **截图比对**（`toMatchScreenshot`）只用于渲染结果无法用计算样式穷举的场景（配方总览、Tabs、Menu、Dialog），基线文件提交在 `src/showcase/__screenshots__/<测试文件>/` 下。

基线策略与运行平台的绑定关系见 [[showcase/02-windows-pinned-visual-baselines]]，运行视觉测试时的操作约束见 `knowledge/showcase/visual-test-constraints.md`。
