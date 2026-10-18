
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon } from "lucide-react"

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="h-54 w-full max-w-xs">
      <Frame stacked dense spacing="sm" className="w-full">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full">
            <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
              <FrameTitle className="text-sm font-medium">
                {<ExampleText>Deployment successful </ExampleText>}</FrameTitle>
              <ChevronRightIcon aria-hidden="true" className="text-muted-foreground size-4 transition-transform in-aria-expanded:rotate-90" />
            </FrameHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <FramePanel>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {<ExampleText>Updated the core authentication logic and fixed a minor bug in the login flow. Improved session handling for better performance. </ExampleText>}</p>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
