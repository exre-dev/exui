import exampleAsset from "./assets.generated"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { cn } from "@exre/exui"
import { ScrollArea } from "@exre/exui"

  function OriginalPattern() {
  return (
    <ScrollArea
      className={cn(
        "rounded-2xl h-72 w-48 border",
        "**:data-[slot=scroll-area-thumb]:bg-foreground/15 **:data-[slot=scroll-area-thumb]:rounded-full",
        "**:data-[slot=scroll-area-viewport]:mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))]",
        "**:data-[slot=scroll-area-viewport]:mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))]",
        "**:data-[slot=scroll-area-viewport]:mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))]",
        "**:data-[slot=scroll-area-viewport]:mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))]",
        "**:data-[slot=scroll-area-viewport]:[--fade-size:1.5rem]"
      )}
    >
      <div className="flex w-max flex-col gap-4 p-4">
        {<ExampleText>{Array.from({ length: 10 }).map((_, i) => (
          <ExampleRuntimeConsumer key={i} render={({format: formatExample}) => (<div
            key={i}
            className="rounded-2xl relative h-36 w-40 shrink-0 overflow-hidden border"
          >
            <img
              src={exampleAsset(`https://picsum.photos/400/300?random=${i + 1}`)}
              alt={(formatExample("Image {number}", { number: i + 1 }))}
              className="h-full w-full object-cover"
            />
          </div>)} />
        ))}</ExampleText>}
      </div>
    </ScrollArea>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
