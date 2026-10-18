"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, LayoutGridIcon, ListFilterIcon, ListIcon, PlusIcon } from "lucide-react"

import { useState } from "react"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [view, setView] = useState<"grid" | "list">("list")

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label={copyExample("Sort")}>
            <ListFilterIcon  />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuItem>{<ExampleText>Newest</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Oldest</ExampleText>}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{<ExampleText>Recently Updated</ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          className={cn(view === "grid" && "bg-muted")}
          onClick={() => setView("grid")}
          aria-label={copyExample("Grid view")}
        >
          <LayoutGridIcon aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(view === "list" && "bg-muted")}
          onClick={() => setView("list")}
          aria-label={copyExample("List view")}
        >
          <ListIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            {<ExampleText>Add New... </ExampleText>}<ChevronDownIcon aria-hidden="true" className="opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <PlusIcon aria-hidden="true" />
            {<ExampleText>Project </ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>
            <PlusIcon aria-hidden="true" />
            {<ExampleText>Domain </ExampleText>}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusIcon aria-hidden="true" />
            {<ExampleText>Team </ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
