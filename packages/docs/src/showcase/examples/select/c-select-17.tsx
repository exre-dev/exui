
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { cn } from "@exre/exui"
import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const statuses = [
  { value: "1", label: "In Progress", color: "bg-violet-500" },
  { value: "2", label: "Completed", color: "bg-green-500" },
  { value: "3", label: "Pending", color: "bg-primary" },
  { value: "4", label: "Cancelled", color: "bg-yellow-500" },
  { value: "5", label: "Rejected", color: "bg-destructive" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={statuses[1].value}>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select status")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className="flex items-center gap-2">
                  <span className={cn("size-1.5 rounded-full", status.color)} />
                  <span>{<ExampleText>{status.label}</ExampleText>}</span>
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
