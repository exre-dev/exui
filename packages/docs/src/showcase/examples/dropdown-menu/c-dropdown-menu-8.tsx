"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon, FolderOpenIcon, MailIcon, PaletteIcon, TrashIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = useState("light")

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>Complex Menu </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>File</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileIcon  />
              {<ExampleText>New File </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘N</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderOpenIcon  />
                {<ExampleText>Open Recent </ExampleText>}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>{<ExampleText>Project Alpha</ExampleText>}</DropdownMenuItem>
                  <DropdownMenuItem>{<ExampleText>Project Beta</ExampleText>}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{<ExampleText>Browse…</ExampleText>}</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Appearance</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PaletteIcon  />
                {<ExampleText>Theme </ExampleText>}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      {<ExampleText>Light </ExampleText>}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      {<ExampleText>Dark </ExampleText>}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      {<ExampleText>System </ExampleText>}</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            >
              <MailIcon  />
              {<ExampleText>Email Notifications </ExampleText>}</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon  />
            {<ExampleText>Delete </ExampleText>}<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
