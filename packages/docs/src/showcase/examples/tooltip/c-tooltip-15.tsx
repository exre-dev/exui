
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TagIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <div className="flex items-center gap-1.5 text-sm">
              <TagIcon className="size-3.5" aria-hidden="true" />
              {<ExampleText>3 labels </ExampleText>}</div>
          </TooltipTrigger>
          <TooltipContent className="p-3">
            <div className="flex flex-col gap-2">
              <span className="font-medium">{<ExampleText>Labels</ExampleText>}</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="destructive" size="xs">
                  {<ExampleText>Bug </ExampleText>}</Badge>
                <Badge variant="info" size="xs">
                  {<ExampleText>Frontend </ExampleText>}</Badge>
                <Badge variant="warning" size="xs">
                  {<ExampleText>High Priority </ExampleText>}</Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
