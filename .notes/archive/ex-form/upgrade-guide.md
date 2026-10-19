# Form / Field 升级指南

本次为有意的破坏性移除：项目尚未发布，不保留旧组件别名、适配器、废弃层、迁移页面、旧 URL、锚点或分享 ID。公开包仍为 `@exre/exui`；Changeset 声明 major，本任务不应用版本变更。

## 组件和类型替换

| 移除项 | 新用法 |
| --- | --- |
| `ExForm` | `Form` 配置式 schema 或既有实例分支，保留 fields |
| `FormItem` | `FormField`，绑定同一个 ExUI 实例、路径与控件 |
| `ExItem` | 显式组合 Field / FieldContent / FieldLabel / FieldDescription / FieldError，不创建表单状态 |
| `FormProps<I, O>` | `FormComposedProps<I, O>`，只用于组合式；配置式包装器选择以下专用类型 |
| `ExFormSchemaProps<S>` | `FormConfiguredSchemaProps<S>` |
| `ExFormInstanceProps<I, O>` | `FormConfiguredInstanceProps<I, O>` |
| `ExFormCommonProps<I, O>` | `FormConfiguredCommonProps<I, O>`，共享部分不能代替完整的输入源分支 |
| `ExFormFooterArguments<I>` | `FormFooterArguments<I>` |
| `FormItemProps<I, O, P>` | `FormFieldProps<I, O, P>` |
| `ExItemProps` | 无单一替代；分别使用 Field 原语 props 和应用 CSS，不把 title/desc/controlId/span 透传给 Field |
| `ExItemLayout` / `ExItemSpan` | 绑定字段类型为 FormFieldLayout / FormFieldSpan；独立 Field 使用 orientation 和应用布局，没有旧属性别名 |

useForm、useFormContext、useWatch、useFieldArray、FormList 和 FormErrorSummary 继续从包根导入。不要使用私有路径，也不要传入消费应用自行创建的 RHF 实例。schema 由应用提供；以下完整示例需要 React 19、`@exre/exui` 和 `zod`，入口导入一次公开样式。

## 三个入口分支与挂载身份

| 分支 | 必需内容 | 禁止混入 |
| --- | --- | --- |
| 组合式 | form + onSubmit + children | fields、schema/defaultValues/mode/reValidateMode、步骤/footer/配置按钮文案 |
| 配置式 schema | schema + defaultValues + fields + onSubmit | form |
| 配置式实例 | form + fields + onSubmit | schema/defaultValues/mode/reValidateMode |

运行时严格按 `fields !== undefined` 选择配置式。因此 `fields={[]}` 仍是配置式，`fields={undefined}` 是组合式。不可在同一挂载期间添加或移除 fields 来切换模式；使用新的 React key（例如 `key={mode}`）让旧 owner 卸载后重建，并自行决定是否保留草稿。一个实例只能连接一个已挂载的原生 form，不能嵌套 Form，也不能把同一实例同时挂到两份对比示例。

配置式 children 在生成字段或 review 内容之前渲染，适合摘要和补充说明，不替换 fields。footer 在后：省略使用内置操作，null 隐藏操作，节点或回调替换。回调具有 state/currentStep/isFirstStep/isLastStep/next/back/goTo/submit/reset；导航和重置按钮使用 `type="button"`。组合式不接收 footer/steps 等配置式属性，字段和操作由 children 编排。FormErrorSummary 始终显式添加。

## 完整配置式 schema 示例

此例保留字符串输入到数字输出的转换、局部步骤 schema、确认步骤和重置。schema 位于模块顶层，不在每次 render 中重建。

```tsx
import "@exre/exui/style.css"
import { useState } from "react"
import { z } from "zod"
import { Form, FormErrorSummary } from "@exre/exui"

// Keep the initializing schema stable across renders.
const emailStepSchema = z.object({
  email: z.string().email("Enter a valid email"),
})
const detailsStepSchema = z.object({
  age: z.string().min(1, "Enter your age").regex(/^\d+$/, "Use digits").transform(Number),
  role: z.enum(["member", "admin"]),
})
const profileSchema = z.object({ ...emailStepSchema.shape, ...detailsStepSchema.shape })

export default function ConfiguredForm() {
  const [saved, setSaved] = useState("")
  return (
    <section style={{ maxWidth: "36rem" }}>
      <Form
        schema={profileSchema}
        defaultValues={{ email: "", age: "", role: "member" }}
        fields={[
          { name: "email", label: "Email", control: "email" },
          { name: "age", label: "Age", control: "number" },
          { name: "role", label: "Role", control: "select", controlProps: {
            options: [{ value: "member", label: "Member" }, { value: "admin", label: "Admin" }],
          } },
        ]}
        submitLabel="Save profile"
        resetLabel="Reset"
        backLabel="Back"
        nextLabel="Next"
        stepsAriaLabel="Profile steps"
        steps={[
          { id: "contact", title: "Contact", fields: ["email"], validationSchema: emailStepSchema },
          { id: "details", title: "Details", fields: ["age", "role"], validationSchema: detailsStepSchema },
          { id: "review", title: "Review", kind: "review", render: (draft) => <p>{draft.email}: {draft.age} ({draft.role})</p> },
        ]}
        onSubmit={(output) => {
          // output.age is number; the form's input draft remains string.
          setSaved(`${output.email}: ${output.age} years old (${output.role})`)
        }}
      >
        <FormErrorSummary title="Please check the following issues" />
      </Form>
      <output aria-live="polite">{saved}</output>
    </section>
  )
}
```

## 完整配置式实例与命名包装器

FormConfiguredInstanceProps 明确既有实例分支；不要对重载 Form 使用 ComponentProps 推导通用 props。schema 分支包装器接收 `FormConfiguredSchemaProps<typeof schema>`，组合式包装器接收 `FormComposedProps<Input, Output>`。

```tsx
import "@exre/exui/style.css"
import { z } from "zod"
import { Button, Form, FormErrorSummary, useForm } from "@exre/exui"
import type { FormConfiguredInstanceProps, FormInput, FormOutput } from "@exre/exui"

const schema = z.object({ name: z.string().min(1, "Enter a name") })
type Input = FormInput<typeof schema>
type Output = FormOutput<typeof schema>

function ConfiguredEditor(props: FormConfiguredInstanceProps<Input, Output>) {
  return <Form {...props} />
}

export default function ConfiguredInstance() {
  const form = useForm({ schema, defaultValues: { name: "" } })
  return <ConfiguredEditor form={form} fields={[{ name: "name", label: "Name", control: "text" }]}
    onSubmit={(output) => console.log(output.name)}
    footer={({ state, reset }) => <div style={{ display: "flex", gap: ".5rem" }}>
      <Button type="submit" disabled={state.isSubmitting}>Save</Button>
      <Button type="button" onClick={reset}>Reset</Button>
    </div>}>
    <FormErrorSummary title="Check these fields" />
  </ConfiguredEditor>
}
```

## 完整组合式与动态对象列表

稳定 key 用作 React key，当前 index 用于绑定路径。嵌套列表由各自组件持有 hook，不在数组循环内调用 hook。

```tsx
import "@exre/exui/style.css"
import { useState } from "react"
import { z } from "zod"
import { Button, Form, FormField, FormList, FormErrorSummary, useForm, useFormContext, useWatch } from "@exre/exui"
import type { FormInstance } from "@exre/exui"

const contactSchema = z.object({
  title: z.string().min(1, "Enter a title"),
  contacts: z.array(z.object({ email: z.string().email("Enter a valid email") })).min(1, "Add a contact"),
})
type ContactInput = z.input<typeof contactSchema>
type ContactOutput = z.output<typeof contactSchema>

function DraftTitle({ expected }: { expected: FormInstance<ContactInput, ContactOutput> }) {
  // All hooks and components come from ExUI's bundled form instance.
  const form = useFormContext(expected)
  const title = useWatch({ form, name: "title" })
  return <p>Draft: {title || "Untitled"}</p>
}

export default function ComposedForm() {
  const [saved, setSaved] = useState("")
  const form = useForm({ schema: contactSchema, defaultValues: { title: "", contacts: [{ email: "" }] } })
  return (
    <Form form={form} onSubmit={(output) => setSaved(`${output.title}: ${output.contacts.length} contact(s)`)}>
      <FormField form={form} name="title" label="Title" control="text" />
      <DraftTitle expected={form} />
      <FormList form={form} name="contacts" label="Contacts" defaultItem={{ email: "" }}
        render={({ items, append, remove }) => (
          <div style={{ display: "grid", gap: "1rem" }}>
            {items.map(({ key, index }) => (
              <div key={key}>
                <FormField form={form} name={`contacts.${index}.email`} label={`Contact ${index + 1}`} control="email" />
                <Button type="button" onClick={() => remove(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ email: "" })}>Add contact</Button>
          </div>
        )}
      />
      <FormErrorSummary form={form} />
      <Button type="submit" disabled={form.state.isSubmitting}>Save contacts</Button>
      <Button type="button" onClick={() => form.reset()}>Reset</Button>
      <output aria-live="polite">{saved}</output>
    </Form>
  )
}
```

## 独立 Field、ARIA 与逐项响应式

原 title/desc 改为 FieldLabel/FieldDescription；controlId 改为实际控件 id 与 label htmlFor。描述和出现时的错误 ID 都必须写入实际控件 aria-describedby，并保留已有引用。包装输入、自定义控件也关联真实焦点元素。原 ExItem 的直接 Input 自动补 ID 已删除。纯展示内容用 span 文本标题，不制造无目标 label。多个控件分别命名，或使用 FieldSet/FieldLegend 分组。

独立 Field 不继承 Form 的布局上下文；原 span 用父网格 grid-column 或应用 CSS 迁移。原 contentMaxWidth/contentAlign 用局部配方中的 FieldContent max-width/justify-self 迁移。每项有自己的 inline-size 容器；低于 21.75rem 上下排列且全宽，达到阈值使用 9rem 标题 + 12rem 最小内容 + .75rem 间隔，只在宽模式下限宽和左右对齐。标题/说明间距 .25rem，控件/错误间距 .5rem。不要从私有 docs CSS 导入消费样式。

```tsx
import "@exre/exui/style.css"
import { useId, useState } from "react"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input, Switch } from "@exre/exui"

// Each .consumer-field-item is its own container, including in narrow grid columns.
const layoutCss = `
.consumer-field-item { container: consumer-field / inline-size; min-width: 0; width: 100%; }
.consumer-field-item > [data-slot="field"] { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; align-items: start; }
.consumer-field-item .consumer-field-heading { display: grid; gap: .25rem; min-width: 0; }
.consumer-field-item .consumer-field-content { display: grid; gap: .5rem; width: 100%; min-width: 0; max-width: none; margin-inline: 0; }
@container consumer-field (min-width: 21.75rem) {
  .consumer-field-item > [data-slot="field"] { grid-template-columns: 9rem minmax(12rem, 1fr); }
  .consumer-field-item .consumer-field-content { max-width: 18rem; justify-self: start; }
  .consumer-field-item .consumer-field-content[data-align="right"] { justify-self: end; }
}
`

export default function StandaloneFields() {
  const nameId = useId()
  const noticesId = useId()
  const [name, setName] = useState("")
  const [notices, setNotices] = useState(true)
  const [touched, setTouched] = useState(false)
  const invalid = touched && name.trim().length === 0
  return <section style={{ display: "grid", gap: "1.25rem", minWidth: 0 }}>
    <style>{layoutCss}</style>
    <div className="consumer-field-item">
      <Field data-invalid={invalid}>
        <div className="consumer-field-heading">
          <FieldLabel htmlFor={nameId}>Display name</FieldLabel>
          <FieldDescription id={`${nameId}-description`}>Shown to teammates</FieldDescription>
        </div>
        <FieldContent className="consumer-field-content" data-align="right">
          <Input id={nameId} value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setTouched(true)}
            aria-invalid={invalid} aria-describedby={[`${nameId}-description`, invalid && `${nameId}-error`].filter(Boolean).join(" ")} />
          {invalid && <FieldError id={`${nameId}-error`}>Enter a display name.</FieldError>}
        </FieldContent>
      </Field>
    </div>
    <div className="consumer-field-item">
      <Field>
        <div className="consumer-field-heading">
          <FieldLabel htmlFor={noticesId}>Notifications</FieldLabel>
          <FieldDescription id={`${noticesId}-description`}>Receive project updates</FieldDescription>
        </div>
        <FieldContent className="consumer-field-content">
          <Switch id={noticesId} checked={notices} onCheckedChange={setNotices} aria-describedby={`${noticesId}-description`} />
        </FieldContent>
      </Field>
    </div>
    <div className="consumer-field-item">
      <Field>
        <div className="consumer-field-heading"><FieldLabel asChild><span>Workspace</span></FieldLabel></div>
        <FieldContent className="consumer-field-content"><p>Design workspace</p></FieldContent>
      </Field>
    </div>
  </section>
}
```

绑定字段的限宽仍由 Form/FormField 属性管理：`layout="horizontal"`、`contentMaxWidth="24rem"`、`contentAlign="right"`。单字段可分别覆盖，`contentMaxWidth="none"` 移除继承上限，数值是 CSS px。上限包括错误区域，不限制标题；垂直和窄行恢复全宽。noStyle 省略整个字段外壳，custom render 必须把 field.ref/onBlur 和 accessibility 送到真实控件，并自行提供标签、说明和错误。

## URL、示例和目录迁移

下表中 L 是 en 或 zh-CN，部署时可整体加 /exui/ 前缀。旧地址与锚点不做重定向。

| 原入口 | 规范新入口 |
| --- | --- |
| /L/docs/exui/ex-form/ | /L/docs/exui/form/ |
| /L/docs/exui/ex-item/ | /L/docs/components/field/ |
| /L/docs/exui/form/ | 地址保持，导航显示在 Components |
| exui-ex-form-1 | exui-form-configured（步骤/确认）；最小模型对比为 exui-form-models |
| exui-ex-item-1/2/3 | 按场景改为 exui-field-settings、exui-field-display、exui-field-layout |
| exui-form-1 | 仍为 Form 的项目/动态列表案例 |

分享 URL 为 `/examples/<id>/`，源码为其 source.md / source.json；不要把旧 ID 当新 ID 的别名。Form 拥有 exui-form-1、exui-form-models、exui-form-configured；Field 拥有上述三个 exui-field-*。catalog 共 89 家族；展示分类为 87 Components、2 Blocks；双语各 99 个内容页。

## 手动迁移步骤

1. 搜索旧组件/类型导入、私有路径、页面 URL、锚点和分享 ID；删除兼容层并按映射选择新入口。
2. 将 ExForm 改为带 fields 的 Form，将 FormItem 改为 FormField；选择对应命名 props 契约，删除互斥属性。不要只替换 JSX 名称而留下错误的实例/schema 混用。
3. 将每个 ExItem 拆成 Field 原语，连好实际输入 ID、说明、错误和无效态；迁移逐项 CSS、grid span、窄容器全宽与宽时内容对齐。
4. 检查 children/footer 顺序、type="button"、独立 Form 实例、分支切换 key 与 opt-in summary。保留步骤的 id/fields/validationSchema/validationDependencies，review 渲染输入快照。
5. 保持默认值、getValues/setValue/useWatch/control 绑定为 schema Input；只有完整校验后的 onSubmit 是 Output。数字草稿仍为字符串，解析结果不回填草稿。使用 reset(newDefaults) 更新默认基线。
6. 异步请求继续传递 onSubmit context.signal，使用 context.setFieldError/setFormError 写服务端错误；reset/cancelPending/unmount 取消旧界面写入权，不能撤回已发出的业务请求。常驻 Dialog 的 close handler 主动 reset 或 cancelPending。
7. 在应用中运行严格类型检查、构建和宽/窄浏览器操作；验证标签点击、说明/错误 ARIA、摘要焦点、列表增删移动、步骤/确认/重置、异步取消与草稿保留。包内门禁和本地浏览器结果不等于线上托管或发布验收。

规范消费说明见 [Form](../../skills/exui/references/exui/form.md) 和 [Field layout](../../skills/exui/references/exui/field-layout.md)。本文位于 .notes，记录这次有意的破坏性升级，不新增站点兼容迁移页面。
