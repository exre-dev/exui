
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-fit">
              {<ExampleText>System Status </ExampleText>}</Button>
          </TooltipTrigger>
          <TooltipContent className="p-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{<ExampleText>API</ExampleText>}</span>
                <Badge variant="success" size="sm">
                  {<ExampleText>Operational </ExampleText>}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{<ExampleText>Database</ExampleText>}</span>
                <Badge variant="info" size="sm">
                  {<ExampleText>Operational </ExampleText>}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{<ExampleText>CDN</ExampleText>}</span>
                <Badge variant="warning" size="sm">
                  {<ExampleText>Degraded </ExampleText>}</Badge>
              </div>
              <p className="text-[10px] opacity-80">{<ExampleText>Updated 2 min ago</ExampleText>}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
