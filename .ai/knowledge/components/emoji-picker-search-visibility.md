# EmojiPicker 搜索字段与网格焦点

搜索字段同时是表情列表的 combobox 和桌面弹层的默认焦点目标。隐藏搜索不能只改变 CSS 可见性：保留搜索 ref 会让弹层尝试聚焦不可见的输入框。网格自身的 Tab 顺序由可用性、加载和空状态决定，不由 `hasSearch` 控制。

`hideSearch` 经 EmojiPicker 的内部上下文传递。默认面板省略整个搜索 header，显式组合的 `EmojiPickerSearch` 则返回空内容并取消搜索注册；输入节点卸载时清空 ref，打开弹层的焦点选择逻辑随即回退到列表。若隐藏时输入框已经获焦，清理逻辑会把焦点交给仍连接到 document 的网格；关闭整个面板时不抢占返回焦点。受控查询与界面显示分开管理，因此恢复搜索时仍显示原查询。

默认面板只组合可选搜索、分类和网格。Footer、Preview 与肤色组件仍保留为显式组合入口，不能把默认布局变更误当作删除这些公共导出。

证据：`packages/components/src/components/reui/emoji-picker.tsx` 中的 `openFocusTarget`、`EmojiPickerPanel`、`EmojiPickerSearch` 和列表的焦点规则；`EmojiPicker.vrt.test.tsx` 通过完整文档样式验证隐藏搜索后的内嵌键盘选择、弹层焦点、默认布局和动态切换。
