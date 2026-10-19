/* oxlint-disable react/only-export-components -- The lazy Showcase router consumes stable page registries. */
import * as React from "react"
import { z } from "zod"
import { ArrowDown, ArrowUp, Check, CheckCircle2, Folder, Mail, Plus, Trash2 } from "lucide-react"
import {
  Alert, AlertDescription, Badge, Button, Card, CardContent, CardHeader, CardTitle,
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Field, FieldContent, FieldLabel, Form, FormErrorSummary, FormField, FormList, Input, Label,
  Popover, PopoverContent, PopoverTrigger, Separator, Slider, Switch, toast, useForm,
} from "@exre/exui"
import { Preview, PreviewGrid } from "../Preview"
import { useShowcaseLanguage } from "../language"

const stack: React.CSSProperties = { display: "grid", gap: "1.25rem", width: "100%" }
const row: React.CSSProperties = { display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }
const muted: React.CSSProperties = { color: "var(--muted-foreground)", fontSize: "0.875rem" }
const panel: React.CSSProperties = { ...stack, maxWidth: "48rem", marginInline: "auto" }

function useCopy() {
  const { language } = useShowcaseLanguage()
  return (en: string, zh: string) => language === "zh-CN" ? zh : en
}

function GlassPage() {
  const c = useCopy()
  const [notices] = React.useState(() => new Set<ReturnType<typeof toast.success>>())
  React.useEffect(() => () => {
    for (const id of notices) toast.dismiss(id)
    notices.clear()
  }, [notices])
  const notifySuccess = (message: string) => { notices.add(toast.success(message)) }
  const [glass, setGlass] = React.useState(true)
  const [texture, setTexture] = React.useState(true)
  const [blur, setBlur] = React.useState([16])
  const glassId = React.useId()
  const textureId = React.useId()
  const fieldId = React.useId()
  const materialStyle = { "--exui-glass-blur": `${blur[0]}px` } as React.CSSProperties
  return <PreviewGrid><Preview shareId="exui-glass-1" wide>
    <div style={stack}>
      <div style={row}>
        <Switch id={glassId} checked={glass} onCheckedChange={setGlass} /><Label htmlFor={glassId}>Glass</Label>
        <Switch id={textureId} checked={texture} onCheckedChange={setTexture} /><Label htmlFor={textureId}>{c("Texture", "纹理")}</Label>
        <div style={{ ...row, marginLeft: "auto", minWidth: "14rem" }}>
          <span style={muted}>{c("Blur", "模糊")} · {blur[0]}px</span>
          <Slider aria-label={c("Glass blur", "材质模糊")} value={blur} onValueChange={setBlur} min={0} max={32} step={2} style={{ width: "9rem" }} />
        </div>
      </div>
      <div style={{ ...materialStyle, padding: "3.5rem 2rem", borderRadius: "var(--exui-radius-extra-large)", minHeight: "28rem", display: "grid", placeItems: "center", backgroundColor: "var(--muted)", backgroundImage: texture ? "repeating-linear-gradient(135deg, transparent 0 2rem, color-mix(in oklab, var(--primary) 22%, transparent) 2rem 4rem), radial-gradient(ellipse at 15% 20%, var(--chart-1), transparent 65%), radial-gradient(ellipse at 90% 85%, var(--chart-2), transparent 65%)" : "none" }}>
        <Card glass={glass} style={{ width: "min(100%, 34rem)" }}>
          <CardHeader><div style={{ ...row, justifyContent: "space-between" }}><CardTitle>Aurora Studio</CardTitle><Badge variant="secondary">Pro</Badge></div></CardHeader>
          <CardContent style={stack}>
            <div style={row}><Folder size={24} /><div><strong>{c("Brand explorations", "品牌探索")}</strong><p style={{ ...muted, margin: "0.25rem 0 0" }}>{c("12 files · Updated today", "12 个文件 · 今天更新")}</p></div></div>
            <Separator />
            <div style={{ display: "grid", gap: "0.5rem" }}><Label htmlFor={fieldId}>{c("Collection name", "合集名称")}</Label><Input id={fieldId} glass={glass} defaultValue="Aurora / Autumn" /></div>
            <div style={row}>
              <Button glass={glass} onClick={() => notifySuccess(c("Collection saved", "合集已保存"))}><Check />{c("Save collection", "保存合集")}</Button>
              <Popover><PopoverTrigger asChild><Button glass={glass} variant="outline">{c("Share", "分享")}</Button></PopoverTrigger><PopoverContent glass={glass} style={materialStyle}>
                <strong>{c("Invite collaborators", "邀请协作者")}</strong><Input glass={glass} type="email" aria-label={c("Collaborator email", "协作者邮箱")} placeholder="name@example.com" />
                <Button glass={glass} onClick={() => notifySuccess(c("Invitation created locally", "已在本地创建邀请"))}><Mail />{c("Create invitation", "创建邀请")}</Button>
              </PopoverContent></Popover>
              <Dialog><DialogTrigger asChild><Button glass={glass} variant="outline">{c("Archive", "归档")}</Button></DialogTrigger><DialogContent glass={glass} style={materialStyle} closeLabel={c("Close", "关闭")}>
                <DialogHeader><DialogTitle>{c("Archive collection?", "归档此合集？")}</DialogTitle><DialogDescription>{c("You can restore this collection from the archive at any time.", "你可以随时从归档中恢复此合集。")}</DialogDescription></DialogHeader>
                <DialogFooter><DialogClose asChild><Button glass={glass} variant="outline">{c("Cancel", "取消")}</Button></DialogClose><DialogClose asChild><Button glass={glass} onClick={() => notifySuccess(c("Collection archived", "合集已归档"))}>{c("Archive", "归档")}</Button></DialogClose></DialogFooter>
              </DialogContent></Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Preview></PreviewGrid>
}

const projectSchema = z.object({
  name: z.string().min(2, "Enter at least 2 characters"),
  description: z.string().max(180, "Use no more than 180 characters"),
  members: z.array(z.object({ name: z.string().min(1, "Enter a name"), email: z.string().email("Enter a valid email") })).min(1, "Add at least one member"),
})
const issueTranslations: Record<string, string> = {
  "Enter at least 2 characters": "请输入至少 2 个字符", "Use no more than 180 characters": "请勿超过 180 个字符",
  "Enter a name": "请输入姓名", "Enter a valid email": "请输入有效邮箱", "Add at least one member": "请添加至少一位成员",
  "Choose a launch date": "请选择发布日期", "Accept the project guidelines": "请接受项目准则",
}

function ProjectFormPreview() {
  const c = useCopy()
  const form = useForm({ schema: projectSchema, defaultValues: { name: "Aurora", description: "A shared space for our next release.", members: [{ name: "Alex Chen", email: "alex@example.com" }] }, mode: "onBlur" })
  const [saved, setSaved] = React.useState("")
  return <Preview shareId="exui-form-1" wide><div style={panel}>
    <Form form={form} onSubmit={(data) => setSaved(data.name)} formatIssue={(message) => c(message, issueTranslations[message] ?? message)} columns={{ base: 1, md: 2 }} style={{ position: "relative" }}>
      {/* Keep actions above validation messages so blur cannot move a pointer target. */}
      <div data-span="full" style={{ ...row, justifyContent: "flex-end", paddingLeft: "10rem" }}>
        <Button type="button" variant="outline" onClick={() => { form.reset(); setSaved("") }}>{c("Reset", "重置")}</Button>
        <Button type="submit">{c("Save project", "保存项目")}</Button>
      </div>
      <FormErrorSummary title={c("Check these fields", "请检查以下字段")} />
      <FormField form={form} name="name" label={c("Project name", "项目名称")} control="text" required colSpan="full" />
      <FormField form={form} name="description" label={c("Description", "描述")} control="textarea" controlProps={{ rows: 3 }} colSpan="full" />
      <FormList form={form} name="members" defaultItem={{ name: "", email: "" }} label={c("Team members", "团队成员")} render={(array) => <div style={stack}>
        {array.items.map(({ key, index }) => <div key={key} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr) auto", alignItems: "start", gap: "0.75rem" }}>
          <FormField form={form} name={`members.${index}.name`} label={c("Name", "姓名")} control="text" required />
          <FormField form={form} name={`members.${index}.email`} label={c("Email", "邮箱")} control="email" required />
          <div style={{ ...row, paddingTop: "1.75rem", gap: "0.25rem" }}>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={c(`Move member ${index + 1} up`, `上移成员 ${index + 1}`)} disabled={index === 0} onClick={() => array.move(index, index - 1)}><ArrowUp /></Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={c(`Move member ${index + 1} down`, `下移成员 ${index + 1}`)} disabled={index === array.items.length - 1} onClick={() => array.move(index, index + 1)}><ArrowDown /></Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={c(`Remove member ${index + 1}`, `删除成员 ${index + 1}`)} onClick={() => array.remove(index)}><Trash2 /></Button>
          </div>
        </div>)}
        <Button type="button" variant="outline" onClick={() => array.append({ name: "", email: "" })} style={{ position: "absolute", top: 0, left: 0 }}><Plus />{c("Add member", "添加成员")}</Button>
      </div>} />
    </Form>
    {saved && <Alert role="status"><CheckCircle2 /><AlertDescription>{c(`Saved ${saved}`, `已保存 ${saved}`)}</AlertDescription></Alert>}
  </div></Preview>
}

const launchSchema = z.object({
  name: z.string().min(2, "Enter at least 2 characters"),
  category: z.enum(["design", "engineering", "research"]),
  date: z.string().min(1, "Choose a launch date"),
  channels: z.array(z.enum(["email", "in-app", "digest"])),
  private: z.boolean(),
  accepted: z.boolean().refine(Boolean, "Accept the project guidelines"),
})
const identitySchema = launchSchema.pick({ name: true, category: true })
const scheduleSchema = launchSchema.pick({ date: true, channels: true, private: true, accepted: true })

function ConfiguredFormPreview() {
  const c = useCopy()
  const [launched, setLaunched] = React.useState("")
  const form = useForm({ schema: launchSchema, defaultValues: { name: "Aurora", category: "design", date: "", channels: ["email"], private: true, accepted: false } })
  return <Preview shareId="exui-form-configured" wide><div style={panel}>
    <Form form={form} columns={{ base: 1, md: 2 }} formatIssue={(message) => c(message, issueTranslations[message] ?? message)} onSubmit={(data) => setLaunched(data.name)}
      stepsAriaLabel={c("Project setup", "项目设置")}
      footer={({ state, isFirstStep, isLastStep, back, next, reset }) => <>
        {!isFirstStep && <Button type="button" variant="outline" disabled={state.isSubmitting} onClick={back}>{c("Back", "上一步")}</Button>}
        <Button type="button" variant="outline" disabled={state.isSubmitting} onClick={() => { reset(); setLaunched("") }}>{c("Reset", "重置")}</Button>
        {isLastStep
          ? <Button key="launch" type="submit" disabled={state.isSubmitting}>{c("Launch project", "发布项目")}</Button>
          : <Button key="continue" type="button" disabled={state.isSubmitting || state.isValidating} onClick={(event) => { event.preventDefault(); void next() }}>{c("Continue", "继续")}</Button>}
      </>}
      fields={[
        { name: "name", label: c("Project name", "项目名称"), control: "text", required: true },
        { name: "category", label: c("Workspace", "工作区"), control: "select", controlProps: { options: [{ value: "design", label: c("Design", "设计") }, { value: "engineering", label: c("Engineering", "工程") }, { value: "research", label: c("Research", "研究") }] } },
        { name: "date", label: c("Launch date", "发布日期"), control: "date", controlProps: { placeholder: c("Choose a date", "选择日期"), todayLabel: c("Today", "今天") }, required: true },
        { name: "channels", label: c("Notifications", "通知方式"), control: "checkbox-group", controlProps: { options: [{ value: "email", label: c("Email", "邮件") }, { value: "in-app", label: c("In-app", "站内通知") }, { value: "digest", label: c("Weekly digest", "每周摘要") }] } },
        { name: "private", label: c("Private project", "私有项目"), description: c("Only invited members can join.", "仅受邀成员可加入。"), control: "switch" },
        { name: "accepted", label: c("I accept the project guidelines", "我接受项目准则"), control: "checkbox", required: true },
      ]}
      steps={[
        { id: "project", title: c("Project", "项目"), fields: ["name", "category"], validationSchema: identitySchema },
        { id: "schedule", title: c("Schedule", "安排"), fields: ["date", "channels", "private", "accepted"], validationSchema: scheduleSchema },
        { id: "review", title: c("Review", "确认"), kind: "review", render: (values) => <div style={stack}>
          <Field orientation="horizontal"><FieldLabel asChild><span>{c("Project name", "项目名称")}</span></FieldLabel><FieldContent><strong>{values.name}</strong></FieldContent></Field>
          <Field orientation="horizontal"><FieldLabel asChild><span>{c("Launch date", "发布日期")}</span></FieldLabel><FieldContent>{values.date}</FieldContent></Field>
          <Field orientation="horizontal"><FieldLabel asChild><span>{c("Notifications", "通知方式")}</span></FieldLabel><FieldContent><div style={row}>{values.channels.map((channel) => <Badge key={channel} variant="secondary">{channel === "email" ? c("Email", "邮件") : channel === "in-app" ? c("In-app", "站内通知") : c("Weekly digest", "每周摘要")}</Badge>)}</div></FieldContent></Field>
          <Field orientation="horizontal"><FieldLabel asChild><span>{c("Visibility", "可见性")}</span></FieldLabel><FieldContent><Badge variant="outline">{values.private ? c("Private", "私有") : c("Team", "团队")}</Badge></FieldContent></Field>
        </div> },
      ]}>
      <FormErrorSummary title={c("Check these fields", "请检查以下字段")} />
    </Form>
    {launched && <Alert role="status"><CheckCircle2 /><AlertDescription>{c(`${launched} is ready`, `${launched} 已就绪`)}</AlertDescription></Alert>}
  </div></Preview>
}

const modelSchema = z.object({ name: z.string().min(2) })
function FormModelsPreview() {
  const c = useCopy()
  const composed = useForm({ schema: modelSchema, defaultValues: { name: "Aurora" } })
  const configured = useForm({ schema: modelSchema, defaultValues: { name: "Aurora" } })
  const [saved, setSaved] = React.useState("")
  const fields = [{ name: "name", label: c("Configured name", "配置式名称"), control: "text" }] as const
  return <Preview shareId="exui-form-models" wide><div style={stack}>
    <p style={muted}>{c("Two independent forms, one public API. Compose individual fields or supply a field configuration.", "两个独立表单，共用一个公开 API：逐项组合字段，或提供字段配置。")}</p>
    <Form form={composed} onSubmit={values => setSaved(`${c("Composed", "组合式")}: ${values.name}`)}>
      <FormField form={composed} name="name" label={c("Composed name", "组合式名称")} control="text" />
      <Button type="submit">{c("Save composed", "保存组合式")}</Button>
    </Form>
    <Form form={configured} fields={fields} onSubmit={values => setSaved(`${c("Configured", "配置式")}: ${values.name}`)} submitLabel={c("Save configured", "保存配置式")} resetLabel={c("Reset configured", "重置配置式")} />
    {saved && <p role="status">{saved}</p>}
  </div></Preview>
}
function FormPage() { return <PreviewGrid><ProjectFormPreview /><FormModelsPreview /><ConfiguredFormPreview /></PreviewGrid> }
// Leaf Preview ownership does not depend on the page registry's composition.
export const previewFamilies = { GlassPage: "glass", ProjectFormPreview: "form", FormModelsPreview: "form", ConfiguredFormPreview: "form" }

export const pages: Record<string, React.ComponentType> = {
  glass: GlassPage,
  form: FormPage,
}
