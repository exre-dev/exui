### Density and root-font sizing

The compact density scope changes the default geometry of `Button`, `Input`, `Textarea`, `Select`, `NativeSelect` and `InputGroup`. Explicit sizes and complex widget layouts do not all follow that compact scope. CSS dimensions expressed in `rem` follow the root font size. Some third-party numeric geometry cannot use CSS lengths; ExUI converts its defaults at the DOM boundary and updates them when the root font changes. Explicit numeric sizes remain the caller's pixels. Do not scale a supplied number a second time.

```tsx verify
import { Button, Select } from "@exre/exui"

export function CompactControls() {
  return <div className="density-compact">
    <Button type="button">Save</Button>
    <Select options={[{ value: "a", label: "Alpha" }]} defaultValue="a" />
  </div>
}
```
