### Trace 状态与详情展开

ExUI 从 `@exre/exui` 导出 `Trace`、`TraceLine`、`TraceIcon`、`TraceTitle`、`TraceDescription`、`TraceCollapsible`、`TraceCollapsibleTrigger` 和 `TraceCollapsibleContent`。每行或触发器内组合 `TraceLine`；它本身是普通的 span，需要由外层链接或按钮承载操作。`TraceIcon` 仅作装饰，因此应在 `TraceTitle` 中用文字写明运行、失败或等待状态，不能只依赖 `TraceLine` 的颜色。

独立展开使用 `defaultOpen`；受控展开同时传入 `open` 和 `onOpenChange`。嵌套行各自维护状态。ExUI 的 Radix Luma 配方提供间距与焦点样式；运行中的闪烁、内容展开动画及箭头旋转过渡仅在允许动态效果时启用。
