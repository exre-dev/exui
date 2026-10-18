
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@exre/exui"

const sides = ["top", "right", "bottom", "left"] as const

  function OriginalPattern() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {<ExampleText>{sides.map((side) => (
        <HoverCard key={side} openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="flex-1 capitalize">
              {<ExampleText>{side.replace("-", " ")}</ExampleText>}
            </Button>
          </HoverCardTrigger>

          <HoverCardContent side={side}>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">{<ExampleText>Hover Card</ExampleText>}</h4>
              <p className="text-muted-foreground">
                {<ExampleText>This hover card appears on the </ExampleText>}{<ExampleText>{side.replace("-", " ")}</ExampleText>} {<ExampleText> side of the trigger. </ExampleText>}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
