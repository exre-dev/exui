
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button type="button" aria-label={copyExample("Elena Soroka")} className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left" style={{ font: "inherit" }}>
            <Avatar className="size-8">
              <AvatarImage
                src="/examples/reui/photos/240c6b87e9fc32d076.jpg"
                alt={copyExample("Elena Soroka")}
              />
              <AvatarFallback>{<ExampleText>ES</ExampleText>}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium hover:underline">
                {<ExampleText>Elena Soroka </ExampleText>}</p>
              <p className="text-muted-foreground text-xs">{<ExampleText>@e.soroka</ExampleText>}</p>
            </div>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex gap-2">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src="/examples/reui/photos/240c6b87e9fc32d076.jpg"
                alt={copyExample("Elena Soroka")}
              />
              <AvatarFallback>{<ExampleText>ES</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div>
                <p className="text-sm font-medium hover:underline">
                  {<ExampleText>Elena Soroka </ExampleText>}</p>
                <p className="text-muted-foreground text-xs">{<ExampleText>@e.soroka</ExampleText>}</p>
              </div>
              <p className="text-foreground">{<ExampleText>Lead Product Designer at Vibe.</ExampleText>}</p>
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-3.5 opacity-60" />
                <span className="text-muted-foreground text-xs leading-none">
                  {<ExampleText>Joined December 2023 </ExampleText>}</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
