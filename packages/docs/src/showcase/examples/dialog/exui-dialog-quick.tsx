"use client"

import { useId, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { Button, Dialog, Field, FieldLabel, Input } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

export default function Pattern() {
  const c = usePreviewCopy()
  const id = useId()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  return <div className="flex items-center justify-center">
    <Button variant="outline" onClick={() => setOpen(true)}>{c("Quick composition", "快捷写法")}</Button>
    <Dialog open={open} onOpenChange={setOpen}
      title={c("Edit profile", "编辑资料")}
      description={c(`Step ${step} of 2. Slots accept text or JSX.`, `第 ${step} 步，共 2 步。标题、说明与底部支持文字或 JSX。`)}
      action={{ tooltip: c("Previous step", "上一步"), icon: ChevronLeft, onClick: () => setStep(1) }}
      responsiveFullscreen
      contentProps={{ closeLabel: c("Close", "关闭") }}
      footer={<><Button variant="outline" disabled={step === 2} onClick={() => setStep(2)}>{c("Next", "下一步")}</Button><Button onClick={() => setOpen(false)}>{c("Done", "完成")}</Button></>}>
      <Field><FieldLabel htmlFor={id}>{c("Display name", "显示名称")}</FieldLabel><Input id={id} defaultValue={c("Alex", "小明")} /></Field>
    </Dialog>
  </div>
}
