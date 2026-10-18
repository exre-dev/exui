
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger className="relative cursor-pointer">
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/e93553df2422635515.jpg"
                alt={copyExample("James Davis")}
              />
              <AvatarFallback>{<ExampleText>JD</ExampleText>}</AvatarFallback>
            </Avatar>
            <span className="border-background absolute right-0 bottom-0 block size-3 rounded-full border-2 bg-green-500" />
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/e93553df2422635515.jpg"
                alt={copyExample("James Davis")}
              />
              <AvatarFallback>{<ExampleText>JD</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{<ExampleText>James Davis</ExampleText>}</span>
              <div className="flex items-center gap-1.5 opacity-80">
                <span className="block size-1.5 shrink-0 rounded-full bg-green-500" />
                {<ExampleText>Online now </ExampleText>}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
