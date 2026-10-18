### 密度与根字号缩放

紧凑密度作用域会改变 `Button`、`Input`、`Textarea`、`Select`、`NativeSelect` 和 `InputGroup` 的默认几何尺寸。显式尺寸和复杂组件布局并非都会随该作用域缩小。CSS 中的 `rem` 尺寸随根字号变化。部分第三方组件只接受数字尺寸；ExUI 在 DOM 边界换算自己的默认值，并在根字号变化后更新。调用者显式传入的数字仍是像素，不应再次换算。

```tsx verify
import { Button, Select } from "@exre/exui"

export function CompactControls() {
  return <div className="density-compact">
    <Button type="button">保存</Button>
    <Select options={[{ value: "a", label: "甲" }]} defaultValue="a" />
  </div>
}
```
