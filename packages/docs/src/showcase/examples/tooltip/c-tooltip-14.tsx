
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <div className="flex items-center gap-1">
              <FileTextIcon className="size-4" aria-hidden="true" />
              <span className="text-sm">{<ExampleText>report-q4.pdf</ExampleText>}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted rounded-md flex size-8 shrink-0 items-center justify-center">
                  <FileTextIcon className="text-muted-foreground size-4" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{<ExampleText>report-q4.pdf</ExampleText>}</span>
                  <span className="opacity-80">
                    {<ExampleText>2.4 MB · Uploaded 3 days ago </ExampleText>}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="info" size="xs">
                  {<ExampleText>PDF </ExampleText>}</Badge>
                <Badge variant="success" size="xs">
                  {<ExampleText>Verified </ExampleText>}</Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
