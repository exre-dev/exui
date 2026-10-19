# 静态文档站与示例边界

`packages/docs` 是私有 `@exre/exui-docs` 工作区。React Router framework mode 在构建时预渲染路径，Fumadocs MDX 提供内容，Fumadocs UI 的 Glass 布局提供导航；Vite 产物落在 `build/client`。生产入口在 `app/`，共享示例与原 Showcase 外壳留在 `src/showcase/`，浏览器回归及专用夹具归入 `tests/browser/`；历史行为见 [Showcase 记录](../showcase/consumption.md)。站点示例只通过公共 `@exre/exui` 入口消费组件库。

## 内容与路由

MDX 中的文档链接以源文件为基准编写，例如 `../tokens/density.mdx`。`lib/content-links.mjs` 在编译 Markdown 链接及引用定义时，将它们转换为当前语言和部署前缀下的静态路由，保留锚点；不能直接让浏览器按带尾斜杠的页面 URL 解析源文件路径。转换也覆盖绝对语言路由和独立示例链接。源码校验之外，静态验证器逐页检查渲染后的文档链接必须落在已预渲染的路径集合中，防止配置未接线或部署前缀错误漏过内容门禁。

维护者编辑 `content/en/` 与 `content/zh-CN/` 的 MDX。`scripts/docs-content.mjs` 根据页面源校验两种语言各 88 个组件家族页和十一个指南、ID 与内部链接，并生成 `.generated/pages.json`；这个 manifest 是生成物。站点的文档 URL 是 `/<locale>/docs/<group>/<id>/`，搜索索引是 `/search/<locale>/index.json`，分享 URL 是 `/examples/<id>/`。这些路径由 `lib/site-contract.mjs` 和 React Router 路由表共同约束。

分类含义见 [领域语言](../../CONTEXT.md)。catalog 模块注册为 86 components + 2 exui；`catalog-presentation.ts` 将 Form 展示为 Components，因此导航和总览为 87 Components + 1 Blocks。Form 规范模块与 URL 仍为 `exui/form`，拥有 `exui-form-1`、`exui-form-models`、`exui-form-configured`。独立 Field 示例归属 `components/field`：`exui-field-settings`、`exui-field-display`、`exui-field-layout`；旧 ExForm/ExItem/ExMessage 页面与分享 ID 不再注册；ExMessage 迁移说明作为 `getting-started/ex-message-migration` 普通指南维护。`/<locale>/docs/components/` 与 `/<locale>/docs/exui/` 复用总览路由并按展示分类筛选；切换语言时保留分类，两类路径都纳入静态预渲染。

带 `exampleFamily` 的 Components 与 Blocks 家族页共用“标题、简短介绍、交互示例、MDX 说明”的顺序。加宽只作用于包含示例区的 Glass 布局，指南页保持原布局；示例使用完整内容宽度，后续说明限制阅读行宽并靠左。`#examples` 是两种语言共用的目录锚点，路由 loader 同时将其加入本页目录和另一语言的有效锚点，保证语言切换保留该位置；其余说明标题继续来自 MDX。

分享页的 HTML、`source.md` 与 `source.json` 从同一示例导出生成，便于普通 HTTP 客户端读取。页面正文和搜索索引按需要加载，示例源码在用户打开源码抽屉后请求。交互示例在宿主 effect 完成后挂载，避免预渲染阶段读取浏览器状态。站点的主题由 `app/lib/preferences.tsx` 单独驱动，纯黑同时应用 `dark` 与 `pitch-black`；密度类只作用于示例范围。新的偏好键兼容读取原 Showcase 键。

同一 docs 路由的家族页切换保留 `ComponentExamplesHost` 及其唯一通知宿主，仅由内部 `FamilySession key={family}` 卸载页面示例。示例 runtime 按消息 ID 与任务代次清理自己的通知，外部通知保留原倒计时；给整个 Host 再按页面设 key 会重建 Sonner Toaster，使仍在 store 中的外部通知失去可见 DOM。语言、密度与同家族 target 切换保持示例草稿；导航到不含示例的指南或其他路由仍会卸载 Host。结构见 `app/routes/docs.tsx`、`app/components/ComponentExamplesHost.tsx`，导航清理回归见 `tests/browser/ShowcaseExampleInteractions.vrt.test.tsx`。

新站的示例卡片始终保留预览，标题本身复制独立示例链接并用 Tooltip 反馈结果；右侧「源码」按钮通过公共 Sheet 打开模态抽屉。`src/showcase/SourceDrawer.tsx` 复用 `SourcePanel.tsx` 的文件选择、高亮、单文件复制和加载重试；完整源码复制通过 `useExampleCopy.ts` 读取原 Markdown 导出，保留全部文件、运行说明和案例链接。关闭抽屉取消未完成的源码请求，重新打开复用已完成的 JSON 缓存；预览组件不卸载。标题栏工具不参与预览 Portal 的归属判定，避免源码抽屉继承 compact 预览密度。保留的旧 Showcase 夹具继续使用原复制按钮。

开发服务器由 `lib/example-sources.ts` 的 Vite 插件提供相同的 JSON 与 Markdown 源码端点，并在 Router 页面处理中间件前注册。它复用静态导出器，遵循 Vite base，不依赖已有 `build/client`。缺少这条接线时，源码 URL 会落入页面路由并返回 HTML，代码视图与复制源码会同时失败；真实开发配置的 HTTP 回归见 `packages/docs/tests/node/docs-dev-sources.test.mjs`。

`app/styles/docs.css` 将公共包已编译的 `style.css` 放入独立 `exui` 样式层，优先级低于站点的 `utilities`。两个 Tailwind 编译产物若直接合并到同一层，后导入的 `.flex`、`.p-6` 会覆盖 Glass 的 `md:hidden`、`md:pt-16`。设置组件必须接收布局 slot 的 `className`，让桌面工具栏和移动抽屉各自的可见性规则生效。

同样的层级会让站点 `utilities` 中的普通 Field 列布局覆盖公共样式的响应式查询类。`app/styles/docs.css` 用有界的 `@source inline(...)` 桥接这些公共类，使它们在站点层重新生成并保留响应式行为；不应通过改写公共 Field 或锁定上游示例修复这个宿主问题。普通 `orientation="responsive"` Field 需要 `FieldGroup` 提供具名查询容器，与[独立 Field 配方](../../../skills/exui/references/exui/field-layout.md)逐项测量的 21.75rem 限宽/对齐规则不同。真实宿主验证见 `DocsFormGallery.vrt.test.tsx`，独立源码消费验证见 `packages/docs/tests/node/docs-sharing.test.mjs`。

Filters 的片段拼接由公共样式表根据内置片段标记处理，内部圆角与共享边框不能被应用层的通用圆角、边框工具类覆盖；自定义 `renderChip` 不带该标记，继续自行控制外观。文档页不再为 Portal 菜单预留固定预览高度，卡片跟随闭合内容增长；完整样式层下的几何、窄容器及跨卡片菜单点击由 `Filters.vrt.test.tsx` 验证。消费布局约定见 [Filters](../../../skills/exui/references/exui/filters.md)。

`app/components/Settings.tsx` 的主题、预览密度与语言使用公共 `SelectField` 组合；可访问名称放在 `SelectTrigger` 上。触发器使用 `size="sm"`，站点局部 CSS 以 small token 控制尺寸并保持背景透明，弹层保留主题表面。设置尺寸不跟随示例密度切换。

Glass 侧栏的折叠分组使用 `overflow: hidden`，会裁切菜单项外扩的键盘焦点框。站点样式在桌面侧栏和移动抽屉内将焦点 ring 改为向内绘制，保留其主题颜色与分组动画。

锁定示例中的照片、旗帜和 emoji 数据仍使用 `/examples/reui/` 公共路径。`lib/example-assets.ts` 的 Vite 前置转换只在示例模块的字符串字面量和模板头补入部署前缀；根路径不改源码。原始文件、来源哈希与导出的独立消费源码不随部署 base 改写，下载链接由分享导出器加前缀。Vite 的 `base` 本身不会改写普通字符串中的资源地址。

来源哈希比较原始字节，文本许可证和保留的旗帜元数据也受此约束。`.gitattributes` 对这些公共素材关闭换行转换，保留原始 LF 或 CRLF；修改该规则后需要重新规范化对应索引项，不能只检查原工作区的文件。真实 Git 检出回归见 `packages/docs/tests/node/docs-example-assets.test.mjs`。

## 组件总览

`/<locale>/docs/` 是全部家族的总览；`components/` 与 `exui/` 分类入口只展示各自的家族。总览由 Router route 提供，不计入 MDX 内容清单，因此必须单独加入预渲染路径、静态目录映射与静态验证的预期集合。品牌导航和站点语言入口指向总览，组件卡片使用带部署前缀的真实文档 URL。

新站与旧 Showcase 共用 `src/showcase/ComponentsOverview.tsx` 的代表预览；新站注入 Router 链接和来自详情页同一分享清单的示例数量，旧夹具保留 hash 导航。预览接近视口后才加载，内部控件通过 `inert` 与 `aria-hidden` 退出交互和可访问树，卡片链接承担导航；密度类仅作用于预览区域。总览没有独立搜索和右侧目录，全文搜索仍由文档站外壳提供。

## ExUI 公开差异的文档边界

公开导出索引只能证明名称存在，不能证明使用者能在组件家族页找到对应说明。`packages/docs/exui/capabilities.json` 将经源码核查的 ExUI 新增能力和适配差异关联到公开符号、实现证据、文档页、skill 家族、示例与共享指南；同目录的双语片段是这些差异说明的维护源。`scripts/exui-capabilities.mjs` 只更新文档中的有界生成段；`scripts/exui-skill/sync-references.mjs` 将英文说明合入 skill 家族参考页，后面继续保留上游模式资料。两种输出不以复制后手工编辑的方式维护。

新增预览仍通过既有 `exui-extensions.ts` 接入家族页，独立源码沿用同一分享导出器，不能占用或替换固定上游的官方示例 ID。新增能力示例与说明里的完整模块均进入公共包消费编译验证。生成与验证的具体命令由 `TESTING.md` 维护。

独立的 `source-review.json` 记录被审阅的组件源与公开导出快照。普通内容生成不会接受新的实现快照；源或公开面变化需要显式复审。这个边界用来发现“需要重新核查文档”，不能推断行为语义，也不能把登记或校验通过当成说明内容事实正确的证明。

新的公开名称在接受前需要关联能力或具名的审阅排除理由，已经接受的关联也不能静默消失。skill 的能力段更新先验证旧引用锁，只更新经过边界限制的内容与对应哈希；缺少可选下载归档时，这一步仍不能重新接受上游正文的任意改动。Glass 的家族映射记录实际承载材质的公开组件，避免把内容槽的属性误写到没有该属性的组合根上。

## 交付边界

`EXUI_DOCS_BASE` 接受 `/` 或 `/exui/` 一类绝对路径。Vite base 和 Router basename 使用同一值；静态验证必须针对同一 base 的构建产物。托管需完整提供 `build/client` 内的 HTML、`.data/`、搜索、资源与示例源码文件，不依赖 Node 运行服务或 SPA 回退。`TESTING.md` 区分内容校验、片段编译、静态目录验证、新站浏览器用例、旧 Showcase 夹具和公共包打包消费者；旧夹具通过不代表新站已验证，构建和本地验证也不等于线上托管已验收。

证据：`packages/docs/package.json`、`react-router.config.ts`、`vite.config.ts`、`app/routes.ts`、`app/routes/docs.tsx`、`app/routes/example.tsx`、`app/lib/preferences.tsx`、`lib/site-contract.mjs`、`scripts/docs-content.mjs`、`scripts/docs-static.mjs`、`packages/docs/tests/integration/verify-docs-static.mjs`。

CI 到 GitHub Pages 的来源、产物、并发和恢复边界集中记录在[文档 Pages 交付](../release/delivery-pipelines.md#文档-pages-交付)，不以工作流落地或本地验证替代真实托管验收。
