import { useState } from "react"
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@exre/exui"
import { CheckIcon, CopyIcon, EyeIcon } from "lucide-react"
import { useShowcaseLanguage } from "./language"
import { SourcePanel } from "./SourcePanel"
import { useExampleCopy } from "./useExampleCopy"
import "./SourceDrawer.css"

export function SourceDrawer({ id, family, label }: { id: string; family: string; label: string }) {
  const { language } = useShowcaseLanguage()
  const zh = language === "zh-CN"
  const [open, setOpen] = useState(false)
  const { copy, cancel, feedback, busy } = useExampleCopy(id)
  return <Sheet open={open} onOpenChange={next => { setOpen(next); if (!next) cancel() }}>
    <SheetTrigger asChild>
      <Button type="button" variant="secondary" size="sm" className="docs-source-trigger"><EyeIcon aria-hidden="true" />{zh ? "源码" : "Source"}</Button>
    </SheetTrigger>
    <SheetContent data-docs-source-drawer={id} className="docs-source-drawer not-prose" side="right" closeLabel={zh ? "关闭" : "Close"}>
      <SheetHeader className="docs-source-drawer-header">
        <SheetTitle>{label} {zh ? "源码" : "source"}</SheetTitle>
        <SheetDescription className="showcase-sr-only">{zh ? "查看示例文件，复制当前文件或完整示例源码。" : "View example files and copy the current file or complete example source."}</SheetDescription>
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void copy("source")}>
          {feedback === "source" ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}{zh ? "复制源码" : "Copy source"}
        </Button>
        <span role="status" className="docs-source-drawer-feedback">{feedback === "source" ? (zh ? "源码已复制" : "Source copied") : feedback === "error" ? (zh ? "复制失败，请重试。" : "Copy failed. Please try again.") : ""}</span>
      </SheetHeader>
      <SourcePanel id={id} family={family} active={open} />
    </SheetContent>
  </Sheet>
}
