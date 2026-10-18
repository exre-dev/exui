### ExUI 操作按钮

ExUI `Button` 使用共享 Token 和胶囊圆角。`ActionButton` 复用同一套变体和尺寸配方，但将圆角覆盖为 `0.75rem`，呈现普通圆角。默认尺寸读取共用密度变量：标准密度为 `2.25rem`，紧凑密度为 `2rem`。显式 `xs` 在两档密度下均为 `1.5rem` 高；`sm`、`lg` 和图标尺寸保留各自的几何 Token。根字号为 16px 时，上述标准、紧凑与 XS 高度分别为 36px、32px 与 24px。两者都有 `default`、`danger`、`destructive`、`outline`、`secondary`、`ghost`、`link` 变体；`destructive` 是危险态的兼容别名。Glass 单独启用，仍保留危险色与焦点状态。非表单提交操作请设置 `type="button"`。

```tsx verify
import { ActionButton, Button } from "@exre/exui"

export function ActionChoices() {
  return <div>
    <Button type="button">保存</Button>
    <Button type="button" variant="outline">预览</Button>
    <Button type="button" variant="ghost">更多</Button>
    <ActionButton type="button">继续</ActionButton>
    <ActionButton type="button" variant="danger" glass>删除</ActionButton>
  </div>
}
```
