
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { ScrollArea } from "@exre/exui"
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

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">{<ExampleText>Scrollable Sheet</ExampleText>}</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-0 space-y-0">
          <SheetHeader>
            <SheetTitle>{<ExampleText>Scrollable Content</ExampleText>}</SheetTitle>
            <SheetDescription>
              {<ExampleText>Description of the scrollable content. </ExampleText>}</SheetDescription>
          </SheetHeader>
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 px-4">
              {<ExampleText>{Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="text-muted-foreground text-sm">
                  {<ExampleText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. </ExampleText>}</p>
              ))}</ExampleText>}
            </div>
          </ScrollArea>
          <SheetFooter>
            <Button type="submit">{<ExampleText>Save changes</ExampleText>}</Button>
            <SheetClose asChild>
              <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
