
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

const frontend = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
]

const backend = [
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
]



  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select a framework")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>{<ExampleText>Frontend</ExampleText>}</SelectLabel>
            {<ExampleText>{frontend.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {<ExampleText>{item.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{<ExampleText>Backend</ExampleText>}</SelectLabel>
            {<ExampleText>{backend.map((item) => (
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
