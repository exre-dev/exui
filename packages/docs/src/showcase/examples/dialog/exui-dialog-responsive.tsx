"use client"

import { useId } from "react"
import { Button, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Field, FieldLabel, Input } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

export default function Pattern() {
  const c = usePreviewCopy()
  const id = useId()
  return <div className="flex items-center justify-center">
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">{c("Mobile fullscreen", "手机自适应全屏")}</Button></DialogTrigger>
      <DialogContent responsiveFullscreen closeLabel={c("Close", "关闭")}>
        <DialogHeader actionLabel={c("Back to top", "返回顶部")} action={() => document.getElementById(id)?.scrollIntoView({ block: "start" })}>
          <DialogTitle>{c("Collection settings", "合集设置")}</DialogTitle>
          <DialogDescription>{c("Below 48rem this fills the screen. Resize while editing to keep the draft.", "宽度小于 48rem 时铺满屏幕。编辑时调整窗口大小，草稿会保留。")}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field id={id}><FieldLabel htmlFor={`${id}-name`}>{c("Collection name", "合集名称")}</FieldLabel><Input id={`${id}-name`} defaultValue={c("Weekend photos", "周末照片")} /></Field>
          {Array.from({ length: 18 }, (_, i) => <p key={i} className="py-3 text-sm text-muted-foreground">
            {c(`Section ${i + 1}: The body scrolls while the title and actions stay visible.`, `第 ${i + 1} 节：正文独立滚动，标题与底部操作保持可见。`)}
          </p>)}
        </DialogBody>
        <DialogFooter><DialogClose asChild><Button>{c("Done", "完成")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
}
