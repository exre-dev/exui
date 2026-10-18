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
        {<ExampleText>{Array.from({ length: 5 }).map((_, index) => (
          <ExampleRuntimeConsumer key={index} render={({format: formatExample}) => (<CarouselItem key={index} className="basis-1/3">
            <div className="p-1">
              <Card className="relative aspect-square overflow-hidden border-0 p-0">
                <img
                  src={exampleAsset(`https://picsum.photos/400/400?grayscale&random=${index + 5}`)}
                  alt={(formatExample("Slide {number}", { number: index + 1 }))}
                  width={400}
                  height={400}
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
