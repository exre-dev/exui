import { useId, useState } from "react"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, Input, Separator, Switch } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"
export default function SettingsFields() {
 const c = usePreviewCopy(), id = useId()
 const [notify, setNotify] = useState(true)
 const [email, setEmail] = useState("alex@example.com")
 const invalid = !email.includes("@")
 return <FieldGroup style={{ gap:"1.25rem", width:"100%" }}>
  <Field><FieldLabel htmlFor={`${id}-name`}>{c("Display name", "显示名称")}</FieldLabel><FieldContent>
   <Input id={`${id}-name`} aria-describedby={`${id}-name-description`} defaultValue="Alex Chen" />
   <FieldDescription id={`${id}-name-description`}>{c("Visible to everyone in your workspace.", "工作区中的所有人都能看到。")}</FieldDescription>
  </FieldContent></Field><Separator />
  <Field orientation="responsive" data-invalid={invalid}><FieldLabel htmlFor={`${id}-email`}>{c("Email address", "邮箱地址")}</FieldLabel><FieldContent>
   <Input id={`${id}-email`} type="email" value={email} onChange={event => setEmail(event.target.value)} aria-invalid={invalid} aria-describedby={`${id}-email-description${invalid ? ` ${id}-email-error` : ""}`} />
   <FieldDescription id={`${id}-email-description`}>{c("Used for account notifications.", "用于接收账户通知。")}</FieldDescription>
   {invalid && <FieldError id={`${id}-email-error`}>{c("Enter a valid email", "请输入有效邮箱")}</FieldError>}
  </FieldContent></Field><Separator />
  <Field orientation="horizontal"><FieldContent><FieldLabel htmlFor={`${id}-notify`}>{c("Weekly summary", "每周摘要")}</FieldLabel>
   <FieldDescription id={`${id}-notify-description`}>{c("A digest of your team's activity.", "查看团队一周内的活动。")}</FieldDescription></FieldContent>
   <Switch id={`${id}-notify`} aria-describedby={`${id}-notify-description`} checked={notify} onCheckedChange={setNotify} />
  </Field>
 </FieldGroup>
}
