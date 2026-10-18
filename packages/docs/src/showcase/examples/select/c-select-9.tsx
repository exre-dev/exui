
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldError, FieldLabel } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
]

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor={exampleId("select-fruit-invalid")}>{<ExampleText>Favorite Fruit</ExampleText>}</FieldLabel>
      <Select>
        <SelectTrigger id={exampleId("select-fruit-invalid")} aria-invalid>
          <SelectValue placeholder={copyExample("Select a fruit")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{items.map((item) => (
              <SelectItem key={item.value} value={item.value as string}>
                {<ExampleText>{item.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError errors={[{ message: "Please select a valid fruit." }]} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
