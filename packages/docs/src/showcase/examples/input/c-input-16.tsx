
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HelpCircleIcon } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import { Input } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor={exampleId("username")}>{<ExampleText>Username</ExampleText>}</FieldLabel>
        <>
          <Tooltip>
            <TooltipTrigger aria-label={copyExample("Username help")} className="inline-flex items-center">
              <HelpCircleIcon className="text-muted-foreground size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              {<ExampleText>Your unique identifier on the platform. </ExampleText>}</TooltipContent>
          </Tooltip>
        </>
      </div>
      <Input id={exampleId("username")} placeholder={copyExample("johndoe")} />
      <FieldDescription>
        {<ExampleText>Your unique identifier on the platform. </ExampleText>}</FieldDescription>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
