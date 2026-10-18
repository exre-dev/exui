
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>Open Popover </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="px-3 py-2">
          <PopoverHeader>
            <PopoverTitle>{<ExampleText>Dimensions</ExampleText>}</PopoverTitle>
            <PopoverDescription>
              {<ExampleText>Set the dimensions for the layer. </ExampleText>}</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
