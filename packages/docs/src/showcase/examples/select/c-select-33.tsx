
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

const sizes = [
  { label: "Select a size", value: null },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra Large", value: "xl" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder={copyExample("Select a size")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{sizes.map((size) => (
              <SelectItem key={size.value} value={size.value as string}>
                {<ExampleText>{size.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
