# Card 内边距与区块间距的独立归属

Card 原先用同一个局部变量同时控制外壳内边距、各子槽内边距和区块 gap。收紧表面 padding 时直接改这个共享变量，会同时改变 Header、Content、Footer 之间的距离。

当前内边距由 `--card-spacing` 传给外壳和子槽，区块 gap 由独立的 `--card-gap` 控制。两种 Card 尺寸共享紧凑内边距，仍通过 gap 保留各自的区块节奏；消费值和覆盖方式统一维护在 [组件参考](../../../skills/exui/references/components/card.md)，此处不重复数值。

带边框的 Header/Footer 通过同一内边距变量补齐上下留白，首图的顶部留白例外继续由原有选择器处理。调整间距时需要检查这些子槽，不宜只读 Card 外壳的 computed padding。文档应用层可以覆盖公共组件工具类，验证时需加载实际 docs 样式，并区分调用方显式的 padding 覆盖。

证据：`packages/components/src/components/ui/card.tsx`；维护验证与真实默认/带边框 Card 的浏览器测量见 `.notes/padding-audit/validation.md`。
