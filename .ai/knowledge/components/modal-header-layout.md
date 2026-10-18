# Modal 标题动作的首行对齐

历史适用范围：以下内容记录已移除的 ExUI `Modal` 布局，不是当前 `Dialog` 的 API 或样式契约。当前公开包从 ReUI 的 `Dialog` 组合组件导出，不提供 `Modal` 兼容层。

标题动作按钮的高度来自按钮 Token，可能大于标题的行高。按钮按两者高度差的一半向上偏移，才能对齐标题的**首行**；不能按整个标题区垂直居中，否则长标题或说明换行后按钮会向下漂移。

带动作的标题区使用独立按钮列和可收缩的文字列。文字列需要 `minmax(0, 1fr)` 和 `min-width: 0`，才能延续长标题换行与窄屏无横向溢出的约束。没有动作时保留原有标题结构；标题区仍是初始聚焦的可滚动区域，Tooltip 不应取得打开时的焦点。

历史证据：版本历史中的 `packages/components/src/components/patterns/modal.tsx`、`packages/components/src/modal.css` 与 `packages/showcase/src/showcase/Modal.vrt.test.tsx`。当前入口与 Dialog 证据见 [公共包入口](../../architectures/components/public-surface.md)，消费用法见 [Dialog 参考](../../../skills/exui/references/components/dialog.md)。
