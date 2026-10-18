"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@exre/exui"


const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"]

const icons = {
  prev: (
    <ChevronLeftIcon aria-hidden="true" />
  ),
  next: (
    <ChevronRightIcon aria-hidden="true" />
  ),
  chevronsUpDown: (
    <ChevronsUpDownIcon aria-hidden="true" className="size-3.5 shrink-0 opacity-50" />
  ),
  check: (
    <CheckIcon aria-hidden="true" className="text-primary ml-auto size-3.5" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [stageIndex, setStageIndex] = useState(2)

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        aria-label={copyExample("Previous stage")}
        disabled={stageIndex === 0}
        onClick={() => setStageIndex((i) => i - 1)}
      >
        {<ExampleText>{icons.prev}</ExampleText>}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-36 justify-between">
            <span className="truncate">{<ExampleText>{stages[stageIndex]}</ExampleText>}</span>
            {<ExampleText>{icons.chevronsUpDown}</ExampleText>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Jump to stage</ExampleText>}</DropdownMenuLabel>
            {<ExampleText>{stages.map((stage, i) => (
              <DropdownMenuItem key={stage} onClick={() => setStageIndex(i)}>
                {<ExampleText>{stage}</ExampleText>}
                {<ExampleText>{i === stageIndex ? icons.check : null}</ExampleText>}
              </DropdownMenuItem>
            ))}</ExampleText>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        aria-label={copyExample("Next stage")}
        disabled={stageIndex === stages.length - 1}
        onClick={() => setStageIndex((i) => i + 1)}
      >
        {<ExampleText>{icons.next}</ExampleText>}
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
