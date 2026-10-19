# 视觉测试的运行前提与失败模式

> 本文的 Showcase 用例现作为 `packages/docs/src/showcase/` 中的保留夹具运行；当前静态站点另见 [`docs/site.md`](../../architectures/docs/site.md) 和 [`TESTING.md`](../../../TESTING.md#static-docs-site)。旧夹具的通过不能替代新站的静态目录与浏览器验证。

最后更新：2026-10-16

## 必须先构建，否则测的是旧产物

Showcase 只导入公开入口，解析到的是 `packages/components/dist/` 与 `dist/tokens/`。`pnpm test:visual` 本身不构建，所以：

- 修改了 Token 或组件源码而只跑 `pnpm test:visual`，得到的是上一次构建的结果。测试可能通过，而通过的并不是改动。
- 在干净检出上直接跑视觉测试会因为找不到产物而失败。

正确顺序是先 `pnpm build`（或至少构建 tokens 与 components），再跑视觉测试。仓库为此专门调整过 CI 步骤顺序，把构建前置。

DataGrid 家族页会同时渲染多个表格预览，语言切换也会更新整页。表头、排序表头与搜索空态的翻译是独立场景，应分别挂载并切换一次语言，保留预览、列或输入节点的同一实例断言。将这些场景串在同一用例里反复切换语言，会让总执行时间受共享 CI 机器速度影响；拆分场景可保留原有断言和单项超时预算。

`ExampleGallery` 以稳定的示例数组作为 props，并在画廊边界使用 React memo。主题与密度通过 CSS 生效，不应因宿主状态更新而重新执行所有表格；语言 Context 更新仍须穿过该边界，更新同一预览的文案。交互回归通过真实基础 DataGrid 的模块 spy 计数，同时检查中文表头和预览连接状态；原分页、状态保留及 15 秒预算不变。不能通过增加用例超时来掩盖这种无关设置造成的重复工作。

该边界也依赖生产文档路由的 `LanguageContext.value` 身份稳定。即使语言字符串未变，偏好设置重渲染时新建 value 对象仍会穿透画廊的 memo，让真实示例重新执行。`app/routes/docs.tsx` 缓存语言 value；浏览器测试适配器采用相同规则，不能仅优化测试夹具而留下生产路由的重复渲染。

浏览器的物理指针不会随 React 卸载而复位。NavigationMenu 夹具在挂载前将指针移到固定的中性区域，并重置滚动位置，避免前一用例的指针在新菜单上触发 hover。弹层几何和链接查询必须限定到目标触发器所属的菜单，保留真实点击及 `elementFromPoint` 命中断言，不能靠强制点击绕过遮挡。

## 日历边缘圆角必须比较四个角

Calendar 的周首、周末选择器会覆盖日期按钮一侧的圆角。若按钮另一侧仍继承 Button 的 `9999px` 胶囊圆角，浏览器会按 CSS 圆角重叠规则同时缩放四角；即使覆盖侧的计算值大于按钮半径，也会画成接近平边的形状。这些边缘修饰仅用于范围连接，必须限制在 `mode="range"`；把按钮基础圆角统一改成固定 `--cell-radius` 会让放大的单元格变成圆角方形。`Calendar.vrt.test.tsx` 从公开包渲染并真实选择周首、周中和周末日期，比较四角与按钮尺寸，同时检查周编号、字号/密度变化、放大单元格和范围连接；只检查单个圆角是否非零无法捕获这个问题。

## 嵌套圆角要比较弧心

有内边距的图标背景若直接使用外框的同一个圆角数值，会显得更圆；数值相等的断言通过不能证明视觉协调。应测量实际内缩距离，再检查内圆角加内缩是否接近外圆角，并结合真实示例检查外观。`Attachment.vrt.test.tsx` 通过公共产物验证这种几何关系，容许半像素的边框与布局取整误差；显式的媒体圆角覆盖另行验证。

## 示例样式与公共样式的边界

Calendar 的组合示例要按实际预览宽度适配，而非只看浏览器断点：文档正文切成双列时，宽视口里的单张卡片也可能比手机容器更窄。宽示例的通栏占位来自 `upstream/reui/coverage.json`，注册文件由 `docs-examples.mjs generate` 生成；日期与时间面板使用有明确宽度的命名容器，双月视图保留两个月并自动换行。`CalendarLayouts.vrt.test.tsx` 在中英文、两档密度和四档容器宽度下检查全部 30 个预览的实际溢出，并验证缩窄后预约草稿与全部时间选项保留。尺寸切换会触发 Button 的几何过渡，溢出断言应等待计算几何稳定，不能只等两帧后立即取值。

ReUI 示例还有一层私有工具类编译。`ShowcaseExampleStyles.vrt.test.tsx` 运行在 Vitest Browser / Chromium 下，验证四个代表性源示例的布局、交互和公开控件计算样式；`node scripts/docs-example-styles.mjs` 则读取已构建的 docs CSS，并用临时夹具检查工具类与 dark 变体。运行后者前必须完成对应 docs 构建，否则会读取旧的 `build/client/assets`。资源 SHA 与路径另由 `node scripts/docs-example-assets.mjs` 验证；全量逐页浏览器用例还需检查真实加载和绘制。

私有 Tailwind 的默认 theme 导入和语义映射都必须使用 `inline reference`。仅有 `inline` 时，示例里的 arbitrary property 会触发默认 palette 或语义别名输出到 `:root` / `:host`，覆盖公共品牌变量。样式门禁检查实际生产 CSS 没有这类根赋值；不能通过放宽 no-root 断言来消除失败。

公共组件与后加载的私有工具类还会在同一个 utilities 层内竞争：Cascader 勾号原先同时带有 `opacity-0` 和祖先状态变体，变体使用 `:where()`，与普通工具类的特异性相同，后加载的私有 `opacity-0` 会让已选中的勾号透明。勾号现在根据选中状态只保留一个透明度工具类。`Cascader.vrt.test.tsx` 使用真实的 Cascader · 02 示例与完整 Showcase 样式，在三种主题、两种密度下检查选中、取消和清除后的勾号显示；单独加载公共样式无法覆盖这类样式顺序冲突。

NavigationMenu 的内容区与弹层都必须把基础全宽限制在 `md` 以下。生产文档站将公共组件放在 `exui` 层、应用工具类放在更高的 `utilities` 层；内容区保留无断点 `w-full` 时，桌面 `md:w-auto` 仍会被覆盖，与 Radix 的实测宽度形成循环约束。真实示例中弹层只剩 22px，而内部链接宽 320px，内容虽已挂载却被裁掉。只修弹层本身的宽度不足以解除这一约束。

文档预览的 `overflow-x: auto` 还会让另一轴的 `visible` 计算为 `auto`，裁掉 NavigationMenu 在普通文档流中展开的下半部分；该家族的预览需要单独允许溢出，其他家族保留原滚动约束。`NavigationMenu.vrt.test.tsx` 必须挂载生产 `ComponentExamplesHost` 并加载完整 docs 样式，逐个检查弹层链接的包含关系与中心命中，覆盖中英文、三种主题、两档密度及桌面/移动视口。只检查文字挂载、`aria-expanded`、首条链接或旧 Showcase 夹具都会漏掉其中一层裁切。

按族懒加载页首次打开时可能触发 Vite 依赖预优化并重载应用，导致已挂载预览与测试状态消失。Vite 与 Vitest 共用 `example-dependencies.ts` 的显式预优化列表，使辅助依赖在首次进入页面前可用。源码配置使用 NodeNext 的 `.js` import specifier 解析这份 `.ts` 文件；不需维护第二份 JavaScript 清单。

原本依赖当前时间的示例 fixture 使用 2026-02-09 固定基准；源场景已明确写死的日期继续保留，例如 TimePicker13 的 2026-10-01/14。公开 DateSelector 在 `value` 为空时仍以内部 `new Date()` 选取初始月份，且没有公开的 `viewMonth` 属性。不能为测试稳定性虚构业务 `value` 或冻结全局时钟；浏览器断言应依据当前实际月份或使用真实用户操作。该限制属于公开配置边界，不是示例覆盖的 `gap`。

双语展示不能改写已保存的业务值。TimePicker 的安排时间和 Questionnaire 的选择保留原值，显示时再翻译；Signature Pad 仅在名字确实为空时显示本地化的未署名占位，用户输入即使等于英文占位也必须原样保留。Emoji 回应保留 emoji、肤色与参与者等原始状态，展示名称从当前语言的公开 emoji 数据取值，再组合计数与 ARIA 文案。模板插值只翻译开发者选定的模板，用户参数不做递归翻译或替换。对应 Node/SSR 门禁见 [`TESTING.md`](../../../TESTING.md#showcase-reui-example-maintenance)；浏览器中的切换与交互仍需单独验收。

## 门禁实际上只在 Windows 上有效

截图基线的查找路径按**浏览器与平台**区分，仓库里提交的基线全部是 `*-chromium-win32.png`（见 [[showcase/02-windows-pinned-visual-baselines]]）。在其他平台上运行时不会找到匹配的参考图，因此：

- 本地在 macOS 或 Linux 上运行视觉测试，结果不能当作通过/失败的判据，只能当作"渲染大致没崩"的信号。
- 本地新采集的基线不能直接提交：它属于另一个平台变体，会与 CI 使用的基线并存并造成两套参考。
- 判定渲染是否变更，应以 CI（Windows）的结果为准。

## 预期产物与失败产物

- 失败时的附件写入 `.vitest-attachments/`，该目录已被忽略，不会污染工作区。
- 测试文件间串行执行（`fileParallelism: false`），因为多个套件共用同一个浏览器实例。单个套件内部的用例也在共享一个挂载容器：`beforeEach` 会 `document.body.replaceChildren(container)` 并重建 root，所以用例之间不能依赖 DOM 残留。
- 断言前必须 `await document.fonts.ready`。字体尚未替换时文本几何与最终值不同，直接读取会得到偶发失败。
- 需要读浮层几何时不能只读一次：Radix 在 resize observer 里异步重排，根字号或布局变化后立刻读取可能拿到旧位置。`RemSizing.vrt.test.tsx` 用轮询到几何稳定（或达到尝试上限）的方式规避，跨根字号断言尤其依赖这一点。

## 焦点与点击就绪

- Headless Tree 的 `useTree` 在挂载 effect 中调用 `setMounted(true)` 和 `rebuildTree()`；页面与预览外壳出现时，树节点仍可能为空。全量覆盖应轮询真实内容，再检查引用；交互用例应等待目标树节点出现，再读取或点击。树展开、权限保留与 Stepper 导航分别运行，保留各自断言及默认时间预算。
- Tooltip 的键盘用例先将目标预览滚入视口，并等挂载后的布局稳定；从目标触发器的本例父容器建立焦点，再通过真实 `Tab` 进入触发器。先打开目标 Tooltip、紧接着快速 `Shift+Tab` / `Tab`，可能与全局 Tooltip 开关时序竞争，测不到稳定的本例键盘入口。
- Button 页截图前把真实指针移到页面 `h1`，确认侧栏不处于 `:hover`。浏览器会保留上一个用例的指针位置；否则导航悬停样式可能进入下一张截图。本次三张 Windows 基线已在完整套件中通过；以后更新仍须在完整套件中审阅，不能只凭单例截图判定。
- 官方 Event Calendar 的标题所有权用例先等字体与两帧布局稳定，再等公开 `wasRecentDrag()` 返回 false，才真实单击事件并断言 Dialog 打开。公共 DnD 标志初始为 0，在新浏览器 realm 的最初 250ms 也可能报告近期拖动，事件点击处理会忽略该次 click。这个等待只为标题编辑路径建立可点击前提；它不验证最初 250ms 的公共交互体验，也不能据此推断此前间歇失败的根因。

## 截图比较带颜色容差，小幅改色不会变红

`toMatchScreenshot` 走 `@vitest/browser` 内置的 pixelmatch 比较器，默认 `threshold: 0.1`，`allowedMismatchedPixels` / `allowedMismatchedPixelRatio` 未配置时按 `0` 处理（见 `node_modules/@vitest/browser/dist/index.js` 里 `defaultOptions$1` 与 `pixelmatch()` 的实现）。判定标准是"单像素色差是否超过 YIQ 距离阈值"，不是逐字节比对：偏移落在阈值内的像素根本不计入不匹配像素数。

2026-09-21 实测：把 dark 主题的 `surface.modal` / `surface.menu` 从 `#181c25` 改成 `#1b1b1b`（通道变化 -3/+1/-10）并重建后跑 `pnpm test:visual`，12 文件 122 用例全绿，8 张受影响基线的 PNG 字节零变化——门禁既没失败，也没重写参考图。同一个比较器对版式、几何、字号和大幅颜色变化仍然有效，所以基线照旧无需为这类改动重抓。

**How to apply:** 纯色微调的验证证据不能取自"视觉测试通过"（跑 `-u` 同样不会写出新图）。要么直接断言解析后的计算值（`getComputedStyle` 探针读 `--exui-surface-*` 一类的变量并比较 RGB 通道），要么如实说明该改动没有图像级覆盖。

## 真实点击与表单布局

带 onBlur 校验的表单应让提交操作区保持位置稳定。字段错误或错误摘要在失焦时出现、消失，如果底部提交按钮因此移动，pointerdown 与 pointerup 可能落在不同位置，浏览器不会产生 click，更不会提交。只派发 submit 或调用表单方法无法发现这个问题。组件页的 Form 示例把操作区放在错误区之前；`ExUIPages.vrt.test.tsx` 使用真实点击并记录原生 submit 次数，同时验证无效提交和修正后的首次有效提交。

分步表单还需区分“继续”和最终 submit 的 DOM 身份。同步步骤更新可能在同一 click 的默认动作前，把复用的 button 从 type=button 改为 type=submit，导致刚进入 Review 就提前提交。Showcase 的 Continue 在点击中先 preventDefault，并为 Continue/Launch 使用不同稳定 key；回归断言确认 Review 时提交次数为零，点击 Launch 才提交，Reset 清除成功状态。

## 文档站的样式层可能遮住组件状态

文档站把公共组件样式放在 `exui` 层，应用工具类放在优先级更高的 `utilities` 层。因此，即使组件已经更新 `aria-pressed` 或 `data-state`，公共包里的选中背景规则也可能被应用生成的 `bg-transparent` 遮住；更具体的选择器不能跨层取胜。Toggle 与 ToggleGroup 曾因此在鼠标移开后失去选中底色，而悬停仍正常。

Toggle 移除了冗余的常态 `bg-transparent` 工具类，由已有的按钮基础样式提供透明底色，避免高层应用工具类匹配该控件。不要通过在应用层重新生成选中背景来修复：这会覆盖 Glass 材质和禁用态保护。此类问题需使用完整文档站样式验证，只挂载公共 CSS 无法复现应用层覆盖。`Toggle.vrt.test.tsx` 用真实示例，先移开鼠标再断言计算后的背景色，同时覆盖单选组的 `data-state`、普通 Toggle 的 `aria-pressed` 及 Glass 材质路径。

Resizable 的横向分隔线也受跨样式层的基础工具类影响：公共组件若同时携带 `w-px` 和横向 `w-full` 变体，高层应用工具类会将其压成 `1 × 1px`，在面板中部拖动无法命中。1px 宽度必须限定为竖向分隔线，避免它在横向仍匹配。`Resizable.vrt.test.tsx` 使用完整文档站样式和真实嵌套示例，在三种主题、两档密度及桌面/移动视口检查分隔线跨度、双向鼠标拖动与键盘调整；仅有公开 CSS 或键盘测试无法捕获这类命中区域退化。

## 前置依赖

Playwright Chromium 不随 `pnpm install` 安装：

```bash
pnpm --filter @exre/exui-docs exec playwright install chromium
```

该步骤同时是视觉测试与打包消费者浏览器门禁的前置条件；控制器复用 Showcase 锁定的 Playwright 版本，不由 `scripts/` 自己声明依赖。
