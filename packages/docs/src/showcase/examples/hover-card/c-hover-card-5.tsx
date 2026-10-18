
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline">{<ExampleText>View Image</ExampleText>}</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px] overflow-hidden p-0">
          <img
            src="/examples/reui/photos/b7c3c9f06c82916658.jpg"
            alt={copyExample("Card Image")}
            className="aspect-video w-full object-cover"
          />
          <div className="space-y-1 p-3">
            <p className="font-medium">{<ExampleText>Image Overview</ExampleText>}</p>
            <p className="text-muted-foreground leading-relaxed">
              {<ExampleText>Visual overview of generated landing page. </ExampleText>}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
