### ExUI Select 两种入口

ExUI 新增简化版 `Select` 封装：必须传 `options`，选中值由 `onChange` 返回字符串；其 `className`、`size` 和 `glass` 只作用于触发器。经过适配的 `SelectField` 暴露 Radix 根组件，可用于自定义分组、选项或 Glass 弹层；此入口使用 `onValueChange`。弹层要单独给 `SelectContent` 启用 Glass。

```tsx verify
import { Select, SelectContent, SelectField, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@exre/exui"

export function SelectChoices() {
  return <div>
    <Select options={[{ value: "design", label: "设计" }, { value: "build", label: "开发" }]} onChange={(value) => console.log(value)} placeholder="团队" glass />
    <SelectField defaultValue="design" onValueChange={(value) => console.log(value)}>
      <SelectTrigger glass><SelectValue placeholder="团队" /></SelectTrigger>
      <SelectContent glass><SelectGroup><SelectItem value="design">设计</SelectItem></SelectGroup></SelectContent>
    </SelectField>
  </div>
}
```
