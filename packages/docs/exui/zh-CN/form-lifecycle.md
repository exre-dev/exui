### ExUI Form 生命周期

`useForm` 持有稳定的草稿和校验 schema；`Form` 接入提交与字段状态。schema 转换后的输入、输出类型可能不同，校验与提交也可能异步。`FormItem` 绑定字段路径，`FormErrorSummary` 展示校验问题。跨重渲染保持同一表单实例；即使同时显示通知，字段错误仍应留在表单内。

使用下方 Zod schema 时，消费应用需自行安装 `zod`。

```tsx verify
import { Button, Form, FormItem, useForm } from "@exre/exui"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })
export function ProjectForm() {
  const form = useForm({ schema, defaultValues: { name: "" } })
  return <Form form={form} onSubmit={(value) => console.log(value.name)}>
    <FormItem form={form} name="name" label="项目名称" control="text" />
    <Button type="submit">保存</Button>
  </Form>
}
```
