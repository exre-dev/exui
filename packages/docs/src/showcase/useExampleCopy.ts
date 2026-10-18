import { useEffect, useRef, useState } from "react"
import { examplePath } from "./example-navigation"

export function useExampleCopy(id: string) {
  const [feedback, setFeedback] = useState<"link" | "source" | "error" | null>(null)
  const [busy, setBusy] = useState(false)
  const pending = useRef<AbortController | null>(null)

  useEffect(() => () => { pending.current?.abort() }, [id])
  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 2500)
    return () => window.clearTimeout(timer)
  }, [feedback])

  function cancel() {
    pending.current?.abort()
    pending.current = null
    setBusy(false)
    setFeedback(null)
  }

  async function copy(kind: "link" | "source") {
    if (pending.current) return
    const controller = new AbortController()
    pending.current = controller
    setBusy(true)
    setFeedback(null)
    try {
      const url = new URL(examplePath(id), window.location.origin)
      let text = url.href
      if (kind === "source") {
        const response = await fetch(new URL("source.md", url), { signal: controller.signal })
        if (!response.ok || /text\/html/i.test(response.headers.get("content-type") ?? "")) throw new Error("Source document unavailable")
        const source = await response.text()
        if (!source.startsWith("# ") || !source.includes(`Example ID: \`${id}\``)) throw new Error("Invalid source document")
        text = `Reference: ${url.href}\n\n${source}`
      }
      if (controller.signal.aborted) return
      await navigator.clipboard.writeText(text)
      if (!controller.signal.aborted) setFeedback(kind)
    } catch {
      if (!controller.signal.aborted) setFeedback("error")
    } finally {
      if (pending.current === controller) {
        pending.current = null
        if (!controller.signal.aborted) setBusy(false)
      }
    }
  }

  return { copy, cancel, feedback, busy }
}
