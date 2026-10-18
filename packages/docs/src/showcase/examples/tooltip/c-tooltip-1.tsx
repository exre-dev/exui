
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-fit">
              {<ExampleText>Show Tooltip </ExampleText>}</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{<ExampleText>Add to library</ExampleText>}</p>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
