
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Card } from "@exre/exui"
import { Checkbox } from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"


const settings = [
  { id: "push", label: "Push notifications", defaultChecked: true },
  { id: "email", label: "Email notifications", defaultChecked: false },
  { id: "sms", label: "SMS notifications", defaultChecked: false },
]

  function OriginalPattern() {
  return (
    <div className="h-40 w-full max-w-xs">
      <Collapsible className="flex flex-col gap-2" defaultOpen>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="bg-background! w-full justify-start"
          >
            <ChevronRightIcon aria-hidden="true" className="size-4 group-aria-expanded/button:rotate-90" />
            <span className="sr-only">{<ExampleText>Toggle notification settings</ExampleText>}</span>
            {<ExampleText>Notification settings </ExampleText>}</Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card className="p-0">
            <FieldGroup className="gap-0 divide-y">
              {<ExampleText>{settings.map((item) => (
                <Field key={item.id}>
                  <FieldLabel className="bg-transparent! px-3 py-2">
                    <Checkbox defaultChecked={item.defaultChecked} />
                    <FieldTitle>{<ExampleText>{item.label}</ExampleText>}</FieldTitle>
                  </FieldLabel>
                </Field>
              ))}</ExampleText>}
            </FieldGroup>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
