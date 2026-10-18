### Managed messages and Sonner

Mount one `ExMessageContext` host before calling `ExMessage`. It renders the package's shared `Toaster`; do not add another for managed messages. `loading` returns a handle with `onSuccess`, `onError` and `dismiss`, all acting on the same notice. Direct root `toast` shares that bundled Sonner instance, while an independently installed Sonner copy has separate state. `maxCount` evicts only managed ExMessage entries, but the host also passes it to `Toaster.visibleToasts`, so direct toasts share the visible display cap.

```tsx verify
import { Button, ExMessage, ExMessageContext } from "@exre/exui"

export function MessageExample() {
  return <><ExMessageContext placement="top-right" maxCount={3} />
    <Button type="button" onClick={() => {
      const pending = ExMessage.loading("Saving")
      pending.onSuccess("Saved")
    }}>Save</Button></>
}
```
