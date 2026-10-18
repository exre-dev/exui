"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Settings2Icon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="h-54 w-full max-w-xs">
      <Card size="sm">
        <CardHeader>
          <CardTitle>{<ExampleText>Unit Pricing</ExampleText>}</CardTitle>
        </CardHeader>
        <CardContent>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex flex-col"
          >
            <div className="flex items-end gap-2">
              <Field className="flex-1">
                <FieldLabel className="sr-only">{<ExampleText>Base Price</ExampleText>}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    placeholder={copyExample("0.00")}
                    defaultValue="19.00"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <CollapsibleTrigger asChild>
                <Button aria-label={copyExample("Settings")} variant="outline" size="icon" className="shrink-0">
                  <Settings2Icon aria-hidden="true" className="size-3.5" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down -mx-1 -mb-1 overflow-hidden px-1 pb-1 motion-reduce:animate-none">
              <FieldGroup className="gap-2 pt-3">
                <Field>
                  <FieldLabel>{<ExampleText>Tax Rate (%)</ExampleText>}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder={copyExample("0")}
                      defaultValue="15"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>{<ExampleText>Discount (%)</ExampleText>}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder={copyExample("0")}
                      defaultValue="0"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
