"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const [showBookmarksBar, setShowBookmarksBar] = useState(true)
  const [showFullUrls, setShowFullUrls] = useState(false)
  const [showDeveloperTools, setShowDeveloperTools] = useState(true)

  return (
    <div className="flex w-full items-center justify-center p-12">
      <ContextMenu>
        <ContextMenuTrigger className="text-muted-foreground rounded-lg flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm">
          {<ExampleText>Right click here </ExampleText>}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuCheckboxItem
              checked={showBookmarksBar}
              onCheckedChange={setShowBookmarksBar}
            >
              {<ExampleText>Show Bookmarks Bar </ExampleText>}</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showFullUrls}
              onCheckedChange={setShowFullUrls}
            >
              {<ExampleText>Show Full URLs </ExampleText>}</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showDeveloperTools}
              onCheckedChange={setShowDeveloperTools}
            >
              {<ExampleText>Show Developer Tools </ExampleText>}</ContextMenuCheckboxItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
