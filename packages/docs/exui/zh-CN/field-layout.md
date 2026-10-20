### 独立 Field 组合

`Field`、`FieldContent`、`FieldLabel`、`FieldDescription` 与 `FieldError` 组合设置行和展示值，不注册表单状态。在真实可聚焦控件上放稳定 ID，并让 `FieldLabel htmlFor` 使用相同 ID；通过 `aria-describedby` 显式关联说明和当前错误的 ID。有错误时设置 `aria-invalid`。这些原语不推断子控件 ID，也不继承 Form 布局默认值。非交互展示值使用 `asChild` 加 `span` 呈现文本标题。

精确横向配方为每项建立独立 inline-size 容器，并查询其子行。在 21.75rem（9rem 标题 + 12rem 内容 + .75rem 间隔）时启用双列，只对 FieldContent 限宽和对齐；低于阈值时上下堆叠，并将内容恢复为全宽。标题与说明间距为 .25rem，控件与错误为 .5rem。宽页面里的单项仍可能很窄。

```tsx verify
import { useId } from "react"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input } from "@exre/exui"

export function SettingsField() {
  const id = useId()
  return <Field data-invalid>
    <FieldLabel htmlFor={id}>邮箱</FieldLabel>
    <FieldDescription id={`${id}-description`}>接收项目更新</FieldDescription>
    <FieldContent>
      <Input id={id} defaultValue="invalid" aria-invalid aria-describedby={`${id}-description ${id}-error`} />
      <FieldError id={`${id}-error`}>请输入有效邮箱。</FieldError>
    </FieldContent>
  </Field>
}
```
