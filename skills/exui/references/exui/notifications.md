# Notifications

Import `toast` and `Toaster` from `@exre/exui`. They share the package's bundled Sonner instance. A separately installed Sonner instance does not share their state.

Mount one stable Toaster before triggering notifications. Toaster's explicit theme wins; otherwise it follows the ExUI ThemeProvider or falls back to system. Read [themes](theme-usage.md) for provider/SSR and Pitch Black boundaries.

```tsx
import { Toaster, toast } from "@exre/exui"

export function Notifications() {
  return <Toaster duration={3000} position="top-right" visibleToasts={3} />
}

export function saveWithNotice(save: () => Promise<void>) {
  return toast.promise(save, { loading: "Saving", success: "Saved", error: "Save failed" })
}
```

Use `toast.info/success/error/warning/message/loading/promise/custom/dismiss`. Ordinary calls and `toast.loading` return an ID. Pass that ID to `toast.loading` for progress and `toast.success` or `toast.error` for completion; call `toast.dismiss(id)` to close it. A completed notification can set its own `duration`. The [complete callback example](../../examples/sonner-callbacks.tsx) adds application-owned cancellation, a deadline, and unmount cleanup; the [theme and notification example](../../examples/sonner-notifications.tsx) shows presentation options.

`visibleToasts` limits visible notifications without evicting older entries. Applications own task cancellation, timers, late-callback guards, and cleanup. `dismiss` does not cancel a Promise, and unmounting Toaster does not clear the store. Loading notifications persist until they are updated or dismissed; use an application timer for a deadline. Accessible async state in a form still belongs to that form; a toast does not replace its field errors.

## Upgrading from ExMessage

Follow the [complete migration guide](ex-message-migration.md) for the host, all removed types, callback and Promise examples, cancellation, and deadlines. This skill keeps the guide local so it remains available after installation in another repository.

The removed `ExMessageContext` becomes a stable Toaster. Set `position="top-right" duration={3000} visibleToasts={3}` explicitly to retain the old position, ordinary-message duration, and visible count; this does not preserve managed eviction. Replace `ExMessage.warn` with `toast.warning` and the other ordinary methods with their matching `toast` methods. Replace the loading handle with an ID and same-ID updates.

For types, derive host props and position from React's `ComponentProps<typeof Toaster>`, message options from `Parameters<typeof toast.success>[1]`, and IDs from `ReturnType<typeof toast.loading>`. The old four ExMessage types are no longer exported. Use application state to reject repeated or late callbacks after completion, cancellation, or timeout. The complete callback example demonstrates this without adding another library notification API.
