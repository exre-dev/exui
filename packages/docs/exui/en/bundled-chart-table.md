### Bundled chart and table runtimes

Import `Recharts` and `TanStackTable` from the root package when composing ExUI charts or DataGrid. These namespaces use the same bundled instances as ExUI's components. The wrapped Recharts axes, tooltip and legend scale their omitted numeric defaults with the document root font. `TanStackTable.useTable` and its app hooks do the same for omitted column sizes. Explicit numeric sizes are pixels; bare non-React `constructTable` retains its upstream pixel defaults.

```tsx verify
import { Recharts, TanStackTable } from "@exre/exui"

export const ExuiXAxis = Recharts.XAxis
export const ExuiTableHook = TanStackTable.useTable
```
