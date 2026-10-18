### 通知状态图标

`Toaster` 的成功、错误、警告、信息和加载图标采用 Lucide 线框样式，其中错误图标使用圆形的 `CircleX`。尺寸为 1rem，使用 Lucide 默认描边，加载图标保留旋转动画。颜色继承通知的图标容器，可通过单条通知的 `classNames.icon` 设置；状态示例中的信息图标使用 `text-primary` 跟随主题主色。需要其他图标时，可通过 `Toaster.icons` 覆盖。
