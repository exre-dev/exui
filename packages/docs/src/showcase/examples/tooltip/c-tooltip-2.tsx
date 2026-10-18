
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

const sides = ["top", "right", "bottom", "left"] as const

  function OriginalPattern() {
  return (
    <>
      <div className="grid max-w-xs grid-cols-2 gap-2">
        {<ExampleText>{sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                {<ExampleText>{side.replace("-", " ")[0].toUpperCase() +
                  side.replace("-", " ").slice(1)}</ExampleText>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p className="text-sm">{<ExampleText>Add to library</ExampleText>}</p>
            </TooltipContent>
          </Tooltip>
        ))}</ExampleText>}
      </div>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
