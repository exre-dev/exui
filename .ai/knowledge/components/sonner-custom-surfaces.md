# Sonner 自定义通知的绘制边界

`toast.custom` 的通知节点带 `data-styled="false"`，Sonner 不会把默认卡片的背景、圆角和内边距应用到自定义内容上。只调整 `Toaster.style` 中的 `--border-radius` 不能改变仍使用独立圆角类的自定义卡片。需要与宿主保持一致的组合，应在真正绘制背景的卡片上读取宿主变量；消费用法见 [Sonner 圆角说明](../../../skills/exui/references/components/sonner.md#notification-card-corners)。

自定义内容位于 Sonner 的 `[data-content]` / `[data-title]` 包装内，通知节点的第一个子元素不是卡片。几何回归必须测量绘制背景的内容，不能把包装层的零圆角误报为卡片圆角。示例内容的宽度还应受宿主约束，避免固定像素宽度绕开移动端边距与根字号缩放。

证据：`packages/docs/src/showcase/examples/sonner/c-sonner-9.tsx` 至 `c-sonner-17.tsx`、`c-sonner-20.tsx`、`c-sonner-21.tsx`；`packages/docs/src/showcase/Sonner.vrt.test.tsx` 使用真实示例和公开包验证四角、宽度及宿主覆盖。
