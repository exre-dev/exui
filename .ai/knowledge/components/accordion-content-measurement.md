# Accordion 内容测量与裁切

Radix 在挂载和展开时测量内容区，将结果写入 `--radix-accordion-content-height`，供外层展开动画使用。内层如果反过来用这个变量设置自身高度，就形成了测量循环：变量尚未赋值时的零内容高度或 padding 高度会成为后续测量结果，正文仍在 DOM 中却被外层 `overflow-hidden` 裁掉。

内层应由内容自然撑高，测量变量只用于外层动画。只删除外层的裁切规则会掩盖错误测量，并影响收起行为；等待动画结束也不能修复已经错误的测量值。

浏览器回归使用真实 FAQ 与嵌套示例，通过文字 Range 与展开面板的几何比较检查可见范围，并覆盖重新展开、嵌套项切换和窄宽度换行。仅断言 `aria-expanded` 或文本存在无法发现这个失败模式。测试执行时机见 [TESTING.md](../../../TESTING.md)。

证据：`packages/components/src/components/ui/accordion.tsx`、`packages/docs/tests/browser/Accordion.vrt.test.tsx`。
