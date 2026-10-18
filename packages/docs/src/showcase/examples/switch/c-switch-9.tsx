
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HelpCircleIcon } from "lucide-react"

import { Field, FieldLabel } from "@exre/exui"
import { Switch } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Field orientation="horizontal">
        <Switch id={exampleId("sw-tooltip")} />
        <div className="flex items-center gap-1.5">
          <FieldLabel htmlFor={exampleId("sw-tooltip")}>
            {<ExampleText>Two-factor authentication </ExampleText>}</FieldLabel>
          <>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground" aria-label={copyExample("About two-factor authentication")}>
                <HelpCircleIcon aria-hidden="true" className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {<ExampleText>Adds an extra layer of security by requiring a verification code on login. </ExampleText>}</TooltipContent>
            </Tooltip>
          </>
        </div>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
