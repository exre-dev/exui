
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card } from "@exre/exui"
import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <FieldGroup className="gap-0">
        <Field>
          <FieldLabel className="px-4 py-3">
            <Checkbox defaultChecked />
            <FieldTitle>{<ExampleText>Push notifications</ExampleText>}</FieldTitle>
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="px-4 py-3">
            <Checkbox />
            <FieldTitle>{<ExampleText>Email notifications</ExampleText>}</FieldTitle>
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="px-4 py-3">
            <Checkbox />
            <FieldTitle>{<ExampleText>SMS notifications</ExampleText>}</FieldTitle>
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
