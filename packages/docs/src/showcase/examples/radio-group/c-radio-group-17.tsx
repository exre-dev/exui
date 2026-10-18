
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

const plans = [
  {
    value: "free",
    title: "Free",
    price: "$0",
    description: "For personal projects and experiments.",
  },
  {
    value: "pro",
    title: "Pro",
    price: "$19",
    description: "For professionals and small teams.",
  },
  {
    value: "enterprise",
    title: "Enterprise",
    price: "$49",
    description: "For organizations with advanced needs.",
  },
]

  function OriginalPattern() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-xs">
      {<ExampleText>{plans.map((plan) => (
        <ExampleRuntimeConsumer key={plan.value} render={({id: exampleId}) => (<FieldLabel key={plan.value} htmlFor={exampleId(plan.value)}>
          <Field orientation="horizontal">
            <RadioGroupItem value={plan.value} id={exampleId(plan.value)} />
            <FieldContent>
              <FieldTitle className="flex items-center justify-between">
                <span>{<ExampleText>{plan.title}</ExampleText>}</span>
                <span className="text-sm font-semibold">{<ExampleText>{plan.price}</ExampleText>}{<ExampleText>/mo</ExampleText>}</span>
              </FieldTitle>
              <FieldDescription>{<ExampleText>{plan.description}</ExampleText>}</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>)} />
      ))}</ExampleText>}
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
