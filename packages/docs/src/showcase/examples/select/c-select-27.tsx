
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

const plans = [
  {
    value: "startup",
    label: "Startup",
    description: "For small teams up to 10",
  },
  {
    value: "business",
    label: "Business",
    description: "For growing companies",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Unlimited everything",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={plans[0].value}>
        <SelectTrigger className="w-[240px] [&_span.text-muted-foreground]:hidden">
          <SelectValue placeholder={copyExample("Select plan")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{plans.map((plan) => (
              <SelectItem
                key={plan.value}
                value={plan.value}
                className="[&_svg]:text-primary"
              >
                <div className="flex flex-col items-start gap-px">
                  <span className="font-medium">{<ExampleText>{plan.label}</ExampleText>}</span>
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>{plan.description}</ExampleText>}
                  </span>
                </div>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
