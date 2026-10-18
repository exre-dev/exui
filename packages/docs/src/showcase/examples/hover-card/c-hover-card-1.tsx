
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

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
          <Button variant="outline">{<ExampleText>Hover Me</ExampleText>}</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex flex-col gap-1">
            <h4 className="leading-none font-medium">{<ExampleText>Hover Card</ExampleText>}</h4>
            <p className="text-muted-foreground">
              {<ExampleText>A basic hover card that appears when you hover over the trigger. </ExampleText>}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
