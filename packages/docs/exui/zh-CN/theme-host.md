### 主题宿主

`ThemeProvider` 将 `dark`、`light` 或 `system` 存到 `storageKey`（默认 `theme`），并更新 document 根节点。初始化时会读取 `localStorage`，因此只能在浏览器完成 hydration 后挂载，不能直接用于服务端渲染。`useTheme` 必须位于 Provider 内。纯黑是单独的 Token CSS 类，不是 Provider 主题；使用前导入组件样式表。

```tsx verify
import * as React from "react"
import { ThemeProvider, useTheme } from "@exre/exui"

function ThemeButton() {
  const { theme, setTheme } = useTheme()
  return <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>主题：{theme}</button>
}
export function ClientTheme() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? <ThemeProvider defaultTheme="system"><ThemeButton /></ThemeProvider> : null
}
```
