
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BadgeCheckIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <p className="text-sm">
          {<ExampleText>Verified domain</ExampleText>}{<ExampleText>{" "}</ExampleText>}
          <Tooltip>
            <TooltipTrigger className="text-muted-foreground align-middle" aria-label={copyExample("Verified domain")}>
              <BadgeCheckIcon className="size-4 text-emerald-600" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  {<ExampleText>Verified </ExampleText>}</Badge>
                <p>{<ExampleText>Domain ownership has been confirmed.</ExampleText>}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </p>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
