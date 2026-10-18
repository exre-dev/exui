
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

import { Field } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-tooltip")} className="gap-1">
        {<ExampleText>API Key </ExampleText>}<>
          <Tooltip>
            <TooltipTrigger aria-label={copyExample("API key help")} className="inline-flex items-center">
              <span className="text-muted-foreground inline-flex cursor-help">
                <InfoIcon className="size-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{<ExampleText>Your API key can be found in the developer settings.</ExampleText>}</p>
            </TooltipContent>
          </Tooltip>
        </>
      </Label>
      <Input
        id={exampleId("label-tooltip")}
        placeholder={copyExample("sk_live_...")}
        className="font-mono"
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
