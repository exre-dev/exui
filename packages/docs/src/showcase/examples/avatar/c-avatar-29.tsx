
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <>
      <div className="flex gap-2">
        <AvatarGroup>
          <Avatar>
            <AvatarImage src="/examples/reui/photos/f51fb1d8b3e4cbbd47.png" alt={copyExample("@leerob")} />
            <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/96b8bd25ab6ed38fc5.png"
              alt={copyExample("@maxleiter")}
            />
            <AvatarFallback>{<ExampleText>LR</ExampleText>}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
              alt={copyExample("emma@example.com")}
            />
            <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full" aria-label={copyExample("Add user")}>
              <PlusIcon aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{<ExampleText>Add user</ExampleText>}</TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
