
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
]

const vegetables = [
  { label: "Carrot", value: "carrot" },
  { label: "Broccoli", value: "broccoli" },
  { label: "Spinach", value: "spinach" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select an option")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>{<ExampleText>Fruits</ExampleText>}</SelectLabel>
            {<ExampleText>{fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {<ExampleText>{item.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{<ExampleText>Vegetables</ExampleText>}</SelectLabel>
            {<ExampleText>{vegetables.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {<ExampleText>{item.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
