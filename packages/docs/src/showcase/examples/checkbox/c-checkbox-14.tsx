
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChartNoAxesColumnDecreasingIcon, CircleDollarSignIcon, CreditCardIcon, FileTextIcon } from "lucide-react"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"


const items = [
  {
    title: "Payments",
    description: "Receive payments from your customers",
    icon: (
      <CircleDollarSignIcon aria-hidden="true" className="size-4" />
    ),
    checked: true,
  },
  {
    title: "Invoices",
    description: "Create and send invoices to your customers",
    icon: (
      <FileTextIcon aria-hidden="true" className="size-4" />
    ),
    checked: false,
  },
  {
    title: "Billing",
    description: "Manage your billing and subscriptions",
    icon: (
      <CreditCardIcon aria-hidden="true" className="size-4" />
    ),
    checked: false,
  },
  {
    title: "Reports",
    description: "View your reports and analytics",
    icon: (
      <ChartNoAxesColumnDecreasingIcon aria-hidden="true" className="size-4" />
    ),
    checked: false,
  },
]

  function OriginalPattern() {
  return (
    <FieldGroup className="grid w-full max-w-xs grid-cols-2 gap-4">
      {<ExampleText>{items.map((item) => (
        <FieldLabel key={item.title} className="relative p-0">
          <Field orientation="horizontal">
            <Checkbox
              defaultChecked={item.checked}
              className="absolute top-3 right-3 size-5 rounded-full"
            />
            <FieldTitle className="flex flex-col items-start">
              <div className="bg-background border-border rounded-2xl flex shrink-0 items-center justify-center border p-2 shadow-xs shadow-black/5">
                {<ExampleText>{item.icon}</ExampleText>}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold"> {<ExampleText>{item.title}</ExampleText>} </span>
                <span className="text-muted-foreground text-xs">
                  {<ExampleText>{" "}</ExampleText>}
                  {<ExampleText>{item.description}</ExampleText>}{<ExampleText>{" "}</ExampleText>}
                </span>
              </div>
            </FieldTitle>
          </Field>
        </FieldLabel>
      ))}</ExampleText>}
    </FieldGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
