# ButtonGroup 的跨样式层接缝

文档站将公共样式放在 `exui` 层，应用工具类放在更高的 `utilities` 层。组内控件同时带有通用 `border`、`rounded-4xl` 时，普通的祖先拼接规则会被覆盖：InputGroup 的内侧仍是圆弧，文字段分离，按钮之间还会重复绘制边框。增加选择器特异性无法跨越样式层优先级。

横向和纵向的内侧圆角、共享边框属于组合结构，ButtonGroup 以 important 工具类保护这些接缝。外侧圆角继续由控件与末段规则提供；末段规则按 `data-slot` 跳过 Select 附带的隐藏原生控件。因此 `ButtonGroupText` 自身也必须提供 slot，否则它前面的按钮会被误认为最后一段。

`ButtonGroup.vrt.test.tsx` 加载完整生产文档样式和全部 57 个真实示例，在中英文、三种主题、两档密度及桌面/移动端检查内侧直角、相邻几何与单边框。补充夹具覆盖 `ButtonGroupText asChild`、纵向文字段和 form 内的 Select 隐藏控件；菜单用例验证键盘打开、Escape 焦点归还与输入草稿保留。只加载公共 CSS 无法复现这类覆盖。

证据：`packages/components/src/components/ui/button-group.tsx`、`packages/docs/app/styles/docs.css`、`packages/docs/src/showcase/ButtonGroup.vrt.test.tsx`。
