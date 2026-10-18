
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"

const sides = ["top", "right", "bottom", "left"] as const

  function OriginalPattern() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {<ExampleText>{sides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full capitalize">
              {<ExampleText>{side.replace("-", " ")}</ExampleText>}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-40">
            <p>{<ExampleText>Popover on </ExampleText>}{<ExampleText>{side.replace("-", " ")}</ExampleText>}</p>
          </PopoverContent>
        </Popover>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
