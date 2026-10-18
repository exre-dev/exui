"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BotIcon, ChevronDownIcon, RouteIcon, WaypointsIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


const items = [
  {
    id: "Routes",
    label: "Routes",
    icon: (
      <RouteIcon aria-hidden="true" className="size-3.5 opacity-60" />
    ),
  },
  {
    id: "Paths",
    label: "Paths",
    icon: (
      <WaypointsIcon aria-hidden="true" className="size-3.5 opacity-60" />
    ),
  },
  {
    id: "Bot Name",
    label: "Bot Name",
    icon: (
      <BotIcon aria-hidden="true" className="size-3.5 opacity-60" />
    ),
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  const [active, setActive] = useState("Paths")

  return (
    <ButtonGroup>
      {<ExampleText>{items.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn(active === item.id ? "bg-muted" : "")}
          onClick={() => setActive(item.id)}
        >
          {<ExampleText>{item.icon}</ExampleText>}
          {<ExampleText>{item.label}</ExampleText>}
        </Button>
      ))}</ExampleText>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copyExample("More options")} variant="outline" size="icon">
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>{<ExampleText>Filter by Group</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Sort by Name</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Export Data</ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
