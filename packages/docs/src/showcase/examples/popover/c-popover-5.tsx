
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Open Dialog</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>{<ExampleText>Popover Example</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Click the button below to see the popover. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit">
                {<ExampleText>Open Popover </ExampleText>}</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <PopoverHeader>
                <PopoverTitle>{<ExampleText>Popover in Dialog</ExampleText>}</PopoverTitle>
                <PopoverDescription>
                  {<ExampleText>This popover appears inside a dialog. Click the button to open it. </ExampleText>}</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
