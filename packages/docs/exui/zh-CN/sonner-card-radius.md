### 通知卡片圆角

`Toaster` 通知卡片使用 ExUI 的 `--radius-2xl` 圆角 Token，在默认 16px 根字号下为 18px。圆角随根字号和局部圆角 Token 调整。需要其他圆角时，可通过 `Toaster.style` 覆盖 `--border-radius` 变量。

`toast.custom` 渲染的是无预设样式的通知，内容需要自行设置卡片圆角。Sonner 的自定义示例在外层卡片上使用 `rounded-[var(--border-radius)]` 继承宿主圆角及其覆盖值，并使用 `w-full` 跟随宿主的响应式宽度。组合自定义通知时可沿用这两个类名。
