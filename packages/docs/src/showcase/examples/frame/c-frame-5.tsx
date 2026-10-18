
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
    <Frame className="w-full" stacked>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger className="w-full">
          <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
            <FrameTitle>{<ExampleText>Start</ExampleText>}</FrameTitle>
            <ChevronRightIcon className="text-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </FrameHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FramePanel>
            <p className="text-muted-foreground text-sm">
              {<ExampleText>Initialize run to answer a user question using uploaded files and the knowledge base; cite sources when relevant. </ExampleText>}</p>
          </FramePanel>
        </CollapsibleContent>
      </Collapsible>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
