"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon, SearchIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@exre/exui"
import { Kbd } from "@exre/exui"


const files = [
  { name: "page.tsx", path: "src/app/page.tsx", type: "tsx" },
  { name: "layout.tsx", path: "src/app/layout.tsx", type: "tsx" },
  { name: "globals.css", path: "src/styles/globals.css", type: "css" },
  { name: "utils.ts", path: "src/lib/utils.ts", type: "ts" },
  { name: "api.ts", path: "src/lib/api.ts", type: "ts" },
  { name: "button.tsx", path: "src/components/ui/button.tsx", type: "tsx" },
  { name: "package.json", path: "package.json", type: "json" },
  { name: "README.md", path: "README.md", type: "md" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="w-52">
        <SearchIcon className="size-4" />
        {<ExampleText>Search files... </ExampleText>}<Kbd className="ml-auto">{<ExampleText>⌘K</ExampleText>}</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder={copyExample("Search files by name...")} />
          <CommandList>
            <CommandEmpty>{<ExampleText>No files found.</ExampleText>}</CommandEmpty>
            <CommandGroup heading={copyExample("Files")}>
              {<ExampleText>{files.map((file) => (
                <CommandItem key={file.path} className="gap-2.5">
                  <FileIcon className="size-4 shrink-0" />
                  <div className="flex flex-1 items-center gap-2">
                    <span className="font-medium">{<ExampleText>{file.name}</ExampleText>}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {<ExampleText>{file.path}</ExampleText>}
                    </span>
                  </div>
                  <div className="ml-auto" data-slot="command-shortcut">
                    <Badge variant="outline" size="sm">
                      {<ExampleText>{file.type}</ExampleText>}
                    </Badge>
                  </div>
                </CommandItem>
              ))}</ExampleText>}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
