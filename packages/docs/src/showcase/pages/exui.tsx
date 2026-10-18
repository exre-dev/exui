/* oxlint-disable react/only-export-components -- The lazy Showcase router consumes stable page registries. */
import * as React from "react"
import { z } from "zod"
import { ArrowDown, ArrowUp, Check, CheckCircle2, Cloud, Folder, Info, Mail, Plus, ShieldCheck, Trash2, TriangleAlert, X } from "lucide-react"
import {
  Alert, AlertDescription, Badge, Button, Card, CardContent, CardHeader, CardTitle,
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  ExForm, ExItem, ExMessage, Form, FormErrorSummary, FormItem, FormList, Input, Label,
  Popover, PopoverContent, PopoverTrigger, Separator, Slider, Switch, Textarea, useForm,
  type ExMessageLoadingHandle,
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
              <Button glass={glass} onClick={() => ExMessage.success(c("Collection saved", "合集已保存"))}><Check />{c("Save collection", "保存合集")}</Button>
              <Popover><PopoverTrigger asChild><Button glass={glass} variant="outline">{c("Share", "分享")}</Button></PopoverTrigger><PopoverContent glass={glass} style={materialStyle}>
                <strong>{c("Invite collaborators", "邀请协作者")}</strong><Input glass={glass} type="email" aria-label={c("Collaborator email", "协作者邮箱")} placeholder="name@example.com" />
                <Button glass={glass} onClick={() => ExMessage.success(c("Invitation created locally", "已在本地创建邀请"))}><Mail />{c("Create invitation", "创建邀请")}</Button>
              </PopoverContent></Popover>
              <Dialog><DialogTrigger asChild><Button glass={glass} variant="outline">{c("Archive", "归档")}</Button></DialogTrigger><DialogContent glass={glass} style={materialStyle} closeLabel={c("Close", "关闭")}>
                <DialogHeader><DialogTitle>{c("Archive collection?", "归档此合集？")}</DialogTitle><DialogDescription>{c("You can restore this collection from the archive at any time.", "你可以随时从归档中恢复此合集。")}</DialogDescription></DialogHeader>
                <DialogFooter><DialogClose asChild><Button glass={glass} variant="outline">{c("Cancel", "取消")}</Button></DialogClose><DialogClose asChild><Button glass={glass} onClick={() => ExMessage.success(c("Collection archived", "合集已归档"))}>{c("Archive", "归档")}</Button></DialogClose></DialogFooter>
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

function FormPage() {
  const c = useCopy()
  const form = useForm({ schema: projectSchema, defaultValues: { name: "Aurora", description: "A shared space for our next release.", members: [{ name: "Alex Chen", email: "alex@example.com" }] }, mode: "onBlur" })
  const [saved, setSaved] = React.useState("")
  return <PreviewGrid><Preview shareId="exui-form-1" wide><div style={panel}>
    <Form form={form} onSubmit={(data) => setSaved(data.name)} formatIssue={(message) => c(message, issueTranslations[message] ?? message)} columns={{ base: 1, md: 2 }} style={{ position: "relative" }}>
      {/* Keep actions above validation messages so blur cannot move a pointer target. */}
      <div data-span="full" style={{ ...row, justifyContent: "flex-end", paddingLeft: "10rem" }}>
        <Button type="button" variant="outline" onClick={() => { form.reset(); setSaved("") }}>{c("Reset", "重置")}</Button>
        <Button type="submit">{c("Save project", "保存项目")}</Button>
      </div>
      <FormErrorSummary title={c("Check these fields", "请检查以下字段")} />
      <FormItem form={form} name="name" label={c("Project name", "项目名称")} control="text" required colSpan="full" />
      <FormItem form={form} name="description" label={c("Description", "描述")} control="textarea" controlProps={{ rows: 3 }} colSpan="full" />
      <FormList form={form} name="members" defaultItem={{ name: "", email: "" }} label={c("Team members", "团队成员")} render={(array) => <div style={stack}>
        {array.items.map(({ key, index }) => <div key={key} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr) auto", alignItems: "start", gap: "0.75rem" }}>
          <FormItem form={form} name={`members.${index}.name`} label={c("Name", "姓名")} control="text" required />
          <FormItem form={form} name={`members.${index}.email`} label={c("Email", "邮箱")} control="email" required />
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
  </div></Preview></PreviewGrid>
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

function ExFormPage() {
  const c = useCopy()
  const [launched, setLaunched] = React.useState("")
  const form = useForm({ schema: launchSchema, defaultValues: { name: "Aurora", category: "design", date: "", channels: ["email"], private: true, accepted: false } })
  return <PreviewGrid><Preview shareId="exui-ex-form-1" wide><div style={panel}>
    <ExForm form={form} columns={{ base: 1, md: 2 }} formatIssue={(message) => c(message, issueTranslations[message] ?? message)} onSubmit={(data) => setLaunched(data.name)}
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
          <ExItem title={c("Project name", "项目名称")} layout="horizontal"><strong>{values.name}</strong></ExItem>
          <ExItem title={c("Launch date", "发布日期")} layout="horizontal">{values.date}</ExItem>
          <ExItem title={c("Notifications", "通知方式")} layout="horizontal"><div style={row}>{values.channels.map((channel) => <Badge key={channel} variant="secondary">{channel === "email" ? c("Email", "邮件") : channel === "in-app" ? c("In-app", "站内通知") : c("Weekly digest", "每周摘要")}</Badge>)}</div></ExItem>
          <ExItem title={c("Visibility", "可见性")} layout="horizontal"><Badge variant="outline">{values.private ? c("Private", "私有") : c("Team", "团队")}</Badge></ExItem>
        </div> },
      ]}>
      <FormErrorSummary title={c("Check these fields", "请检查以下字段")} />
    </ExForm>
    {launched && <Alert role="status"><CheckCircle2 /><AlertDescription>{c(`${launched} is ready`, `${launched} 已就绪`)}</AlertDescription></Alert>}
  </div></Preview></PreviewGrid>
}

function ExItemPage() {
  const c = useCopy()
  const [notify, setNotify] = React.useState(true)
  const [align, setAlign] = React.useState<"left" | "right">("right")
  const id = React.useId()
  return <PreviewGrid>
    <Preview shareId="exui-ex-item-1" wide><div style={panel}>
      <ExItem title={c("Display name", "显示名称")} desc={c("Visible to everyone in your workspace.", "工作区中的所有人都能看到。") }><Input defaultValue="Alex Chen" /></ExItem>
      <Separator />
      <ExItem title={c("Email address", "邮箱地址")} desc={c("Used for account notifications.", "用于接收账户通知。") } layout="horizontal" contentMaxWidth="24rem"><Input type="email" defaultValue="alex@example.com" /></ExItem>
      <Separator />
      <ExItem title={c("Weekly summary", "每周摘要")} desc={c("A digest of your team's activity.", "查看团队一周内的活动。") } layout="horizontal" contentAlign="right" controlId={id} contentMaxWidth="fit-content"><Switch id={id} checked={notify} onCheckedChange={setNotify} /></ExItem>
    </div></Preview>
    <Preview shareId="exui-ex-item-2"><div style={stack}>
      <ExItem title={c("Workspace", "工作区")}><div style={row}><div style={{ display: "grid", placeItems: "center", width: "3rem", height: "3rem", borderRadius: "var(--exui-radius-extra-large)", background: "var(--muted)" }}><Folder /></div><div><strong>Aurora Studio</strong><p style={{ ...muted, margin: "0.25rem 0 0" }}>{c("8 members", "8 位成员")}</p></div><Badge variant="secondary">Pro</Badge></div></ExItem>
      <ExItem title={c("Account security", "账户安全")}><div style={row}><ShieldCheck size={18} /><span>{c("Two-factor authentication enabled", "已启用双重认证")}</span><Badge variant="outline">{c("Active", "已启用")}</Badge></div></ExItem>
    </div></Preview>
    <Preview shareId="exui-ex-item-3"><div style={stack}>
      <div style={{ ...row, justifyContent: "flex-end" }}>{(["left", "right"] as const).map((value) => <Button key={value} variant={align === value ? "default" : "outline"} size="sm" aria-pressed={align === value} onClick={() => setAlign(value)}>{value === "left" ? c("Align left", "左对齐") : c("Align right", "右对齐")}</Button>)}</div>
      <ExItem title={c("Project code", "项目代号")} contentMaxWidth="16rem" contentAlign={align}><Input defaultValue="AUR-2026" /></ExItem>
      <ExItem title={c("Notes", "备注")} controlId={`${id}-notes`} contentMaxWidth="16rem" contentAlign={align}><Textarea id={`${id}-notes`} defaultValue={c("Ready for the next release.", "准备下一个版本。") } rows={3} /></ExItem>
    </div></Preview>
  </PreviewGrid>
}

function ExMessagePage() {
  const c = useCopy()
  const handle = React.useRef<ExMessageLoadingHandle | null>(null)
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => () => { handle.current?.dismiss(); handle.current = null }, [])
  const complete = (outcome: "success" | "error" | "dismiss") => {
    if (outcome === "success") handle.current?.onSuccess(c("Files synced", "文件已同步"))
    else if (outcome === "error") handle.current?.onError(c("Sync failed. Your files are safe.", "同步失败，文件仍安全保留。"))
    else handle.current?.dismiss()
    handle.current = null
    setLoading(false)
  }
  return <PreviewGrid>
    <Preview shareId="exui-ex-message-1"><div style={row}>
      <Button variant="outline" disabled={loading} onClick={() => ExMessage.info(c("Your workspace is up to date", "工作区已是最新状态"))}><Info />{c("Info", "提示")}</Button>
      <Button variant="outline" disabled={loading} onClick={() => ExMessage.success(c("Changes saved", "更改已保存"))}><CheckCircle2 />{c("Success", "成功")}</Button>
      <Button variant="outline" disabled={loading} onClick={() => ExMessage.warn(c("Storage is almost full", "存储空间即将用完"))}><TriangleAlert />{c("Warning", "警告")}</Button>
      <Button variant="outline" disabled={loading} onClick={() => ExMessage.error(c("Unable to save changes", "无法保存更改"))}><X />{c("Error", "错误")}</Button>
    </div></Preview>
    <Preview shareId="exui-ex-message-2"><div style={stack}>
      <div style={row}><Cloud /><strong>{c("Workspace files", "工作区文件")}</strong><Badge variant="secondary">{loading ? c("Syncing", "同步中") : c("Ready", "就绪")}</Badge></div>
      <div style={row}>
        <Button disabled={loading} onClick={() => { handle.current = ExMessage.loading(c("Syncing files…", "正在同步文件…")); setLoading(true) }}><Cloud />{c("Start sync", "开始同步")}</Button>
        <Button variant="outline" disabled={!loading} onClick={() => complete("success")}>{c("Complete", "完成")}</Button>
        <Button variant="outline" disabled={!loading} onClick={() => complete("error")}>{c("Fail", "失败")}</Button>
        <Button variant="ghost" disabled={!loading} onClick={() => complete("dismiss")}>{c("Dismiss", "关闭")}</Button>
      </div>
    </div></Preview>
  </PreviewGrid>
}

export const pages: Record<string, React.ComponentType> = {
  glass: GlassPage,
  form: FormPage,
  "ex-form": ExFormPage,
  "ex-item": ExItemPage,
  "ex-message": ExMessagePage,
}
