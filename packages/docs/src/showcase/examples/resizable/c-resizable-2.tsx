"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <ResizablePanelGroup
        orientation="horizontal"
        className="rounded-2xl min-h-[200px] border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">{<ExampleText>Sidebar</ExampleText>}</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">{<ExampleText>Content</ExampleText>}</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
