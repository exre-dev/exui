import { useEffect, useRef, useState } from "react"
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@exre/exui"
import type { GlassIconColor } from "@exre/exui/icons/glass-icons"
import { CheckIcon, CopyIcon, DownloadIcon, SearchIcon, XIcon } from "lucide-react"
import { iconCatalog, type IconEntry } from "./catalog"
import "./IconsGallery.css"

type Backdrop = "paper" | "night" | "checker"
type Locale = "zh-CN" | "en"
const colors: GlassIconColor[] = ["blue", "green", "purple", "pink", "coral", "orange"]
const swatches: Record<GlassIconColor, string> = { blue: "#477FFF", green: "#26AB5B", purple: "#9F66FF", pink: "#FF196E", coral: "#F23E2C", orange: "#FF7B0D" }

function useCopyFeedback(text: string) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const request = useRef(0)
  useEffect(() => () => { request.current++; clearTimeout(timer.current) }, [])
  async function copy() {
    const current = ++request.current
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(text)
      if (current !== request.current) return
      setStatus("success")
    } catch {
      if (current !== request.current) return
      setStatus("error")
    }
    timer.current = setTimeout(() => setStatus("idle"), 1600)
  }
  return { status, copy }
}

function CopyButton({ text, label, locale }: { text: string; label: string; locale: Locale }) {
  const { status, copy } = useCopyFeedback(text)
  const feedback = status === "success" ? (locale === "zh-CN" ? "已复制" : "Copied") : status === "error" ? (locale === "zh-CN" ? "复制失败" : "Copy failed") : label
  return <Button type="button" size="sm" aria-label={label} title={label} onClick={copy}>
    {status === "success" ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}<span aria-live="polite">{feedback}</span>
  </Button>
}

function CopyTitleButton({ name, displayName = name, locale, className = "" }: { name: string; displayName?: string; locale: Locale; className?: string }) {
  const { status, copy } = useCopyFeedback(name)
  const label = locale === "zh-CN" ? `复制 ${name}` : `Copy ${name}`
  const feedback = status === "success" ? (locale === "zh-CN" ? "已复制" : "Copied") : status === "error" ? (locale === "zh-CN" ? "复制失败" : "Copy failed") : ""
  return <button type="button" className={`ip-copy-title ${className}`} aria-label={label} title={feedback || label} data-copy-state={status} onClick={copy}>
    <span>{displayName}</span>{status === "success" ? <CheckIcon aria-hidden="true" /> : status === "error" ? <XIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}<span className="sr-only" aria-live="polite">{feedback}</span>
  </button>
}

function IconDetails({ entry, backdrop, locale }: { entry: IconEntry; backdrop: Backdrop; locale: Locale }) {
  const zh = locale === "zh-CN"
  const [color, setColor] = useState<GlassIconColor | "original">("original")
  const colorId = `glass-icon-color-${entry.slug}`
  const selectedColor = color === "original" ? undefined : color
  const colorLabels = zh ? { blue: "蓝色", green: "绿色", purple: "紫色", pink: "粉色", coral: "珊瑚红", orange: "橙色" } : { blue: "Blue", green: "Green", purple: "Purple", pink: "Pink", coral: "Coral", orange: "Orange" }
  const reactCode = `import { ${entry.name} } from "@exre/exui/icons/glass-icons"\n\n<${entry.name}${selectedColor ? ` color="${selectedColor}"` : ""} />`
  const svgCode = `import iconUrl from "@exre/exui/icons/glass-icons/${entry.slug}.svg"\n\n<img src={iconUrl} alt="" />`
  return <div className="ip-details">
    <div className={`ip-stage ip-backdrop-${backdrop}`}><entry.Component size="11rem" color={selectedColor} /></div>
    <div className="ip-detail-title"><div><CopyTitleButton name={entry.name} locale={locale} className="ip-detail-name" /><span>Glass icons · 128 × 128</span></div><Button asChild size="sm"><a href={entry.assetUrl} download={`${entry.slug}.svg`} aria-label={zh ? "下载 SVG" : "Download SVG"}><DownloadIcon aria-hidden="true" />SVG</a></Button></div>
    <div className="ip-color-picker"><span id={colorId}>{zh ? "图标颜色" : "Icon color"}</span><div className="ip-color-swatches" role="group" aria-labelledby={colorId}>
      <button type="button" className="ip-color-original" aria-pressed={color === "original"} onClick={() => setColor("original")}>{zh ? "原色" : "Original"}</button>
      {colors.map(option => <button type="button" key={option} className="ip-color-swatch" style={{ backgroundColor: swatches[option] }} aria-label={colorLabels[option]} title={colorLabels[option]} aria-pressed={color === option} onClick={() => setColor(option)} />)}
    </div></div>
    <div className="ip-code-heading"><span>React</span><CopyButton text={reactCode} label={zh ? "复制用法" : "Copy usage"} locale={locale} /></div>
    <pre className="ip-code"><code>{reactCode}</code></pre>
    <div className="ip-code-heading"><span>SVG</span><CopyButton text={svgCode} label={zh ? "复制引用" : "Copy import"} locale={locale} /></div>
    <pre className="ip-code"><code>{svgCode}</code></pre>
    <p className="ip-detail-note">{zh ? "默认 8rem · 透明背景 · 使用 color 切换 React 图标配色，保留玻璃质感；SVG 下载保留原色。可通过 size、className 或 style 调整尺寸。" : "8rem by default · transparent background · color changes the React icon palette while preserving its glass appearance. SVG downloads keep their original colors. Customize size with size, className or style."}</p>
  </div>
}

export function IconsGallery({ locale }: { locale: Locale }) {
  const zh = locale === "zh-CN"
  const [query, setQuery] = useState("")
  const [backdrop, setBackdrop] = useState<Backdrop>("paper")
  const [selected, setSelected] = useState<IconEntry | null>(null)
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement | null>(null)
  const search = useRef<HTMLInputElement>(null)
  const filtered = iconCatalog.filter(entry => `${entry.name} ${entry.slug}.svg`.toLowerCase().includes(query.trim().toLowerCase()))
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (event.key === "/" && !event.altKey && !event.ctrlKey && !event.metaKey && !(event.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"],[role="dialog"]')) { event.preventDefault(); search.current?.focus() }
    }
    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])
  const labels = zh ? { paper: "浅色背景", night: "深色背景", checker: "透明棋盘背景" } : { paper: "Light background", night: "Dark background", checker: "Checkerboard background" }
  return <div className="icons-gallery not-prose">
    <div className="ip-eyebrow">EXUI ICON LIBRARY</div>
    <header className="ip-header"><div><h1>Icons<span>{iconCatalog.length}</span></h1><p>{zh ? "50 个 Glass 图标，支持 React 组件与 SVG 资源。" : "50 Glass icons, available as React components and SVG assets."}</p></div><span className="ip-collection-tag"><span />Glass icons</span></header>
    <div className="ip-toolbar"><label className="ip-search"><SearchIcon size={18} aria-hidden="true" /><input ref={search} aria-label={zh ? "搜索图标" : "Search icons"} placeholder={zh ? "搜索图标名称，例如 camera…" : "Search icons, e.g. camera…"} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label={zh ? "清除搜索" : "Clear search"} onClick={() => setQuery("")}><XIcon size={15} /></button>}<kbd>/</kbd></label><div className="ip-backdrops" role="group" aria-label={zh ? "预览底色" : "Preview background"}>{(["paper", "night", "checker"] as const).map(option => <button type="button" key={option} className={`ip-backdrop-swatch ip-backdrop-${option}`} aria-label={labels[option]} title={labels[option]} aria-pressed={backdrop === option} onClick={() => setBackdrop(option)} />)}</div></div>
    <div className="ip-results"><span>{zh ? `${filtered.length} 个图标` : `${filtered.length} icons`}</span><span>{zh ? "点击图案预览 · 点击名称复制" : "Select artwork to preview · Select a name to copy"}</span></div>
    {filtered.length === 0 ? <div className="ip-empty"><SearchIcon size={26} aria-hidden="true" /><h2>{zh ? "没有找到图标" : "No icons found"}</h2><p>{zh ? "试试 Camera、Heart 或组件名称。" : "Try Camera, Heart or a component name."}</p><Button onClick={() => setQuery("")}>{zh ? "清除搜索" : "Clear search"}</Button></div> : <div className="ip-gallery">{filtered.map(entry => <div key={entry.name} data-icon-card className="ip-card">
      <button type="button" className="ip-card-preview" aria-label={zh ? `预览 ${entry.name}` : `Preview ${entry.name}`} onClick={event => { opener.current = event.currentTarget; setSelected(entry); setOpen(true) }}><span className={`ip-card-art ip-backdrop-${backdrop}`}><entry.Component size="6rem" /></span></button>
      <CopyTitleButton name={entry.name} displayName={entry.name.replace(/Icon$/, "")} locale={locale} className="ip-card-name" />
    </div>)}</div>}
    <Sheet open={open} onOpenChange={setOpen}><SheetContent className="ip-sheet not-prose" side="right" closeLabel={zh ? "关闭详情" : "Close details"} onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus() }}>
      {selected && <><SheetHeader><SheetTitle><CopyTitleButton name={selected.name} locale={locale} /></SheetTitle><SheetDescription>{zh ? "预览图标、复制代码或下载 SVG。" : "Preview, copy code or download the SVG."}</SheetDescription></SheetHeader><IconDetails key={selected.name} entry={selected} backdrop={backdrop} locale={locale} /></>}
    </SheetContent></Sheet>
  </div>
}
