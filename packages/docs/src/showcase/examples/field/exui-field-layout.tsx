import { useId, useState } from "react"
import { Button, Field, FieldContent, FieldDescription, FieldLabel, Input, Textarea } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"
import "./exui-field-layout.css"
export default function FieldLayout() {
 const c = usePreviewCopy(), id = useId()
 const [align, setAlign] = useState<"left" | "right">("right")
 return <div className="exui-field-layout">
  <div style={{display:"flex",gap:".75rem",justifyContent:"flex-end"}}>{(["left","right"] as const).map(value => <Button key={value} size="sm" variant={align === value ? "default" : "outline"} aria-pressed={align === value} onClick={() => setAlign(value)}>{value === "left" ? c("Align left", "左对齐") : c("Align right", "右对齐")}</Button>)}</div>
  <Field><FieldLabel htmlFor={`${id}-code`}>{c("Project code", "项目代号")}</FieldLabel><FieldContent data-align={align}><Input id={`${id}-code`} defaultValue="AUR-2026" /></FieldContent></Field>
  <Field><FieldLabel htmlFor={`${id}-notes`}>{c("Notes", "备注")}</FieldLabel><FieldContent data-align={align}><Textarea id={`${id}-notes`} aria-describedby={`${id}-description`} defaultValue={c("Ready for the next release.", "准备下一个版本。") } rows={3} /><FieldDescription id={`${id}-description`}>{c("Optional release notes.", "可选的版本备注。")}</FieldDescription></FieldContent></Field>
 </div>
}
