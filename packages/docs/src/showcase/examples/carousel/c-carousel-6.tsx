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
        align: "center",
        loop: true,
      }}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {<ExampleText>{Array.from({ length: 5 }).map((_, index) => (
          <ExampleRuntimeConsumer key={index} render={({format: formatExample}) => (<CarouselItem key={index} className="basis-[70%]">
            <div className="p-1">
              <Card className="relative aspect-video overflow-hidden border-0 p-0">
                <img
                  src={exampleAsset(`https://picsum.photos/800/450?grayscale&random=${index + 30}`)}
                  alt={(formatExample("Slide {number}", { number: index + 1 }))}
                  width={800}
                  height={450}
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
