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
        className="rounded-2xl min-h-[300px] border"
      >
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">{<ExampleText>Side</ExampleText>}</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={30}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="text-sm font-semibold">{<ExampleText>Top</ExampleText>}</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="text-sm font-semibold">{<ExampleText>Bottom</ExampleText>}</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
