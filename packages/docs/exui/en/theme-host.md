### Theme host

`ThemeProvider` stores `dark`, `light` or `system` under `storageKey` (default `theme`) and updates the document root. Its initializer reads `localStorage`, so mount it only after browser hydration; a server render must not invoke it. `useTheme` must run beneath the provider. Pitch Black is a separate Token CSS class, not a provider theme; import the component stylesheet before using it.

```tsx verify
import * as React from "react"
import { ThemeProvider, useTheme } from "@exre/exui"

function ThemeButton() {
  const { theme, setTheme } = useTheme()
  return <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Theme: {theme}</button>
}
export function ClientTheme() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? <ThemeProvider defaultTheme="system"><ThemeButton /></ThemeProvider> : null
}
```
