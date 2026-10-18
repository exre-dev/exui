
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <RadioGroup defaultValue="stable" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="stable" id={exampleId("ch-stable")} />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor={exampleId("ch-stable")}>{<ExampleText>Stable</ExampleText>}</FieldLabel>
          <Badge
            variant="secondary"
            className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase"
          >
            {<ExampleText>Recommended </ExampleText>}</Badge>
        </div>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="beta" id={exampleId("ch-beta")} />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor={exampleId("ch-beta")}>{<ExampleText>Beta</ExampleText>}</FieldLabel>
          <Badge className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase">
            {<ExampleText>New </ExampleText>}</Badge>
        </div>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="canary" id={exampleId("ch-canary")} />
        <FieldLabel htmlFor={exampleId("ch-canary")}>{<ExampleText>Canary</ExampleText>}</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
