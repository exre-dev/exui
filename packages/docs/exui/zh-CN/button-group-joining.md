### 连续拼接的控件

`ButtonGroup` 将相邻控件连接成一个整体，内部接缝使用直角且只保留一条边框，适用于 `InputGroup`、Select 触发器和文字段。应用编译自己的工具类样式表后，接缝仍保持连续。纵向排列时使用 `orientation="vertical"`。

非交互说明和计数使用 `ButtonGroupText`；`asChild` 可让自定义元素保留拼接行为。嵌套的 `ButtonGroup` 形成带间距的独立控件组。Select 隐藏的原生表单控件不算可见片段，也不会让末端触发器丢失外侧圆角。
