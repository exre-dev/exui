
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon, ClockIcon, MapPinIcon, MessageSquareIcon } from "lucide-react"

import {
  Frame,
  FrameHeader,
  FramePanel,
} from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="h-54 w-full max-w-xs">
      <Frame stacked dense spacing="sm" className="w-full">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full">
            <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="relative size-5">
                  <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("User")} />
                  <AvatarFallback>{<ExampleText>JD</ExampleText>}</AvatarFallback>
                </Avatar>
                <span className="text-foreground text-sm font-medium">
                  {<ExampleText>@shadcn </ExampleText>}</span>
              </div>
              <ChevronRightIcon aria-hidden="true" className="text-muted-foreground size-4 transition-transform in-aria-expanded:rotate-90" />
            </FrameHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <FramePanel>
              {/* User profile information */}
              <div className="space-y-2.5">
                {/* Last activity */}
                <div className="flex items-center gap-2">
                  <MessageSquareIcon aria-hidden="true" className="text-muted-foreground size-3.5" />
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>Last activity: </ExampleText>}</span>
                  <span className="text-foreground text-xs font-medium">
                    {<ExampleText>2 hours ago </ExampleText>}</span>
                </div>
                {/* Online since */}
                <div className="flex items-center gap-2">
                  <ClockIcon aria-hidden="true" className="text-muted-foreground size-3.5" />
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>Online since: </ExampleText>}</span>
                  <span className="text-foreground text-xs font-medium">
                    {<ExampleText>Today, 9:00 AM </ExampleText>}</span>
                </div>
                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPinIcon aria-hidden="true" className="text-muted-foreground size-3.5" />
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>Location: </ExampleText>}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground text-xs font-medium">
                      {<ExampleText>Canada </ExampleText>}</span>
                    <img
                      src={`https://flagcdn.com/ca.svg`}
                      alt={copyExample("Canada")}
                      className="size-4 shrink-0 rounded-full border object-cover"
                    />
                  </div>
                </div>
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
