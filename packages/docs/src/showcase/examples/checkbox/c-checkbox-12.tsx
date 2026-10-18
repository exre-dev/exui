
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LaptopIcon, MailIcon, SmartphoneIcon } from "lucide-react"

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
          <FieldLabel className="justify-between px-4 py-3">
            <FieldTitle className="flex items-center gap-2">
              <LaptopIcon aria-hidden="true" className="size-4 opacity-60" />
              {<ExampleText>Push notifications </ExampleText>}</FieldTitle>
            <Checkbox defaultChecked />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="justify-between px-4 py-3">
            <FieldTitle className="flex items-center gap-2">
              <MailIcon aria-hidden="true" className="size-4 opacity-60" />
              {<ExampleText>Email notifications </ExampleText>}</FieldTitle>
            <Checkbox />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="justify-between px-4 py-3">
            <FieldTitle className="flex items-center gap-2">
              <SmartphoneIcon aria-hidden="true" className="size-4 opacity-60" />
              {<ExampleText>SMS notifications </ExampleText>}</FieldTitle>
            <Checkbox />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
