
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChartNoAxesColumnDecreasingIcon, CircleDollarSignIcon, CreditCardIcon, FileTextIcon } from "lucide-react"

import { Field, FieldLabel, FieldTitle } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"


const items = [
  {
    title: "Payments",
    description: "Receive payments from your customers",
    value: "payments",
    icon: (
      <CircleDollarSignIcon aria-hidden="true" className="size-4" />
    ),
  },
  {
    title: "Invoices",
    description: "Create and send invoices to your customers",
    value: "invoices",
    icon: (
      <FileTextIcon aria-hidden="true" className="size-4" />
    ),
  },
  {
    title: "Billing",
    description: "Manage your billing and subscriptions",
    value: "billing",
    icon: (
      <CreditCardIcon aria-hidden="true" className="size-4" />
    ),
  },
  {
    title: "Reports",
    description: "View your reports and analytics",
    value: "reports",
    icon: (
      <ChartNoAxesColumnDecreasingIcon aria-hidden="true" className="size-4" />
    ),
  },
]

  function OriginalPattern() {
  return (
    <RadioGroup
      defaultValue="payments"
      className="grid w-full max-w-xs grid-cols-2 gap-4"
    >
      {<ExampleText>{items.map((item) => (
        <ExampleRuntimeConsumer key={item.value} render={({id: exampleId}) => (<FieldLabel
          key={item.value}
          htmlFor={exampleId(item.value)}
          className="relative p-0!"
        >
          <Field orientation="horizontal">
            <div className="absolute top-3 right-3">
              <RadioGroupItem value={item.value} id={exampleId(item.value)} />
            </div>
            <FieldTitle className="flex flex-col items-start">
              <div className="bg-background border-border rounded-2xl flex shrink-0 items-center justify-center border p-2 shadow-xs shadow-black/5">
                {<ExampleText>{item.icon}</ExampleText>}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold">{<ExampleText>{item.title}</ExampleText>}</span>
                <span className="text-muted-foreground text-xs">
                  {<ExampleText>{item.description}</ExampleText>}
                </span>
              </div>
            </FieldTitle>
          </Field>
        </FieldLabel>)} />
      ))}</ExampleText>}
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
