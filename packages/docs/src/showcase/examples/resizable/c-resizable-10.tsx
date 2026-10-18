"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const [sizes, setSizes] = useState<Record<string, number>>({
    left: 30,
    right: 70,
  })

  return (
    <div className="mx-auto w-full max-w-lg">
      <ResizablePanelGroup
        orientation="horizontal"
        className="rounded-2xl min-h-[200px] border"
        onLayoutChange={(layout) => {
          setSizes(layout)
        }}
      >
        <ResizablePanel id={exampleId("left")} defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="text-sm font-semibold">
              {<ExampleText>{Math.round(sizes.left ?? 30)}</ExampleText>}%
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id={exampleId("right")} defaultSize={70} minSize={30}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="text-sm font-semibold">
              {<ExampleText>{Math.round(sizes.right ?? 70)}</ExampleText>}%
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
