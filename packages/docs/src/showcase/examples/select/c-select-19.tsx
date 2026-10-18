
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge, type BadgeProps } from "@exre/exui"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const statuses = [
  { value: "1", label: "In Progress", variant: "warning-outline" },
  { value: "2", label: "Completed", variant: "success-outline" },
  { value: "3", label: "Pending", variant: "info-outline" },
  { value: "4", label: "Cancelled", variant: "primary-outline" },
  { value: "5", label: "Rejected", variant: "destructive-outline" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={statuses[2].value}>
        <SelectTrigger className="w-[200px]">
          <span className="flex items-center gap-2">
            {<ExampleText>Status: </ExampleText>}<SelectValue placeholder={copyExample("Select status")} />
          </span>
        </SelectTrigger>
        <SelectContent position="popper">
          {<ExampleText>{statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <Badge variant={status.variant as BadgeProps["variant"]}>
                {<ExampleText>{status.label}</ExampleText>}
              </Badge>
            </SelectItem>
          ))}</ExampleText>}
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
