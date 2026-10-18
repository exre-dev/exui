
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HelpCircleIcon } from "lucide-react"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id={exampleId("tooltip-checkbox")} />
      <div className="flex items-center gap-1.5">
        <FieldLabel htmlFor={exampleId("tooltip-checkbox")}>
          {<ExampleText>Enable advanced analytics </ExampleText>}</FieldLabel>
        <>
          <Tooltip>
            <TooltipTrigger aria-label={copyExample("Help")} className="text-muted-foreground">
              <HelpCircleIcon aria-hidden="true" className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="right">
              {<ExampleText>Advanced analytics provides deeper insights into user behavior and system performance. </ExampleText>}</TooltipContent>
          </Tooltip>
        </>
      </div>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
