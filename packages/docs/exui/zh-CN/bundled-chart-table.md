### 内置图表与表格运行时

组合 ExUI 图表或 DataGrid 时，从根入口导入 `Recharts` 和 `TanStackTable`。这两个命名空间与 ExUI 组件使用同一份打包实例。封装后的 Recharts 坐标轴、提示和图例，会按 document 根字号缩放未传入的数字默认值；`TanStackTable.useTable` 及其应用 hook 也会缩放未传入的列尺寸。显式数字仍按像素解释；非 React 的 `constructTable` 保留上游像素默认值。

```tsx verify
import { Recharts, TanStackTable } from "@exre/exui"

export const ExuiXAxis = Recharts.XAxis
export const ExuiTableHook = TanStackTable.useTable
```
