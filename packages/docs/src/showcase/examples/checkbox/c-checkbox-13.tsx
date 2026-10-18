
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <FieldGroup className="w-full max-w-xs flex-row gap-4">
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal">
          <Checkbox
            defaultChecked
            className="absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none"
          />
          <FieldTitle className="justify-center">{<ExampleText>Billings</ExampleText>}</FieldTitle>
        </Field>
      </FieldLabel>
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal" className="justify-center">
          <Checkbox className="absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none" />
          <FieldTitle className="justify-center">{<ExampleText>Payments</ExampleText>}</FieldTitle>
        </Field>
      </FieldLabel>
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal" className="justify-center">
          <Checkbox className="absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none" />
          <FieldTitle className="justify-center">{<ExampleText>Invoices</ExampleText>}</FieldTitle>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
