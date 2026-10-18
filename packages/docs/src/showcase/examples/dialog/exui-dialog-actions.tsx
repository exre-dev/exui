"use client"

import { useState } from "react"
import { Button, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

export default function Pattern() {
  const c = usePreviewCopy()
  const [step, setStep] = useState(1)
  return <div className="flex items-center justify-center">
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">{c("Header action", "标题动作")}</Button></DialogTrigger>
      <DialogContent closeLabel={c("Close", "关闭")}>
        <DialogHeader action={{ tooltip: c("Previous step", "上一步"), onClick: () => setStep(Math.max(1, step - 1)) }}>
          <DialogTitle>{c("Edit collection", "编辑合集")}</DialogTitle>
          <DialogDescription>{c("The back action changes the step and keeps this dialog open.", "返回动作只切换步骤，弹窗保持打开。")}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p aria-live="polite">{c(`Step ${step} of 3`, `第 ${step} 步，共 3 步`)}</p>
          <Button variant="outline" disabled={step === 3} onClick={() => setStep(step + 1)}>{c("Next step", "下一步")}</Button>
        </DialogBody>
        <DialogFooter><DialogClose asChild><Button>{c("Done", "完成")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
}
