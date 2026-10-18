
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const priorities = [
  { value: "none", label: "No Priority", variant: "outline" as const },
  { value: "urgent", label: "Urgent", variant: "destructive" as const },
  { value: "high", label: "High", variant: "warning" as const },
  { value: "medium", label: "Medium", variant: "warning-light" as const },
  { value: "low", label: "Low", variant: "info" as const },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={priorities[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={copyExample("Select priority")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                <span className="flex items-center gap-2">
                  <Badge variant={priority.variant} size="sm">
                    {<ExampleText>{priority.label}</ExampleText>}
                  </Badge>
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
