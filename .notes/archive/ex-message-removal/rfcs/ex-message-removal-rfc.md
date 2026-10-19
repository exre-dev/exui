# ExMessage 移除与 Sonner 消费迁移 RFC

日期：2026-10-19\
状态：实施依据；源 Spec 已获用户批准\
模块目录：`.notes/archive/ex-message-removal/`\
源设计：[删除 ExMessage，统一使用 Sonner](../specs/2026-10-19-ex-message-removal-design.md)

## 决策与兼容边界

删除根入口的 `ExMessage`、`ExMessageContext` 和 `ExMessageContextProps`、`ExMessageLoadingHandle`、`ExMessageOptions`、`ExMessagePlacement`，同时删除 `components/ex-message-context.tsx` 与 `lib/ex-message-controller.ts`。不增加别名、运行时兼容壳或新的消息服务。

保留现有 `components/ui/sonner.tsx` 及其根入口导出。主题、图标、响应式几何、圆角与根字号适配不变。应用从 `@exre/exui` 同时导入 `Toaster` 和 `toast`，共享包内 Sonner。页面内 `Alert` 不受影响。

本次为破坏性变更，增加 `@exre/exui` major Changeset。版本与历史 Changelog 由正式发布流程处理，本地不发布、不提交、不推送、不修改下游仓库。

## 通知契约

根宿主在稳定组件树中挂载一次。需要保留旧呈现默认值的本仓库宿主使用 `position="top-right" duration={3000} visibleToasts={3}`。这只延续位置、普通消息时长及可见数量，不复现旧的容量淘汰。

普通调用改为 `toast.info/success/error/warning`；其中 `ExMessage.warn` 必须改为 `toast.warning`。`toast.loading` 返回 ID，进度和完成调用都传入相同 ID。Promise 提示使用 `toast.promise`，成功和错误函数可根据结果返回内容。主动关闭使用 `toast.dismiss(id)`。

旧控制器的队列淘汰、截止计时、重复完成防护、宿主登记校验、订阅前缓冲和卸载清理不搬入公开组件。应用拥有任务有效性和计时器；取消时先失效任务再关闭消息，回调先检查有效性再更新。裸 `toast.promise` 或 `dismiss` 不承诺取消底层任务，也不承诺拒绝所有迟到更新。

## 实施单元与文件责任

| 单元 | 修改范围 | 约束与结果 |
| --- | --- | --- |
| 公开面 | `packages/components/src/index.ts` 与两份旧源文件 | 只删除六个公开名称及旧实现，保留 Sonner 适配 |
| 文档运行时 | `ComponentExamplesHost.tsx`、Overview、Showcase、`pages/exui.tsx` | 替换宿主、迁移保留示例中的通知；移除旧通知家族和卡片 |
| 导出与片段 | `scripts/docs-sharing.mjs`、`scripts/docs-snippets.mjs` | 分享工程根宿主改为 Toaster，移除旧家族专用提取分支 |
| 内容与能力 | 双语 MDX、`capabilities.json`、源片段和 `source-review.json` | `Toaster/toast` 继续有准确能力关联；删除旧家族页和分享 ID |
| 消费指导 | README、`skills/exui`、生成索引 | 全局通知只推荐公开原生入口，不引入外部 Sonner 实例 |
| 测试 | 公开包类型、打包消费者、Sonner 与文档回归 | 移除旧专有规则的断言，保留原生呈现与归属行为覆盖 |

保留当前工作区已有的表单、Field、测试目录和文档整理，只在最新内容上做与通知迁移相关的有界修改。所有生成文件通过现有维护脚本更新，不以恢复 HEAD 或重置目录的方式清理。

## 示例与宿主生命周期

继续使用现有示例资源所有权：原生 Sonner 示例的 runtime 追踪自身通知、定时器和异步代次；示例卸载时只清理自身资源，不调用无范围的全局 `toast.dismiss()`。

文档家族切换保留 `ComponentExamplesHost`，内部家族会话卸载并清理自己的通知。外部通知继续显示，不因切换家族重建共享 Toaster。离开整个示例宿主时，示例资源清理必须完成，不能依赖移除 Toaster 自动清空 store。

`exui-ex-message-1` 和 `exui-ex-message-2` 不再进入 catalog、源码分享、静态预渲染与浏览器库存。使用已有 Sonner 状态、Promise、进度示例替代通知验证目标。原上游源和官方 ID 不因迁移改写；测试预期应选择真实现存示例。

## 内容生成与升级指南

普通家族从每种语言 89 个减为 88 个，指南从 10 个增为 11 个；展示分类按当前 Form 分类规则计算，删除 ExMessage 后 Blocks 只保留 Glass。数量以维护源计算，更新约束库存而不放宽一致性检查。

将旧 `message-host` 能力改为准确描述包内共享 Toaster/toast 的能力，并保留仍存活符号的覆盖。先审查能力映射和公开面，再显式接受源码快照，然后生成有界能力段与 skill 索引；不得顺带接受未审阅的无关差异。

先完成代码迁移及关键异步行为验证，再编写：

- `packages/docs/content/zh-CN/getting-started/ex-message-migration.mdx`
- `packages/docs/content/en/getting-started/ex-message-migration.mdx`

指南注册到既有 `guideIds`，不声明 `exampleFamily`。从 Sonner 页面与通知 skill 链接到指南；旧 `exui/ex-message` 页面和 URL 删除，不新增兼容路由或重定向。静态内容和分享基线经现有生成流程更新。

指南覆盖所有方法和四个类型的去向、根宿主与样式、显式默认配置、Promise 与回调两种更新模式，以及容量、截止、取消、迟到回调和卸载差异。完整 after 示例可编译；需要取消和截止保护的示例提供实际可运行的应用代码，并通过可控任务和计时器验证。历史 before 片段不作为新公开包的编译用例。尚未发布时不填写猜测的升级版本。

## 测试契约与执行顺序

1. 先添加公开包移除名称的类型负例和相应产物断言，在旧实现上确认失败，防止只改文档而保留旧导出。
2. 对公开 `Toaster/toast` 保留呈现与共享实例测试，并增加同 ID loading→进度→成功/失败、Promise resolve/reject、主动关闭的消费者行为验证。可控 Promise 用于结果分支，等待实际 DOM 状态，不靠任意延时。
3. 原 ExMessage 文件中仍属 Sonner 契约的图标/主题断言迁移到 Sonner 测试；旧宿主双挂载、参数异常、容量淘汰和句柄规则不再作为公开契约测试。
4. 更新 docs 的通知 Portal 归属、compact 密度、源码抽屉隔离、家族切换清理和外部消息保留验证。分享源码仍须在隔离消费者中编译运行。
5. 指南加入后验证 after 示例编译、取消后迟到成功/失败、重复回调、截止和卸载清理。原生加载通知不等同业务超时的边界必须有明确说明。
6. 按 `TESTING.md` 串行执行所需构建与生成，运行聚焦 Node/浏览器门禁，再执行 `pnpm check` 与 `pnpm verify`。最终 verify 覆盖的独立门禁不重复凑次数。

使用 Node.js 24 和 pnpm 11.9.0。只由协调执行方运行会修改共享产物的 build、声明生成、内容生成和整体校验，避免不同任务同时删除/重建 `types` 或 docs build。

## 失败模式与验收

| 失败模式 | 防护与证据 |
| --- | --- |
| 只删实现，类型或运行时仍暴露旧名称 | 实际公开声明消费负例及生产打包产物检查 |
| callback 创建新消息而非更新 | 根入口消费者检查同一 ID/通知 DOM，状态与内容均改变 |
| 示例卸载后 Promise 重现通知 | 继续使用已有资源代次边界并验证家族切换；指南应用例单独验证任务失效 |
| 替换宿主导致外部通知消失 | 保持共享宿主位置，验证家族切换后外部消息可见 |
| 把 `visibleToasts` 误写为淘汰策略 | 指南明确行为差异，不添加伪等价包装 |
| 删除家族后残留源码或导航链接 | 内容、分享、搜索与根路径/子路径静态验证全部使用新库存 |
| 文档生成意外覆盖他人改动 | 保留基线差异，限制修改来源与范围，复核生成 diff |

验收要求所有六个旧名称从当前公开面移除；运行时无旧控制器；普通、异步和回调通知在包内共享实例正常工作；升级指南可访问且示例通过；指定验证结果可复现。未通过的环境或既有门禁必须单独报告，不能写成通过。

## 回退和交付边界

不涉及持久化数据。发布前按本次差异撤销，保留无关工作；发布后消费者回退到含旧 API 的已发布版本，并恢复旧调用。回退不通过重新暴露隐藏别名实现。

交付时分别给出 Spec、RFC、升级指南位置、源码变更摘要、实际执行的验证和限制。没有发布行为就不宣称发布，没有下游运行证据就不宣称下游升级完成。`.ai/` 只在实现证据确定后更新当前边界和被替代决策。

## 自审

已逐项对照批准的 Spec，未增加兼容窗口、路由改造或通知包装层。公开契约、任务所有权、文档生成顺序、失败分支和验收门禁均有实施依据；无待定的阻塞设计问题。Spec 保留为源设计，本文不替代或重写其内容。
