import exampleAsset from "./assets.generated"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { ScrollArea, ScrollBar } from "@exre/exui"

  function OriginalPattern() {
  return (
    <ScrollArea className="rounded-2xl h-auto max-w-96 border">
      <div className="flex w-max gap-4 p-4">
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
