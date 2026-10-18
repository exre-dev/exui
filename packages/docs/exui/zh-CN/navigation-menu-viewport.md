### NavigationMenu 弹层宽度

默认 `NavigationMenuViewport` 在桌面宽度下跟随实测内容宽度，在 `md` 断点以下铺满宽度。即使应用的 Tailwind 工具类在 ExUI CSS 后加载，菜单选项仍应可见、可点击。普通菜单无需手动覆盖默认弹层宽度。

同时保留 `NavigationMenuContent` 的默认响应式宽度。给内容区或弹层添加不受断点限制的 `w-full`，可能限制桌面布局的宽度测量并裁掉菜单链接。
