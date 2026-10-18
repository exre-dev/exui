
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ExternalLinkIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {<ExampleText>Preview Media </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] gap-0 overflow-hidden p-0"
          align="end"
        >
          <div className="bg-muted aspect-video w-full overflow-hidden">
            <img
              src="/examples/reui/photos/02fd966f2fc821b4ca.jpg"
              alt={copyExample("Website Template Preview")}
              width={320}
              height={180}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="space-y-3 p-2">
            <div className="space-y-1 pt-1">
              <h4 className="text-sm leading-none font-semibold">
                {<ExampleText>Portfolio Pro </ExampleText>}</h4>
              <p className="text-muted-foreground text-xs">
                {<ExampleText>Premium photography template with dark mode. </ExampleText>}</p>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Button size="sm" className="flex-1">
                {<ExampleText>Install Template </ExampleText>}</Button>
              <Button
                size="sm"
                variant="outline"
                aria-label={copyExample("View demo in new tab")}
              >
                {<ExampleText>Learn more </ExampleText>}<ExternalLinkIcon  />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
