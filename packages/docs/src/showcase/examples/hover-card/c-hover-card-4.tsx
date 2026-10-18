
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ZapIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline">{<ExampleText>Instant Deployment</ExampleText>}</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-3">
          <div className="flex gap-2">
            <ZapIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="font-medium">{<ExampleText>Zero Latency Edge</ExampleText>}</p>
              <p className="text-muted-foreground leading-relaxed">
                {<ExampleText>Deploy your applications across our global edge network in seconds. </ExampleText>}</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
