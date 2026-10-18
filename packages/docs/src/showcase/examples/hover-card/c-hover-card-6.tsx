
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Open Dialog</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{<ExampleText>Hover Card Example</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Hover over the button below to see the hover card. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="outline" className="w-fit">
                {<ExampleText>Hover me </ExampleText>}</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col gap-1">
                <h4 className="font-medium">{<ExampleText>Hover Card</ExampleText>}</h4>
                <p className="text-muted-foreground">
                  {<ExampleText>This hover card appears inside a dialog. Hover over the button to see it. </ExampleText>}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
