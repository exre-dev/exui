# 通知的订阅时序与应用清理约束

最后更新：2026-10-19

结构与任务所有权见 [全局通知](../../architectures/components/notifications.md)。

- Sonner 的宿主在 effect 中订阅。宿主尚未订阅时发出的通知不能当作可靠的初始化队列；先挂载稳定宿主，再触发通知。已删除的包装层曾缓冲特定兄弟 effect 时序，当前公开入口不承诺这项旧行为。
- 卸载宿主只移除呈现，不等于清空 Sonner store。docs 家族切换必须保留共享宿主，由示例自己的资源边界清理通知；给整个 Host 按家族设 key 会使外部消息失去可见 DOM。
- `dismiss(id)` 关闭通知而不取消业务任务。随后用同一 ID 更新，或者让未取消的 Promise 继续完成，可能重新发布结果。应用需要在取消、截止或卸载时先使任务失效，并在回调入口检查有效性。
- loading 的原生时长选项不承担旧包装层的关闭截止语义。应用计时器在完成、取消和卸载时均要清理；`visibleToasts` 是显示上限，不是旧记录淘汰机制。
- 订阅可能同步返回结果，也可能在清理时触发回调。应用示例先使任务失效再清理订阅，并处理结果早于 unsubscribe 赋值的情况，避免丢失清理或重复发布。

证据：包内 Sonner 2.0.7 的通知 store 与宿主订阅行为、`packages/docs/src/showcase/examples/_shared/example-runtime.tsx`、`skills/exui/examples/sonner-callbacks.tsx`、`packages/docs/tests/browser/SonnerCallbacks.vrt.test.tsx`。
