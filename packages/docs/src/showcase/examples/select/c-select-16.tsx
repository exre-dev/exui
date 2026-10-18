
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

const accessLevels = [
  {
    value: "full_access",
    label: "Full access",
    description: "Can modify list access",
  },
  {
    value: "read_write",
    label: "Read and write",
    description: "Can edit & publish lists",
  },
  {
    value: "read_only",
    label: "Read only",
    description: "Can only view lists",
  },
  {
    value: "no_access",
    label: "No access",
    description: "Cannot view or edit lists",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={accessLevels[1].value}>
        <SelectTrigger className="w-[240px] [&_small]:hidden">
          <SelectValue placeholder={copyExample("Select access level")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{accessLevels.map((level) => (
              <SelectItem
                key={level.value}
                value={level.value}
                className="[&_svg]:text-primary"
              >
                <span className="flex flex-col items-start gap-px">
                  <span className="font-medium">{<ExampleText>{level.label}</ExampleText>}</span>
                  <small className="text-muted-foreground text-xs">
                    {<ExampleText>{level.description}</ExampleText>}
                  </small>
                </span>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
