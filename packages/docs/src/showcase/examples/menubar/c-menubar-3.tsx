"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarTrigger } from "@exre/exui"

  function OriginalPattern() {
  const [theme, setTheme] = useState("system")

  return (
    <div className="flex items-center justify-center">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>View</ExampleText>}</MenubarTrigger>
          <MenubarContent className="w-64">
            <MenubarCheckboxItem>{<ExampleText>Always Show Bookmarks Bar</ExampleText>}</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              {<ExampleText>Always Show Full URLs </ExampleText>}</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>Theme</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">{<ExampleText>Light</ExampleText>}</MenubarRadioItem>
              <MenubarRadioItem value="dark">{<ExampleText>Dark</ExampleText>}</MenubarRadioItem>
              <MenubarRadioItem value="system">{<ExampleText>System</ExampleText>}</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
