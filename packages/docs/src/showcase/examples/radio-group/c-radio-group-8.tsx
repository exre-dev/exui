
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card } from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"
import { Separator } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs p-0">
      <RadioGroup defaultValue="standard">
        <FieldGroup className="gap-0">
          <Field>
            <FieldLabel className="px-4 py-3">
              <RadioGroupItem value="standard" id={exampleId("ship-standard")} />
              <FieldTitle>{<ExampleText>Standard Shipping</ExampleText>}</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="px-4 py-3">
              <RadioGroupItem value="express" id={exampleId("ship-express")} />
              <FieldTitle>{<ExampleText>Express Shipping</ExampleText>}</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="px-4 py-3">
              <RadioGroupItem value="overnight" id={exampleId("ship-overnight")} />
              <FieldTitle>{<ExampleText>Overnight Shipping</ExampleText>}</FieldTitle>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </RadioGroup>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
