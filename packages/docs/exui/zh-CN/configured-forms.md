### 配置式 Form

`Form` 根据配置渲染字段和可选步骤。传 `schema` 与 `defaultValues`，或传 `useForm` 创建的 `form`；两种入口互斥。每个编辑步骤单独校验，确认步骤渲染当前快照。配置式 children 位于生成字段或确认内容之前，footer 位于其后；省略 footer 使用内置操作，传 null、节点或回调可替换。`fields !== undefined`（包括空数组）选择此分支，切换到组合式需更换 React key。包装器使用 `FormConfiguredSchemaProps<S>` 或 `FormConfiguredInstanceProps<I, O>`。schema 对象应跨重渲染保持稳定；引用 `File` 的 schema 要在浏览器环境创建。

使用此示例时，消费应用需自行安装 `zod`。

```tsx verify
import { Form } from "@exre/exui"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })
export function ProjectSetup() {
  return <Form schema={schema} defaultValues={{ name: "" }}
    fields={[{ name: "name", label: "项目名称", control: "text" }]}
    onSubmit={(value) => console.log(value.name)} />
}
```
