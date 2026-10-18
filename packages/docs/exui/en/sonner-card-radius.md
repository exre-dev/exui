### Notification card corners

`Toaster` uses ExUI's `--radius-2xl` token for notification card corners: 18px at the default 16px root font size. Corners follow the root font size and scoped radius tokens. Override the `--border-radius` variable through `Toaster.style` when a composition needs a different radius.

`toast.custom` renders an unstyled notification, so its content must apply its own card corners. The custom Sonner examples use `rounded-[var(--border-radius)]` to inherit the host's radius, including overrides, and `w-full` to follow its responsive width. Use the same classes on the outer card when composing custom notifications.
