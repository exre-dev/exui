"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useRef } from "react"
import { Scrollspy } from "@exre/exui"

import { Button } from "@exre/exui"
import { ScrollArea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()
  const parentRef = useRef<HTMLDivElement | null>(null)

  const nav = [
    {
      id: "section-1",
      label: "Section 1",
    },
    {
      id: "section-2",
      label: "Section 2",
    },
    {
      id: "section-3",
      label: "Section 3",
    },
    {
      id: "section-4",
      label: "Section 4",
    },
    {
      id: "section-5",
      label: "Section 5",
    },
  ]

  return (
    <div className="flex w-full grow gap-5">
      <div className="flex w-[150px] flex-col gap-2">
        <Scrollspy
          offset={50}
          targetRef={parentRef}
          className="flex flex-col gap-2.5"
        >
          {<ExampleText>{nav.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              data-scrollspy-anchor={exampleId(item.id)}
              className={
                "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              }
            >
              {<ExampleText>{item.label}</ExampleText>}
            </Button>
          ))}</ExampleText>}
        </Scrollspy>
      </div>
      <div className="grow" ref={parentRef}>
        <ScrollArea className="-me-5 h-[500px] grow pe-5">
          <div className="space-y-8">
            {<ExampleText>{nav.map((item) => (
              <ExampleRuntimeConsumer key={item.id} render={({id: exampleId}) => (<div key={item.id} id={exampleId(item.id)} className="space-y-2.5">
                <h3 className="text-foreground text-base">{<ExampleText>{item.label}</ExampleText>}</h3>
                <div className="bg-muted rounded-2xl h-[350px]"></div>
              </div>)} />
            ))}</ExampleText>}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
