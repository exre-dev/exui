
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const items = Array.from({ length: 100 }).map((_, i) => ({
  label: `Item ${i}`,
  value: `item-${i}`,
}))

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select an item")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {<ExampleText>{items.map((item, index) => (
              <SelectItem key={item.value} value={item.value}>
                {<ExampleText><>{formatExample("Item {number}", { number: index })}</></ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
