import { useState } from "react"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"
import { CheckIcon, CodeIcon, LinkIcon } from "lucide-react"
import { useShowcaseLanguage } from "./language"
import { SourceDrawer } from "./SourceDrawer"
import { useExampleCopy } from "./useExampleCopy"

export function ExampleHeader({ id, name, extension = false, family }: { id: string; name: string; extension?: boolean; family?: string }) {
  const { language } = useShowcaseLanguage()
  const zh = language === "zh-CN"
  const { feedback, busy, copy } = useExampleCopy(id)
  const [tipOpen, setTipOpen] = useState(false)
  const number = (id.match(/-(\d+)$/)?.[1] ?? "1").padStart(2, "0")

  const label = `${name} · ${extension ? "E" : ""}${number}`
  const linkTip = feedback === "error" ? (zh ? "复制失败，请重试。" : "Copy failed. Please try again.") : feedback === "link" ? (zh ? "链接已复制" : "Link copied") : (zh ? "复制链接" : "Copy example link")

  if (family) return <div className="showcase-example-header">
    <Tooltip open={tipOpen} onOpenChange={setTipOpen}>
      <TooltipTrigger asChild>
        <button type="button" className="showcase-example-number docs-example-link" aria-label={label} aria-busy={busy} onClick={() => { setTipOpen(true); void copy("link") }}>{label}</button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{linkTip}</TooltipContent>
    </Tooltip>
    <div className="showcase-example-actions"><SourceDrawer id={id} family={family} label={label} /></div>
    <span role="status" className="showcase-sr-only">{feedback ? linkTip : ""}</span>
  </div>

  return <div className="showcase-example-header">
    <span className="showcase-example-number">{label}</span>
    <div className="showcase-example-actions">
      <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => void copy("link")}>
        {feedback === "link" ? <CheckIcon aria-hidden="true" /> : <LinkIcon aria-hidden="true" />}{zh ? "复制链接" : "Copy link"}
      </Button>
      <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => void copy("source")}>
        {feedback === "source" ? <CheckIcon aria-hidden="true" /> : <CodeIcon aria-hidden="true" />}{zh ? "复制源码" : "Copy source"}
      </Button>
    </div>
    <span className="showcase-example-feedback" role="status">{feedback === "error" ? (zh ? "复制失败，请重试。" : "Copy failed. Please try again.") : feedback === "link" ? (zh ? "链接已复制" : "Link copied") : feedback === "source" ? (zh ? "源码已复制" : "Source copied") : ""}</span>
  </div>
}
