import { Badge, Field, FieldContent, FieldLabel } from "@exre/exui"
import { Folder, ShieldCheck } from "lucide-react"
import { usePreviewCopy } from "../../preview-copy"
export default function DisplayFields() {
 const c = usePreviewCopy()
 return <div style={{ display:"grid", gap:"1.25rem" }}>
  <Field><FieldLabel asChild><span>{c("Workspace", "工作区")}</span></FieldLabel><FieldContent><div style={{display:"flex",alignItems:"center",gap:".75rem"}}><Folder /><strong>Aurora Studio</strong><span>{c("8 members", "8 位成员")}</span><Badge variant="secondary">Pro</Badge></div></FieldContent></Field>
  <Field><FieldLabel asChild><span>{c("Account security", "账户安全")}</span></FieldLabel><FieldContent><div style={{display:"flex",alignItems:"center",gap:".75rem"}}><ShieldCheck /><span>{c("Two-factor authentication enabled", "已启用双重认证")}</span><Badge variant="outline">{c("Active", "已启用")}</Badge></div></FieldContent></Field>
 </div>
}
