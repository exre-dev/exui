
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Input } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const filterItems = [
  { label: "Filter", value: null },
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex w-full max-w-xs items-center gap-2">
      <Input placeholder={copyExample("Search...")} className="flex-1" />
      <Select>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={copyExample("Filter")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{filterItems.map((item) => (
              <SelectItem key={item.value} value={item.value as string}>
                {<ExampleText>{item.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
