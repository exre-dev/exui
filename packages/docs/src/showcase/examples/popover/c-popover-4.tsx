
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {<ExampleText>Start </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto">
          <p>{<ExampleText>Aligned to start</ExampleText>}</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {<ExampleText>Center </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-auto">
          <p>{<ExampleText>Aligned to center</ExampleText>}</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {<ExampleText>End </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto">
          <p>{<ExampleText>Aligned to end</ExampleText>}</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
