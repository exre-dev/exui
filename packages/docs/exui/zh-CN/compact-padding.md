### 紧凑组件内边距

ExUI 将默认 Card 内边距、`CommandEmpty` 及 DataGrid 空表和筛选空提示的上下、Gantt 无资源提示四边、纵向 `TimelineItem` 非末项的底部 padding 统一为 `1rem`（16px 根字号下为 16px）。`DialogContent`、`AlertDialogContent`、`SheetHeader` 与 `SheetFooter` 的默认四边 padding 均为 `1.5rem`（16px 根字号下为 24px），与 ReUI 一致。空状态仅在对应提示渲染时生效；时间轴末项不额外增加底部 padding。调用方仍可用类名覆盖默认值。

Card 的默认与 `sm` 尺寸均使用 `1rem` 内边距，`--card-spacing` 控制这些内边距；独立的 `--card-gap` 控制区块间距，默认仍为 `1.5rem`，`sm` 为 `1rem`。Header 下方与 Footer 上方的内边距在添加对应边框时生效；首个直接子元素为图片时，Card 顶部仍不加内边距。
