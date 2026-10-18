
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@exre/exui"

const sides = ["top", "right", "bottom", "left"] as const

  function OriginalPattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {<ExampleText>{sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {<ExampleText>{side}</ExampleText>}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={side}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <SheetTitle>{<ExampleText>Sheet Side: </ExampleText>}{<ExampleText>{side}</ExampleText>}</SheetTitle>
              <SheetDescription>
                {<ExampleText>This sheet opens from the </ExampleText>}{<ExampleText>{side}</ExampleText>} {<ExampleText> side of the screen. </ExampleText>}</SheetDescription>
            </SheetHeader>
            <div className="text-muted-foreground p-4 text-sm">
              {<ExampleText>{Array.from({ length: 5 }).map((_, i) => (
                <p key={i} className="mb-2">
                  {<ExampleText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </ExampleText>}</p>
              ))}</ExampleText>}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">{<ExampleText>Close</ExampleText>}</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
