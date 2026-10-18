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
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {<ExampleText>{Array.from({ length: 5 }).map((_, index) => (
          <ExampleRuntimeConsumer key={index} render={({format: formatExample}) => (<CarouselItem key={index}>
            <div className="p-1">
              <Card className="group/card relative aspect-video overflow-hidden border-0 p-0">
                <img
                  src={exampleAsset(`https://picsum.photos/1000/800?grayscale&random=${index + 10}`)}
                  alt={(formatExample("Slide {number}", { number: index + 1 }))}
                  width={1000}
                  height={800}
                  className="absolute inset-0 size-full scale-100 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-105"
                />
                {/* Background fade effects */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />

                {/* Content */}
                <div className="relative flex h-full flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">
                    {<ExampleText>Slide </ExampleText>}{<ExampleText>{index + 1}</ExampleText>}
                  </h3>
                  <p className="text-sm text-white/90">
                    {<ExampleText>Beautiful landscape description for slide </ExampleText>}{<ExampleText>{index + 1}</ExampleText>}.
                  </p>
                </div>
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
