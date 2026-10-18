
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowRightIcon, LockIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label={copyExample("Pro feature")}>
              <LockIcon  />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 p-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {<ExampleText>Advanced Analytics </ExampleText>}</span>
                <Badge variant="success" size="sm">
                  {<ExampleText>Pro </ExampleText>}</Badge>
              </div>
              <p className="text-xs opacity-80">
                {<ExampleText>Unlock detailed insights, custom reports, and real-time dashboards. </ExampleText>}</p>
              <Button size="sm" className="border-border/40 border">
                {<ExampleText>Upgrade to Pro </ExampleText>}<ArrowRightIcon  />
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
