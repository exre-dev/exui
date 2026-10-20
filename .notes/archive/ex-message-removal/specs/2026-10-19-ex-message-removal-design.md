# 删除 ExMessage，统一使用 Sonner

日期：2026-10-19\
状态：已获用户批准（2026-10-19）；按本文范围实施，不代表已发布\
模块目录：`.notes/archive/ex-message-removal/`\
后续 RFC：[ExMessage 移除与 Sonner 消费迁移](../rfcs/ex-message-removal-rfc.md)

后续发布决策（2026-10-19）：用户明确要求保留合并后的 `.changeset/form-and-notification-updates.md` 及其 `minor` 级别，取代本文原先的 major Changeset 约定。删除公开 API 仍作为 Breaking Changes 明确记录；其他批准范围不变。

## 决策摘要

从 `@exre/exui` 删除 `ExMessage`、`ExMessageContext` 及其公开类型，不保留别名、弃用壳或替代的消息控制器。全局通知统一通过根入口公开的 `Toaster` 和 `toast` 使用包内同一份 Sonner；页面内的持续提示继续使用 `Alert`。

同步迁移本仓库的通知调用、示例宿主、源码分享模板、打包消费验证、文档与唯一消费 skill。开发和验证完成后，依据最终行为编写中英文升级指南，帮助使用旧 API 的应用迁移。此次工作不修改其他仓库、不发布包，也不宣称下游迁移完成。

## 已确认的需求与依据

用户已确认删除 `ExMessage`，并要求交付 Spec、RFC、开发结果和旧用户升级指南。用户特别要求确认的能力是“显示 loading，并在收到回调后更新为成功或失败”；这个能力由原生 Sonner 提供，必须在公开包消费者中验证。

已核对的当前事实：

- 消息宿主 `packages/components/src/components/ex-message-context.tsx` 内部渲染既有 `Toaster`，没有独立的通知呈现实现；该文件按本设计删除。
- 消息控制器 `packages/components/src/lib/ex-message-controller.ts` 额外维护 ID、容量、加载阶段、待发布消息和截止计时器；该文件按本设计删除。
- [Sonner 适配](../../../../packages/components/src/components/ui/sonner.tsx) 已公开包内 `toast`，并提供主题、图标、圆角、响应式宽度和根字号适配；这些适配继续保留。
- 本地安装的 Sonner 版本为 2.0.7。`toast.loading` 返回 ID；`toast.success/error/loading` 可以用同一 ID 更新；`toast.promise` 自动转换加载、成功和失败状态。
- 现有 [Promise 示例](../../../../packages/docs/src/showcase/examples/sonner/c-sonner-7.tsx) 和 [按 ID 更新示例](../../../../packages/docs/src/showcase/examples/sonner/c-sonner-21.tsx) 已展示这些原生能力。
- [既有消息设计](../../ex-message/specs/2026-09-28-ex-message-exui-design.md) 与 [单宿主决策](../../../../.ai/decisions/components/06-single-ex-message-host.md) 记录了旧契约。本 Spec 批准后将取代旧契约，不把尚未实施的删除写成当前行为。

## 目标和非目标

目标：减少全局通知入口和自维护状态，使文档、导出与实际推荐用法一致；保留 loading 原地更新、Promise 结果提示、主动关闭和 ExUI 呈现适配；明确列出所有不等价行为。

不在本次范围：将 `Alert` 改造成全局通知；重写 Sonner；新增公开 `Notification` 包装层；把旧控制器的容量、失效和初始化缓冲规则搬入 `Toaster`；修改通知视觉风格；修改 ExWebsite 或其他下游应用；发布、提交或推送。

## 方案选择

| 方案 | 结果 | 取舍 |
| --- | --- | --- |
| 直接删除并迁移到 `Toaster/toast`，本方案 | 只有一套全局通知 API | 需要下游同步迁移；旧管理规则明确退场 |
| 先弃用一个版本 | 给下游更长过渡期 | 持续维护两套入口，与本次明确的删除要求不符 |
| 删除名称，同时把控制器藏入新的包装层 | 表面上移除旧名称 | 继续承担同样的状态复杂度，不能达到收敛目的 |

采用第一种方案，不通过别名维持旧导入。升级指南提供迁移路径；需要保留旧生命周期策略的应用自行拥有该业务状态。

## 公开契约

### 删除的导出

| 类别 | 删除名称 |
| --- | --- |
| 运行时 | `ExMessage`、`ExMessageContext` |
| 类型 | `ExMessageContextProps`、`ExMessageLoadingHandle`、`ExMessageOptions`、`ExMessagePlacement` |

删除对应源文件及其仅服务于旧 API 的私有实现。通过打包消费类型检查拒绝旧导入，通过实际产物检查确认旧运行时导出不存在。历史 Changelog 和既有设计记录保留其历史叙述，不要求抹去全部历史文本。

### 保留的入口与配置

通知相关运行时入口为 `Toaster` 与 `toast`，均从 `@exre/exui` 导入；消费者不需要另装 Sonner，也不能混用另一份 Sonner 的 `toast`。

不改变公开 `Toaster` 的现有默认值和选项。迁移旧应用时显式设置下列属性，以延续旧消息入口的位置和普通提示时长：

```tsx
import { Toaster } from "@exre/exui"

export function NotificationHost() {
  return <Toaster position="top-right" duration={3000} visibleToasts={3} />
}
```

应用在稳定的根节点挂载一次宿主。`placement` 映射为 `position`；`duration` 采用 Sonner 原生选项；`maxCount` 没有完全等价的原生属性，不能把它机械改名为 `visibleToasts` 后宣称行为不变。

### 调用迁移

| 旧用法 | 新用法 |
| --- | --- |
| `ExMessage.info(content, options)` | `toast.info(content, options)` |
| `ExMessage.warn(content, options)` | `toast.warning(content, options)` |
| `ExMessage.error(content, options)` | `toast.error(content, options)` |
| `ExMessage.success(content, options)` | `toast.success(content, options)` |
| `ExMessage.dismiss(id)` | `toast.dismiss(id)` |
| `ExMessage.loading(content)` | `toast.loading(content)` 返回 ID |
| `handle.onSuccess(content, options)` | `toast.success(content, { ...options, id })` |
| `handle.onError(content, options)` | `toast.error(content, { ...options, id })` |
| `handle.dismiss()` | `toast.dismiss(id)` |
| Promise 任务配合 loading 句柄 | `toast.promise(task, { loading, success, error })` |

回调完成或进度变化时沿用同一个 ID；结果提示可以显式设置 `duration`。需要业务取消、超时或路由失效保护的任务使用按 ID 更新方式，由应用先检查任务仍有效，再更新提示。

### 明确退场的管理行为

| 旧规则 | 删除后的约定 |
| --- | --- |
| `maxCount` 淘汰最早的托管记录 | `visibleToasts` 只限定可见数量；采用 Sonner 原生队列，不自动淘汰旧记录 |
| loading 的显式 `duration` 是关闭截止时间 | 不依赖原生 loading 的 `duration` 实现业务截止；应用使用计时器并负责清理 |
| 句柄完成一次后拒绝后续结果 | 应用通过任务状态拒绝重复或过期回调 |
| 关闭、超时或逐出后，迟到回调不会重新显示 | 原生按 ID 更新不提供这项旧保证；应用关闭时同时使任务失效 |
| 宿主卸载自动清理所有托管消息及计时器 | 应用或示例释放自己创建的消息、计时器和订阅；卸载 `Toaster` 不等同于清空 store |
| 拒绝重复宿主、宿主登记前调用，以及缓冲订阅前消息 | 不新增等价运行时校验或缓冲；文档要求先挂载稳定宿主，再触发通知 |
| 控制器验证参数并抛错 | 采用 Sonner 原生参数契约，不维持旧包装层专属异常 |

`toast.promise` 适合跟随 Promise 完成的普通提示。需要“取消后永不重现”时，不承诺单独 `dismiss` 足够，也不承诺 Promise 自动取消；指南必须展示业务有效性检查和资源清理。

## 仓库内迁移范围

### 组件库与消费者

删除公开导出、类型和两份旧源文件，保持 `components/ui/sonner.tsx` 的呈现适配和共享实例不变。将打包消费夹具改为直接挂载 `Toaster`、调用根入口 `toast`，验证初始化后的普通通知、loading 同 ID 完成、Promise 成功/失败和关闭。

旧包装层专属断言随契约删除。原来放在 ExMessage 测试中的 Sonner 图标、主题及共享实例行为，迁入 Sonner 测试继续覆盖，不能因为文件名属于 ExMessage 就整份丢弃。

### 文档站、Showcase 与分享源码

将 `ComponentExamplesHost`、Overview、Showcase 外壳以及分享工程入口中的 `ExMessageContext` 替换为同一公开 `Toaster`。旧 ExMessage 家族和代表卡片从 catalog、展示清单、示例注册及分享清单删除；其他示例中的成功提示直接改用 `toast.success`。

保持现有示例归属和路由清理边界：示例只关闭自己创建的通知；切换家族时保留共享宿主和外部通知；loading 的定时器、Promise 回调及其他资源随示例释放。源码抽屉继续独立于示例的密度与 Portal 归属。分享源码中的宿主与通知调用必须使用同一包内实例。

移除 `exui-ex-message-1`、`exui-ex-message-2` 分享 ID，删除脚本中仅服务于旧家族的分支。异步用法归入 Sonner；复用已有官方示例，不为迁移改写固定上游源或挪用官方 ID。确需补充交互时使用现有 ExUI 扩展示例机制。

### 文档与 skill 同步

维护 `skills/exui` 中的通知说明、用例、缩放边界和生成导出索引。双语 Sonner 家族页成为全局通知的主要入口，不再要求 `ExMessageContext`。保留 `Toaster` 的 ExUI 适配和包内实例说明，移除“托管消息”能力，重新关联仍保留的 `Toaster/toast` 公开能力。

修改能力清单、双语源片段和源码审阅记录，再通过现有脚本生成有界内容和索引。生成操作不能顺带接受无关实现或参考文档变化；不手改生成产物。更新 README、测试说明和静态库存中受影响的条目及数量。

本阶段不提前修改 `.ai/`。设计批准并完成实施后，再按仓库要求更新消息架构、生命周期说明、旧决策状态及索引；历史设计不改写为新设计，也不把提案记录为已落地。

## 升级指南交付

开发和验证完成后编写，发布内容为：

- `packages/docs/content/zh-CN/getting-started/ex-message-migration.mdx`
- `packages/docs/content/en/getting-started/ex-message-migration.mdx`

将新指南注册为普通指南，不声明 `exampleFamily`；从 Sonner 家族页和通知 skill 链接进入。删除原 `content/{locale}/exui/ex-message.mdx` 家族页和对应预渲染路由；旧 URL 不保留重定向或兼容页面，按站点现有未找到行为处理。本次不扩展站点路由框架。

指南必须包含：

1. 适用范围与破坏性变更说明。开发时不虚构发布版本或发布时间；使用“包含本次移除的版本”，由实际发布记录确定版本号。
2. 根入口导入、样式导入、宿主替换及显式保留旧默认呈现配置。
3. 所有旧方法与四个旧类型的迁移说明，特别指出 `warn` 改为 `warning`，loading 返回值从句柄改为 ID。
4. Promise 自动转换和回调按 ID 更新两种完整示例；包括成功、失败、主动关闭和结果提示时长。
5. 带业务取消或截止时间的完整示例：先使任务失效，再关闭通知；完成、取消和卸载均清理计时器；重复及迟到回调不能重现结果。
6. 可见数量与淘汰、loading 截止、初始化时序及宿主卸载清理的差异；明确 `toast.promise` 不代替任务取消。
7. 升级自查步骤，以及到 Sonner 文档的有效链接。

旧 API 的 before 片段作为历史说明，不参与面向新包的成功编译；所有完整 after 示例必须通过实际公开包类型检查。取消示例需要行为验证，不能只凭代码片段可编译就宣称防止重现。

## 版本、实施顺序和回退

移除已公开 API 是破坏性变更。开发阶段添加针对 `@exre/exui` 的 major Changeset，不手改版本和历史 Changelog，不消费其他待发布 Changeset。

用户已要求完成开发，无需在批准范围内反复申请实施授权。顺序为：用户审阅本 Spec → 在同一模块目录形成一个实现就绪 RFC → 按批准范围迁移组件库、调用方与门禁 → 验证替代行为 → 编写并验证升级指南 → 汇报结果。本文是设计，不是实施完成报告。

此次变更不涉及持久化数据迁移。发布前的回退是撤销本次有界代码和文档差异；发布后由消费者回退至仍含旧 API 的版本，并恢复相应调用代码。不得通过无意恢复别名改变已批准的新公开面。

## 验证与验收

遵循 [TESTING.md](../../../TESTING.md)，使用 Node.js 24、pnpm 11.9.0，按依赖顺序准备产物；不并行运行会共享生成产物的构建和类型检查。

| 验收项 | 所需证据 |
| --- | --- |
| 旧 API 确实移除 | 打包消费者的旧运行时与类型导入负例；生成声明和根导出无旧符号 |
| loading 能收到结果后原地更新 | 根入口 `toast.loading` 的同 ID 成功、失败和多次进度更新浏览器断言 |
| Promise 能完成 | 可控 Promise 的 loading、resolve、reject 断言，不依赖随机网络或固定等待 |
| 关闭与取消示例正确 | 原生 dismiss 验证；指南示例对迟到/重复回调、取消和计时器清理的行为验证 |
| ExUI 适配保留 | 保留或迁移现有图标、主题、圆角、宽度及根字号相关回归 |
| 文档站没有悬空依赖 | catalog、公开示例、分享源码、双语导航和静态链接门禁；家族切换与外部通知保留回归 |
| 新指南可消费 | 完整 after 示例编译；中文与英文页面在 `/` 和 `/exui/` 构建中可访问 |
| 包内实例没有分裂 | 根入口 Toaster/toast 的独立打包消费者行为验证；不增加外部 Sonner 依赖 |

开发中先运行相关 Node、Sonner、DocsExamples、分享与打包消费用例，最终执行 `pnpm check` 和完整 `pnpm verify`。完整流程已覆盖的阶段不为凑次数单独重复。若环境或既有失败阻止某项验证，记录具体失败和已验证范围，不把局部通过写成完整通过。

执行能力与 skill 生成前，先核对当前源码并遵循 `TESTING.md` 的显式审阅/接受顺序。对旧通知 URL 和分享 ID 的移除采用明确的预期库存变更，不通过放宽通用验证隐藏缺失。

## 审阅要点与风险

- 用户已批准完整范围，包括直接移除、不保留旧路由、major Changeset 及生命周期差异。
- 不假设下游项目当前未使用旧 API。指南提供迁移依据，跨仓库迁移和生产验证另行授权。
- 原生 toast 不能无条件复现旧句柄的失效保护；该差异通过文档和有验证的应用示例呈现，不新增库级包装层。
- 工作区已有其他变更。实施时基于最新文件做有界修改，保留已有表单、文档和测试整理；不回退无关工作。
- Spec、RFC、代码验证、包发布和下游验收分别报告，不相互替代。
