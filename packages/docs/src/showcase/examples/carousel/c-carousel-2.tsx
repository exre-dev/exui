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
    <div className="flex w-full items-center justify-center p-6">
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[325px]">
          {<ExampleText>{Array.from({ length: 5 }).map((_, index) => (
            <ExampleRuntimeConsumer key={index} render={({format: formatExample}) => (<CarouselItem key={index} className="basis-1/2 pt-1">
              <div className="p-1">
                <Card className="relative h-[145px] overflow-hidden border-0 p-0">
                  <img
                    src={exampleAsset(`https://picsum.photos/600/300?grayscale&random=${index + 10}`)}
                    alt={(formatExample("Slide {number}", { number: index + 1 }))}
                    width={600}
                    height={300}
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
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
