# EmojiPicker 搜索字段与网格焦点

搜索字段同时是表情列表的 combobox 和桌面弹层的默认焦点目标。隐藏搜索不能只改变 CSS 可见性：保留搜索 ref 会让弹层尝试聚焦不可见的输入框。网格自身的 Tab 顺序由可用性、加载和空状态决定，不由 `hasSearch` 控制。

`hideSearch` 经 EmojiPicker 的内部上下文传递。默认面板不再显示搜索字段，显式组合的 `EmojiPickerSearch` 则返回空内容并取消搜索注册；输入节点卸载时清空 ref，打开弹层的焦点选择逻辑随即回退到列表。若隐藏时输入框已经获焦，清理逻辑会把焦点交给仍连接到 document 的网格；关闭整个面板时不抢占返回焦点。受控查询与界面显示分开管理，因此恢复搜索时仍显示原查询。

单选移除动作独立于搜索显示，由共享 Categories 放在分类页签的同一行，处于 tablist 外侧。这样搜索隐藏时默认面板能省略整个 header，方向键也不会把移除当作分类或表情；显式组合中渲染为空的 Header 同样不占空间。分类页签自身可横向滚动，移除按钮不跟随滚动，避免窄面板裁掉入口。内嵌面板移除值后按钮随即卸载，因此动作会先将焦点交给网格；弹层交由原关闭路径处理焦点归还，不让网格抢焦点。移除复用值变更入口，不走选择入口，因此不会记录新的最近使用项或触发表情选择回调。

默认面板只组合可选搜索及移除动作、分类和网格。Footer、Preview 与肤色组件仍保留为显式组合入口，不能把默认布局变更误当作删除这些公共导出。

证据：`packages/components/src/components/reui/emoji-picker.tsx` 中的 `openFocusTarget`、`EmojiPickerPanel`、`EmojiPickerCategories`、`EmojiPickerHeader`、`EmojiPickerSearch` 和列表的焦点规则；`EmojiPicker.vrt.test.tsx` 通过完整文档样式验证隐藏搜索后的内嵌键盘选择、窄屏分类导航、独立移除动作、弹层焦点、默认布局和动态切换。
