
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
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
          <Button variant="outline" className="h-auto justify-start py-1.5">
            <Avatar className="size-8">
              <AvatarImage
                src="/examples/reui/photos/40ea444605145b8c33.jpg"
                alt={copyExample("Marcus Chen")}
              />
              <AvatarFallback>{<ExampleText>MC</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 text-left">
              <p className="leading-none font-medium">{<ExampleText>Marcus Chen</ExampleText>}</p>
              <p className="text-muted-foreground">{<ExampleText>@mchen_design</ExampleText>}</p>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <Avatar className="size-12">
                <AvatarImage
                  src="/examples/reui/photos/215f428abd6d940f51.jpg"
                  alt={copyExample("Marcus Chen")}
                />
                <AvatarFallback>{<ExampleText>MC</ExampleText>}</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline">
                {<ExampleText>Follow </ExampleText>}</Button>
            </div>
            <div className="space-y-1">
              <h4 className="leading-none font-semibold">{<ExampleText>Marcus Chen</ExampleText>}</h4>
              <p className="text-muted-foreground">{<ExampleText>@mchen_design</ExampleText>}</p>
            </div>
            <p className="leading-relaxed">
              {<ExampleText>Product Designer specializing in design systems. </ExampleText>}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold tabular-nums">{<ExampleText>1.2k</ExampleText>}</span>
                <span className="text-muted-foreground">{<ExampleText>Followers</ExampleText>}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold tabular-nums">482</span>
                <span className="text-muted-foreground">{<ExampleText>Following</ExampleText>}</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
