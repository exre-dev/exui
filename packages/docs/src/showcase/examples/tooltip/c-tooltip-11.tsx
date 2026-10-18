
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center p-3">
      <>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
                alt={copyExample("Emma Wilson")}
              />
              <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
                alt={copyExample("Emma Wilson")}
              />
              <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{<ExampleText>Emma Wilson</ExampleText>}</span>
                <Badge variant="info" size="xs">
                  {<ExampleText>Admin </ExampleText>}</Badge>
              </div>
              <p className="opacity-80">{<ExampleText>emma@example.com</ExampleText>}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
