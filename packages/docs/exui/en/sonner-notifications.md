### Shared Sonner notifications

Import `Toaster` and `toast` from `@exre/exui` so notifications use the same bundled Sonner instance. Mount one stable `Toaster` before triggering notifications. A separately installed Sonner instance has independent state.

Use `toast.loading` to create a loading notification and keep its returned ID. Pass that ID to `toast.loading`, `toast.success`, or `toast.error` to update the same notification. `toast.promise` follows a Promise through loading, success, and failure. Close a notification with `toast.dismiss(id)`; the warning method is `toast.warning`.

`visibleToasts` limits how many notifications are visible without evicting older entries. Applications own cancellation, deadlines, late-callback guards, and cleanup. Unmounting the host does not clear the notification store, and a loading duration does not replace a task deadline.
