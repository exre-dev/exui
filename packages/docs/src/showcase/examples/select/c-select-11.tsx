
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import { Field } from "@exre/exui"
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
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Dialog>
        <DialogTrigger asChild>
          <Button>{<ExampleText>Open Dialog</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{<ExampleText>Select Example</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Use the select below to choose a fruit. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <Select>
            <SelectTrigger className="w-full">
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
        </DialogContent>
      </Dialog>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
