
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

const statuses = [
  { value: "all", label: "All Status", color: "" },
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-red-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "archived", label: "Archived", color: "bg-gray-400" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={statuses[0].value}>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select status")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className="flex items-center gap-2">
                  {<ExampleText>{status.color && (
                    <span
                      className={`size-2 shrink-0 rounded-full ${status.color}`}
                    />
                  )}</ExampleText>}
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
