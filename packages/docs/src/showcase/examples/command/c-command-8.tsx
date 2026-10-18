"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookOpenIcon, ClockIcon, LifeBuoyIcon, MessageSquareIcon, StarIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {<ExampleText>Search Everything </ExampleText>}</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder={copyExample("Search or jump to...")} />
          <CommandList>
            <CommandEmpty>{<ExampleText>No results found.</ExampleText>}</CommandEmpty>
            <CommandGroup heading={copyExample("Favorites")}>
              <CommandItem>
                <StarIcon className="text-yellow-500" />
                <span>{<ExampleText>Design System</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <StarIcon className="text-yellow-500" />
                <span>{<ExampleText>API Documentation</ExampleText>}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Recent")}>
              <CommandItem>
                <ClockIcon className="text-muted-foreground" />
                <span>{<ExampleText>Dashboard Analytics</ExampleText>}</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>{<ExampleText>2m ago</ExampleText>}</span>
                </div>
              </CommandItem>
              <CommandItem>
                <ClockIcon className="text-muted-foreground" />
                <span>{<ExampleText>User Settings</ExampleText>}</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>{<ExampleText>15m ago</ExampleText>}</span>
                </div>
              </CommandItem>
              <CommandItem>
                <ClockIcon className="text-muted-foreground" />
                <div className="flex flex-1 items-center justify-between">
                  <span>{<ExampleText>Team Members</ExampleText>}</span>
                  <div className="ml-auto" data-slot="command-shortcut">
                    <span>{<ExampleText>1h ago</ExampleText>}</span>
                  </div>
                </div>
              </CommandItem>
              <CommandItem>
                <ClockIcon className="text-muted-foreground" />
                <span>{<ExampleText>Billing &amp; Plans</ExampleText>}</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>{<ExampleText>2h ago</ExampleText>}</span>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Quick Links")}>
              <CommandItem>
                <BookOpenIcon  />
                <span>{<ExampleText>Documentation</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <LifeBuoyIcon  />
                <span>{<ExampleText>Help &amp; Support</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <MessageSquareIcon  />
                <span>{<ExampleText>Contact Us</ExampleText>}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
