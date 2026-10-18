# PhoneInput 的输入表面与组合边界

`PhoneInput` 的左右两侧分别由 Button 与 Input 绘制。只给号码输入框保留上游固定高度，会在 Button 已适配 ExUI 尺寸 Token 后出现错位；两侧必须读取同一档尺寸，默认档继续服从密度。国家按钮的背景同样需要使用表单控件 Token，不能继续沿用 outline 按钮的页面背景。

国家搜索使用 Base UI Combobox 的 `render` 接入标准 Input。通用 `ComboboxInput` 还会增加 InputGroup 并移除内部 Input 的圆角、边框与背景，因此不能只删掉 PhoneInput 的 `rounded-none` 就断言恢复了标准 Input 外观。

空列表提示还受完整文档站的工具类层影响：基础 `hidden` 可能覆盖相同特异性的 group 状态显示规则。PhoneInput 在无匹配项时传入 `flex`，经合并移除基础 `hidden`，让提示实际可见。测试必须检查可见性，不能只查文字是否挂载。

`PhoneInput.vrt.test.tsx` 使用公开包及完整文档站样式检查八个真实示例的几何与背景。搜索用例通过生产 `ComponentExamplesHost` 挂载，复用文档站的 Portal 密度归属；只在测试容器上添加紧凑密度类不会传递到 body 下的弹层。
