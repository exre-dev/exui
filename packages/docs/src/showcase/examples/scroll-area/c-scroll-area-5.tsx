import exampleAsset from "./assets.generated"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { ScrollArea } from "@exre/exui"

  function OriginalPattern() {
  return (
    <ScrollArea className="rounded-2xl h-72 w-56 border data-has-overflow-x:py-2.5 data-has-overflow-y:px-2.5">
      <div className="flex w-full flex-col items-center gap-4 py-2">
        {<ExampleText>{Array.from({ length: 10 }).map((_, i) => (
          <ExampleRuntimeConsumer key={i} render={({format: formatExample}) => (<div
            key={i}
            className="rounded-2xl relative h-36 w-full shrink-0 overflow-hidden border"
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
