# Scrollspy 示例的锚点关联

最后更新：2026-10-17

文档页和组件总览可以同时挂载同族示例，`ExampleRuntimeProvider` 因而给每个实例的 DOM ID 加入独立前缀。Scrollspy 示例的 `data-scrollspy-anchor` 必须使用当前实例的 `useExampleRuntime().id`，与 section 的 ID 采用同一映射。仅转换 section ID 会让公共 Scrollspy 的目标查找全部失败。

这种断开的关联不会表现为完全没有选中项：Scrollspy 默认选择首项，到达容器底部又强制选择末项，所以首尾可激活并不能证明中间 section 可被定位。回归须实际滚动到中间 section，并检查点击后的内容位置；多实例覆盖还应确认滚动一个预览不会改变另一个预览的选中项。

本约束属于示例消费层，不需要改变公共 Scrollspy 的 ID 查找规则。证据见 [`Scrollspy.vrt.test.tsx`](../../../packages/docs/tests/browser/Scrollspy.vrt.test.tsx) 及两个 [`scrollspy` 示例](../../../packages/docs/src/showcase/examples/scrollspy/)。运行前提见[视觉测试知识](visual-test-constraints.md)。
