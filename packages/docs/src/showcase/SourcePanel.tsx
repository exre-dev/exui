import { useEffect, useState } from "react"
import { examplePath } from "./example-navigation"
import { useShowcaseLanguage } from "./language"

type SourceFile = { path: string; language: string; code: string; highlightedHtml: string }
type ExampleSource = { schemaVersion: 1; id: string; family: string; files: SourceFile[] }
const cache = new Map<string, ExampleSource>()

function parseSource(value: unknown, id: string, family: string): ExampleSource {
  if (!value || typeof value !== "object") throw new Error("Invalid source")
  const source = value as Partial<ExampleSource>
  if (source.schemaVersion !== 1 || source.id !== id || source.family !== family || !Array.isArray(source.files) || source.files.length === 0) throw new Error("Invalid source")
  if (!source.files.every(file => file && typeof file.path === "string" && typeof file.language === "string" && typeof file.code === "string" && typeof file.highlightedHtml === "string")) throw new Error("Invalid source")
  return source as ExampleSource
}

export function SourcePanel({ id, family, active }: { id: string; family: string; active: boolean }) {
  const { language } = useShowcaseLanguage()
  const zh = language === "zh-CN"
  const [source, setSource] = useState<ExampleSource | null>(() => cache.get(id) ?? null)
  const [selected, setSelected] = useState(0)
  const [revision, setRevision] = useState(0)
  const [error, setError] = useState(false)
  const [feedback, setFeedback] = useState<"copied" | "error" | null>(null)
  useEffect(() => {
    if (!active || source) return
    const controller = new AbortController()
    const url = new URL("source.json", new URL(examplePath(id), window.location.origin))
    void fetch(url, { signal: controller.signal }).then(async response => {
      if (!response.ok || /text\/html/i.test(response.headers.get("content-type") ?? "")) throw new Error("Source unavailable")
      return parseSource(await response.json(), id, family)
    }).then(data => {
      if (controller.signal.aborted) return
      cache.set(id, data)
      setSource(data)
      setError(false)
    }).catch(() => { if (!controller.signal.aborted) setError(true) })
    return () => controller.abort()
  }, [active, id, family, revision, source])
  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 2500)
    return () => window.clearTimeout(timer)
  }, [feedback])
  const file = source?.files[selected] ?? source?.files[0]
  async function copyFile() {
    if (!file) return
    try { await navigator.clipboard.writeText(file.code); setFeedback("copied") }
    catch { setFeedback("error") }
  }
  if (error) return <div className="docs-example-source-state" role="alert">{zh ? "源码加载失败。" : "Source failed to load."} <button type="button" onClick={() => { setError(false); setRevision(value => value + 1) }}>{zh ? "重试" : "Retry"}</button></div>
  if (!source || !file) return <div className="docs-example-source-state" role="status">{zh ? "正在加载源码…" : "Loading source…"}</div>
  return <div className="docs-example-source" data-testid={`source-${id}`}>
    <div className="docs-example-source-toolbar">
      <label>{zh ? "文件" : "File"} <select aria-label={zh ? "示例文件" : "Example file"} value={file.path} onChange={event => setSelected(source.files.findIndex(item => item.path === event.target.value))}>
        {source.files.map(item => <option key={item.path} value={item.path}>{item.path}</option>)}
      </select></label>
      <button type="button" onClick={() => void copyFile()}>{zh ? "复制文件" : "Copy file"}</button>
    </div>
    <div className="docs-example-source-code" data-language={file.language} dangerouslySetInnerHTML={{ __html: file.highlightedHtml }} />
    <span role="status" className="docs-example-source-feedback">{feedback === "copied" ? (zh ? "文件已复制" : "File copied") : feedback === "error" ? (zh ? "复制失败，请重试。" : "Copy failed. Please try again.") : ""}</span>
  </div>
}
