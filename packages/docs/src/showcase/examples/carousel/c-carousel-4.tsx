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
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-3xl"
    >
      <CarouselContent>
        {<ExampleText>{Array.from({ length: 8 }).map((_, index) => (
          <ExampleRuntimeConsumer key={index} render={({format: formatExample}) => (<CarouselItem
            key={index}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <Card className="relative aspect-3/4 overflow-hidden border-0 p-0">
                <img
                  src={exampleAsset(`https://picsum.photos/600/800?grayscale&random=${index + 15}`)}
                  alt={(formatExample("Slide {number}", { number: index + 1 }))}
                  width={600}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </Card>
            </div>
          </CarouselItem>)} />
        ))}</ExampleText>}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:inline-flex" />
      <CarouselNext className="hidden sm:inline-flex" />
    </Carousel>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
