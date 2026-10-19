# 全局通知的实例与任务边界

最后更新：2026-10-19

全局通知由根入口公开的 `Toaster` 与 `toast` 承担。它们来自 `components/ui/sonner.tsx`，共享打包进 ExUI 的一份 Sonner；消费者自装的 Sonner 不参与这个 store。页面内持续信息由 `Alert` 承担，不经过通知队列。移除旧包装层的理由见 [[components/08-native-sonner-notifications]]。

## 所有权与流向

应用在稳定组件树中挂载宿主，触发普通通知、Promise 结果或同 ID 加载更新。Sonner 持有通知状态；ExUI 适配只处理主题、图标和可缩放几何，不另设容量注册表、宿主登记器或任务控制器。`ExMessage`、`ExMessageContext` 及其四个类型已从当前源码公开面移除。

业务任务的有效性、取消、截止计时与清理由消费应用负责。应用可以在关闭通知时使任务失效，收到结果后只更新仍有效的 ID。消费用法与可编译例子由 [通知参考](../../../skills/exui/references/exui/notifications.md) 维护；初始化、卸载和重现风险见 [生命周期约束](../../knowledge/components/notification-lifecycle.md)。

docs 的示例资源 runtime 追踪其创建的消息、计时器和异步代次。家族会话卸载时清理自己的资源，共享宿主在家族切换期间保留，外部通知不归示例所有。分享源码也从同一根入口挂载宿主和发通知。

## 验证边界

Sonner 浏览器回归覆盖现有呈现适配、同 ID 更新、Promise 与主动关闭；打包消费门禁从独立 tarball 消费者检查导出、声明和实际渲染。应用取消示例有独立浏览器用例。实际验证结果按本次运行报告，不因存在这些文件就推断全部门禁已经通过；本地源码和打包验证也不等同于发布或下游迁移。

证据：`packages/components/src/components/ui/sonner.tsx`、`packages/components/src/index.ts`、`packages/docs/app/components/ComponentExamplesHost.tsx`、`packages/docs/src/showcase/examples/_shared/example-runtime.tsx`、`scripts/docs-sharing.mjs`、`packages/components/tests/consumers/verify-packages.mjs`。
