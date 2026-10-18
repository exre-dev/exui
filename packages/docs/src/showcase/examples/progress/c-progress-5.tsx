"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"
import { Progress } from "@exre/exui"


const files = [
  { id: "1", name: "document.pdf", progress: 45, status: "2m 30s" },
  { id: "2", name: "presentation.pptx", progress: 78, status: "45s" },
  { id: "3", name: "spreadsheet.xlsx", progress: 12, status: "5m 12s" },
  { id: "4", name: "image.jpg", progress: 100, status: "Complete" },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col">
      <ItemGroup>
        {<ExampleText>{files.map((file) => (
          <Item key={file.id} size="xs" className="px-0">
            <ItemMedia variant="icon">
              <FileIcon className="text-muted-foreground size-4" />
            </ItemMedia>
            <ItemContent className="flex-1 truncate">
              <ItemTitle className="cursor-pointer truncate hover:underline">
                {<ExampleText>{file.name}</ExampleText>}
              </ItemTitle>
            </ItemContent>
            <ItemContent className="w-32">
              <Progress value={file.progress} className="h-1" />
            </ItemContent>
            <ItemActions className="w-20 justify-end">
              <span className="text-foreground">{<ExampleText>{file.status}</ExampleText>}</span>
            </ItemActions>
          </Item>
        ))}</ExampleText>}
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
