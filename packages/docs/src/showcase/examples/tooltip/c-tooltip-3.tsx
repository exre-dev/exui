
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={copyExample("More information")}>
              <InfoIcon  />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-center text-sm">
              {<ExampleText>Additional information and help context. </ExampleText>}</p>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
