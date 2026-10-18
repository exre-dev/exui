"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, DownloadIcon, FileJsonIcon, FileSpreadsheetIcon, FileTextIcon, LayoutGridIcon, ListFilterIcon, ListIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


const icons = {
  filter: (
    <ListFilterIcon aria-hidden="true" />
  ),
  download: (
    <DownloadIcon aria-hidden="true" />
  ),
  chevronDown: (
    <ChevronDownIcon aria-hidden="true" />
  ),
  grid: (
    <LayoutGridIcon aria-hidden="true" />
  ),
  list: (
    <ListIcon aria-hidden="true" />
  ),
  fileSpreadsheet: (
    <FileSpreadsheetIcon aria-hidden="true" />
  ),
  fileJson: (
    <FileJsonIcon aria-hidden="true" />
  ),
  filePdf: (
    <FileTextIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <ButtonGroup>
      <Button variant="outline">
        {<ExampleText>{icons.filter}</ExampleText>}
        {<ExampleText>Filter </ExampleText>}</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">
        {<ExampleText>{icons.download}</ExampleText>}
        {<ExampleText>Export CSV </ExampleText>}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label={copyExample("More export options")}
          >
            {<ExampleText>{icons.chevronDown}</ExampleText>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {<ExampleText>{icons.fileSpreadsheet}</ExampleText>}
              {<ExampleText>Export Excel </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.fileJson}</ExampleText>}
              {<ExampleText>Export JSON </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.filePdf}</ExampleText>}
              {<ExampleText>Export PDF </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        aria-label={copyExample("Grid view")}
        className={cn(view === "grid" ? "bg-muted" : "")}
        onClick={() => setView("grid")}
      >
        {<ExampleText>{icons.grid}</ExampleText>}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={copyExample("List view")}
        className={cn(view === "list" ? "bg-muted" : "")}
        onClick={() => setView("list")}
      >
        {<ExampleText>{icons.list}</ExampleText>}
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
