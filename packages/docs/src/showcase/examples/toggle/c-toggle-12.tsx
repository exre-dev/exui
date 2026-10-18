
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PinIcon } from "lucide-react"

import { Toggle } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle variant="outline" aria-label={copyExample("Pin to sidebar")}>
              <PinIcon  />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{<ExampleText>Pin to sidebar</ExampleText>}</p>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
