# 表单结构与状态边界

最后更新：2026-10-19

表单在唯一公开包根入口提供统一 `Form`、绑定字段 `FormField`、`FormList` / `FormErrorSummary`、独立 Field 原语和同源 hooks。消费用法与属性说明见 [`Form` 参考](../../../skills/exui/references/exui/form.md)。它们不创建新包或子入口；实现依赖的打包边界沿用 [[components/01-bundle-implementation-dependencies]]。

## 数据与请求流

`use-form.ts` 创建 RHF 实例与 facade。内部 RHF 只负责输入值、注册、dirty/touched 和错误记录；校验不接入其 resolver、rules 或原生提交入口。`context.ts` 的私有 WeakMap 将 facade 与内部实例关联，组件及 hooks 通过它检查实例来源。Context 负责同一实例的连接，不接受消费方另建的 RHF 实例。

`types.ts` 区分 schema 输入与输出：输入决定字段路径、控件值、默认值及读写类型；完整校验成功后才将输出交给业务提交函数。`standard-schema.ts` 保留完整的上游 V1 结构类型和许可，校验实现由消费方提供。`paths.ts` 负责安全路径、容器快照与按原路径投影，不读取 Zod 的内部结构。

`validation.ts` 将每条原始 issue 归属到字段或逻辑根目标。权威记录保存在 RHF 的固定私有叶 `root.__exui`，字段路径是记录中的数据，不能与错误节点的 `message/type/ref` 元数据相互覆盖。公开错误视图和 React state 快照由记录派生；后续合并重新读取 RHF，派生视图不作为另一份可写 store。

`coordinator.ts` 管理请求批次、输入 revision、生命周期 epoch、提交 attempt 和 scope 定义版本，不另存长期输入值。它将 RHF 的基础状态与请求状态合成缓存快照，`useSyncExternalStore` 向 owning hook、Context 及字段组件发布更新。读取具体值的观察使用同源 RHF `useWatch`，不能用一次 `getValues` 读取代替值订阅。

## 展示与导航

`components/patterns/` 中的组件复用基础控件：`FormField` 通过内部 `useController` 注册字段，再将 change/blur 经协调器处理；适配器将 id、aria、ref 和绑定事件送到实际控件。标题与描述在同一标题区，控件区只容纳输入项及出现时的错误；无效状态的标题区保持普通文字颜色，输入项和错误各自处理无效外观。描述和错误各有稳定 id 供输入项通过 `aria-describedby` 关联。配置层递归生成普通字段和对象数组列表，不在配置遍历中调用 hook。

`Form` 根据 `fields !== undefined` 选择配置式分支，否则走组合式；同一挂载期间切换分支会被拒绝，需新 React key。两条路径复用私有 `FormShell` 与单一原生 form owner。`form-configured.tsx` 初始化 schema 实例或接入既有实例，负责字段、步骤与 footer 的配置渲染。`FormField` 通过私有 `FormFieldLayout` 复用标题与内容外壳；该组件与布局上下文不公开。独立 Field 原语由消费侧组合，要求显式控件 ID 与 ARIA，不读取 Form 布局上下文，也不补全子 Input 关联。旧展示容器的历史取舍见 [[components/07-ex-item-presentation-boundary]]，该记录不代表当前 API。

表单适配器的默认输入背景与描边以 `form-control` 配方为准：搜索式多选容器使用该配方的背景和普通态描边，保留自身聚焦及错误态；日期与文件控件只在表单范围内覆盖 `outline` 按钮的背景、描边变量，保留普通按钮的配方。`FormAppearance.vrt.test.tsx` 比较控件计算背景色，`FormAppearance.vrt.test.tsx` 检查三主题下输入表面的 1px 描边及其与填色的区分。

日期适配器在同一绑定边界组合公开的 `Button`、`Popover` 与 `Calendar`。表单草稿仍存 `YYYY-MM-DD` 字符串；弹层将当前值转换为本地日历日期，选择后写回字符串。`min` / `max` 控制可选日期和月份导航；默认值及重置仍由表单实例管理。消费用法见 [`Form` 参考](../../../skills/exui/references/exui/form.md)。

`form-steps.ts` 只保存步骤配置和导航任务。scope 的字段及显式依赖决定验证投影，局部输出丢弃；最终提交仍验证完整 schema。受控切步由父组件确认，值与错误继续属于同一表单实例。焦点登记只包含标签、步骤与真实元素，不保存字段值。

`Form` 的可选 `formatIssue` 在字段错误和摘要渲染时转换消息，`issueSeparator` 控制摘要中多条消息的分隔符；协调器和公开 `form.state.errors` 保留 Schema / 服务端给出的原始消息。`Form` 不自动渲染摘要；需要时将 `FormErrorSummary` 作为子组件放入任一分支的 `Form`，它从最近上下文读取同一实例与导航能力，标题由自身的 `title` 控制。配置式的步骤和前后按钮文案，以及文件控件的大小/删除标签可由消费方传入。Showcase 用这一显示边界切换语言，同时保留表单草稿，具体状态来源见 [`showcase/consumption`](../showcase/consumption.md)。

`FormErrorSummary` 的展示层复用公开 `Alert` 的 destructive 变体，以 `CircleAlertIcon`、`AlertTitle` 和 `AlertDescription` 组合错误列表，沿用 `c-alert-4` 的结构。摘要自身只保留长文本换行和字段链接的交互样式，边框、颜色与外壳间距由共享 Alert 管理。

`form.css` 使用具名容器与有限列数；表单容器宽度决定网格，横向字段根据自身宽度决定标题与控件并排还是上下排列。Dialog 内的窄表单不依赖页面视口断点。Showcase 预览和行为测试只消费公开产物。跨工作区的构建顺序仍见 [`overview`](../overview.md)。

证据：`packages/components/src/lib/forms/`、`src/hooks/use-form*.ts`、`src/components/patterns/`、`src/form.css` 和 `src/index.ts`；`packages/docs/src/showcase/FormExamples.tsx`、`FieldLayout.vrt.test.tsx` 与 `Form*.vrt.test.tsx`；隔离消费者 `packages/components/tests/consumers/form-consumer-fixture.mjs`。
