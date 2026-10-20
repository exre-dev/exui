# Upgrade from ExMessage

This guide applies to ExUI versions that remove `ExMessage`, `ExMessageContext`, and their types. This is a breaking change; use your installed package and release notes to identify the published version. Import global notifications through `Toaster` and `toast` from `@exre/exui`, without installing a separate Sonner. Keep `Alert` for persistent information inside a page.

## Replace the host and calls

Remove the old imports and mount one stable Toaster at the application root before triggering notifications. Do not mount a host on every page or key the entire host by the current page. The `NotificationHost` below explicitly retains the old presentation settings: top right, 3000ms for ordinary notifications, and three visible notifications.

| Previous usage | Replacement |
| --- | --- |
| `ExMessageContext` | `Toaster` |
| Host `placement` | Host `position` |
| `ExMessage.info/success/error` | `toast.info/success/error` |
| `ExMessage.warn` | `toast.warning` |
| `ExMessage.loading` returns a handle | `toast.loading` returns a notification ID |
| `handle.onSuccess(text)` | `toast.success(text, { id })` |
| `handle.onError(text)` | `toast.error(text, { id })` |
| `handle.dismiss()` or `ExMessage.dismiss(id)` | `toast.dismiss(id)` |
| Host `maxCount` evicts older entries | No equivalent; `visibleToasts` limits visibility only |

Pass the original ID on completion to update the loading notification. Omitting it creates another notification. A result can specify its own `duration`.

## Complete migration example

Everything below is consuming-application code, not a new ExUI export. Mount `NotificationHost` at the root and use `PromiseNotificationExample` for ordinary Promise tasks. For callback-based uploads, pass your subscription to `CallbackNotificationExample`. The subscription receives progress, success, and error callbacks and returns a cancellation or unsubscribe function; connect it to your own upload API.

`startUploadWithNotice` owns one task's validity. It ignores duplicate results after completion and late callbacks after cancellation, deadline, or unmount. A synchronous result still releases the subscription after its cleanup function becomes available. The example's ten-second deadline only closes the notification; it does not invent a business failure. The returned cleanup can also dismiss a completed result.

```tsx verify
import "@exre/exui/style.css"
import * as React from "react"
import { Button, Toaster, toast } from "@exre/exui"

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

export function NotificationHost() {
  return <Toaster position="top-right" duration={3000} visibleToasts={3} />
}

export function PromiseNotificationExample({ save }: { save: () => Promise<void> }) {
  return <Button type="button" onClick={() => toast.promise(Promise.resolve().then(save), {
    loading: "Saving...", success: "Saved", error: "Save failed",
  })}>Save</Button>
}

export type NotificationHostProps = React.ComponentProps<typeof Toaster>
export type NotificationPosition = NonNullable<NotificationHostProps["position"]>
export type NotificationOptions = NonNullable<Parameters<typeof toast.success>[1]>
export type NotificationId = ReturnType<typeof toast.loading>
```

## Migrate types

The four previous types are no longer exported. The example derives application types from the actual public component and functions:

| Removed type | Application replacement |
| --- | --- |
| `ExMessageContextProps` | `NotificationHostProps` |
| `ExMessagePlacement` | `NotificationPosition` |
| `ExMessageOptions` | `NotificationOptions` |
| `ExMessageLoadingHandle` | `NotificationId`; update or dismiss by ID |

Do not rename the handle type and keep calling `onSuccess` or `onError`. Loading now returns an ID.

## Account for behavior changes

- `visibleToasts={3}` does not evict entries when a fourth notification arrives. Applications that need eviction must define that policy explicitly.
- Loading persists until it is updated or dismissed. Its `duration` does not replace the previous handle deadline; clear application timers on completion, cancellation, and unmount.
- `toast.dismiss(id)` closes a notification without cancelling a request or Promise. A bare `toast.promise` does not prevent every result after cancellation. Use application-owned validity checks such as the callback example when that behavior matters.
- Unmounting Toaster does not clear its store. Pages dismiss only notifications they own; an unscoped `toast.dismiss()` would clear other tasks' notices.
- The old host's duplicate-mount errors, argument validation, and specific effect-order buffer are gone. Send initialization notices after the host is ready.

## Upgrade checklist

1. Find the two old runtime names and four types, replace imports and calls, and rename `warn` to `warning`.
2. Confirm the host and every notification use the same `@exre/exui` instance, with one stable root host.
3. Verify ordinary notices, Promise resolve/reject, callback progress and same-ID completion, and dismissal.
4. Verify cancellation, deadlines, navigation, and repeated callbacks so stale results cannot reappear.
5. Replace old page or share links with the [Sonner documentation](../components/sonner.md). The `exui/ex-message` family page and both `exui-ex-message-*` share IDs are removed without compatibility routes.

See [Sonner](../components/sonner.md) for notification patterns, status icons, and presentation options.
