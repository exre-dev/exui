# Questionnaire 选中标记与应用样式层

Questionnaire 的选择数据可能正确更新，但勾号与内圆点仍被隐藏。文档站把公开样式放在 `exui` 层，应用工具类放在优先级更高的 `utilities` 层；图标同时携带基础 `hidden` 与选中时的 `block` 变体时，应用层生成的 `.hidden` 会覆盖公开层的选中显示规则。只断言原生 input 的 checked 或选项背景色无法发现此问题。

两个图标现在分别根据 `data-unchecked` 和选项 `data-type` 隐藏，不再携带基础 `hidden` 或与它竞争的选中显示类。未选中时两者都隐藏，选中复选框只显示勾号，选中单选框只显示内圆点。

`packages/docs/tests/browser/Questionnaire.vrt.test.tsx` 使用真实的第二、第三个示例和完整文档站样式，检查图标的实际显示、尺寸、前景与背景区分，以及取消多选和切换单选后的旧标记消失。覆盖三种主题、两档密度及桌面/移动视口；这些几何与计算样式断言不等同于像素级截图比较。
