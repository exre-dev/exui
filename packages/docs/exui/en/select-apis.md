### ExUI Select APIs

ExUI adds the simplified `Select` wrapper: it requires `options` and reports the selected string through `onChange`. Its `className`, `size` and `glass` style the trigger only. The adapted `SelectField` exposes the Radix root for custom groups, items or a Glass popup; this root uses `onValueChange`. The popup opts into Glass separately on `SelectContent`.

```tsx verify
import { Select, SelectContent, SelectField, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@exre/exui"

export function SelectChoices() {
  return <div>
    <Select options={[{ value: "design", label: "Design" }, { value: "build", label: "Build" }]} onChange={(value) => console.log(value)} placeholder="Team" glass />
    <SelectField defaultValue="design" onValueChange={(value) => console.log(value)}>
      <SelectTrigger glass><SelectValue placeholder="Team" /></SelectTrigger>
      <SelectContent glass><SelectGroup><SelectItem value="design">Design</SelectItem></SelectGroup></SelectContent>
    </SelectField>
  </div>
}
```
