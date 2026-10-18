"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@exre/exui"

const verticalPillClasses =
  "before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:z-10 before:h-6 before:w-1 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/25 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.32,0.72,0,1)] hover:before:h-10 hover:before:bg-muted-foreground/40 active:before:h-12 active:before:w-1.5 active:before:bg-primary"

const horizontalPillClasses =
  "before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:z-10 before:h-1 before:w-6 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/25 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.32,0.72,0,1)] hover:before:w-10 hover:before:bg-muted-foreground/40 active:before:h-1.5 active:before:w-12 active:before:bg-primary"

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <ResizablePanelGroup
        orientation="horizontal"
        className="rounded-2xl min-h-[300px] border"
      >
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">{<ExampleText>Nav</ExampleText>}</span>
          </div>
        </ResizablePanel>
        <ResizableHandle className={verticalPillClasses} />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="text-sm font-semibold">{<ExampleText>Toolbar</ExampleText>}</span>
              </div>
            </ResizablePanel>
            <ResizableHandle className={horizontalPillClasses} />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="text-sm font-semibold">{<ExampleText>Editor</ExampleText>}</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
