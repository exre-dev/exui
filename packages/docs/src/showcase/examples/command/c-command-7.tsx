"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon, HouseIcon, InboxIcon, LogOutIcon, MoonIcon, PlusIcon, UserPlusIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {<ExampleText>Quick Actions </ExampleText>}</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder={copyExample("What do you need?")} />
          <CommandList>
            <CommandEmpty>{<ExampleText>No actions found.</ExampleText>}</CommandEmpty>
            <CommandGroup heading={copyExample("Create")}>
              <CommandItem>
                <PlusIcon  />
                <span>{<ExampleText>New Project</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘N</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FileTextIcon  />
                <span>{<ExampleText>New Document</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘⇧N</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <UserPlusIcon  />
                <span>{<ExampleText>Invite Member</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘I</ExampleText>}</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Navigate")}>
              <CommandItem>
                <HouseIcon  />
                <span>{<ExampleText>Go to Dashboard</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘D</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <InboxIcon  />
                <span>{<ExampleText>Go to Inbox</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘⇧I</ExampleText>}</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("System")}>
              <CommandItem>
                <MoonIcon  />
                <span>{<ExampleText>Toggle Dark Mode</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘⇧D</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <LogOutIcon  />
                <span>{<ExampleText>Sign Out</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘Q</ExampleText>}</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
