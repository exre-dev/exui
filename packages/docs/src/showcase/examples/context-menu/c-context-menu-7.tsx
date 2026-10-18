"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const [user, setUser] = useState("pedro")
  const [theme, setTheme] = useState("light")

  return (
    <div className="flex w-full items-center justify-center p-12">
      <ContextMenu>
        <ContextMenuTrigger className="text-muted-foreground rounded-lg flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm">
          {<ExampleText>Right click here </ExampleText>}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>{<ExampleText>People</ExampleText>}</ContextMenuLabel>
            <ContextMenuRadioGroup value={user} onValueChange={setUser}>
              <ContextMenuRadioItem value="pedro">
                {<ExampleText>Pedro Duarte </ExampleText>}</ContextMenuRadioItem>
              <ContextMenuRadioItem value="colm">
                {<ExampleText>Colm Tuite </ExampleText>}</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>{<ExampleText>Theme</ExampleText>}</ContextMenuLabel>
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem value="light">{<ExampleText>Light</ExampleText>}</ContextMenuRadioItem>
              <ContextMenuRadioItem value="dark">{<ExampleText>Dark</ExampleText>}</ContextMenuRadioItem>
              <ContextMenuRadioItem value="system">{<ExampleText>System</ExampleText>}</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
