import exampleAsset from "./assets.generated"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card } from "@exre/exui"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent className="-ml-1">
        {<ExampleText>{Array.from({ length: 5 }).map((_, index) => (
          <ExampleRuntimeConsumer key={index} render={({format: formatExample}) => (<CarouselItem key={index} className="basis-1/2 pl-1">
            <div className="p-1">
              <Card className="relative aspect-square overflow-hidden border-0 p-0">
                <img
                  src={exampleAsset(`https://picsum.photos/600/600?grayscale&random=${index + 35}`)}
                  alt={(formatExample("Slide {number}", { number: index + 1 }))}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </Card>
            </div>
          </CarouselItem>)} />
        ))}</ExampleText>}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
