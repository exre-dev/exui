import * as React from "react"
import { Button, toast } from "@exre/exui"

type Subscribe = (
  onProgress: (percent: number) => void,
  onSuccess: () => void,
  onError: (error: unknown) => void,
) => () => void

export function startUploadWithNotice(subscribe: Subscribe, timeoutMs = 10000): () => void {
  const id = toast.loading("Uploading... 0%")
  let active = true
  let cancelled = false
  let unsubscribe: (() => void) | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  const finish = (kind: "success" | "error", message: string) => {
    if (!active) return
    active = false
    clearTimeout(timer)
    unsubscribe?.()
    unsubscribe = undefined
    if (kind === "success") toast.success(message, { id, duration: 3000 })
    else toast.error(message, { id, duration: 3000 })
  }

  const cancel = () => {
    if (cancelled) return
    cancelled = true
    active = false
    clearTimeout(timer)
    unsubscribe?.()
    unsubscribe = undefined
    toast.dismiss(id)
  }

  timer = setTimeout(cancel, timeoutMs)
  try {
    const stop = subscribe(
      (percent) => { if (active) toast.loading(`Uploading... ${percent}%`, { id }) },
      () => finish("success", "Upload complete"),
      (error) => finish("error", `Upload failed: ${error instanceof Error ? error.message : String(error)}`),
    )
    if (active) unsubscribe = stop
    else stop() // A synchronous result arrived before subscribe returned its cleanup.
  } catch (error) {
    finish("error", `Upload failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  return cancel
}

export function CallbackNotificationExample({ subscribe, timeoutMs }: { subscribe: Subscribe; timeoutMs?: number }) {
  const cancelRef = React.useRef<(() => void) | null>(null)
  React.useEffect(() => () => { cancelRef.current?.(); cancelRef.current = null }, [])
  return <div>
    <Button onClick={() => { cancelRef.current?.(); cancelRef.current = startUploadWithNotice(subscribe, timeoutMs) }}>Start upload</Button>
    <Button variant="outline" onClick={() => { cancelRef.current?.(); cancelRef.current = null }}>Cancel upload</Button>
  </div>
}

export default CallbackNotificationExample
