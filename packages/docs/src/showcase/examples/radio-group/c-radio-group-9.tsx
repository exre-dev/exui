
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MailIcon, MessageCircleIcon, SmartphoneIcon } from "lucide-react"

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
      <RadioGroup defaultValue="email">
        <FieldGroup className="gap-0">
          <Field>
            <FieldLabel className="justify-between px-4 py-3">
              <FieldTitle className="flex items-center gap-2">
                <MailIcon aria-hidden="true" className="size-4 opacity-60" />
                {<ExampleText>Email </ExampleText>}</FieldTitle>
              <RadioGroupItem value="email" id={exampleId("contact-email")} />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="justify-between px-4 py-3">
              <FieldTitle className="flex items-center gap-2">
                <SmartphoneIcon aria-hidden="true" className="size-4 opacity-60" />
                {<ExampleText>Phone </ExampleText>}</FieldTitle>
              <RadioGroupItem value="phone" id={exampleId("contact-phone")} />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="justify-between px-4 py-3">
              <FieldTitle className="flex items-center gap-2">
                <MessageCircleIcon aria-hidden="true" className="size-4 opacity-60" />
                {<ExampleText>Chat </ExampleText>}</FieldTitle>
              <RadioGroupItem value="chat" id={exampleId("contact-chat")} />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </RadioGroup>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
