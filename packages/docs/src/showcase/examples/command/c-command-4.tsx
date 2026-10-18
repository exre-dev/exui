"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon, CalculatorIcon, CalendarIcon, ClipboardIcon, CodeIcon, CopyIcon, CreditCardIcon, FileTextIcon, FolderIcon, FolderPlusIcon, HelpCircleIcon, HouseIcon, ImageIcon, InboxIcon, LayoutGridIcon, ListIcon, PlusIcon, ScissorsIcon, SettingsIcon, TrashIcon, UserIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"

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
        {<ExampleText>Open Command </ExampleText>}</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder={copyExample("Type a command or search...")} />
          <CommandList>
            <CommandEmpty>{<ExampleText>No results found.</ExampleText>}</CommandEmpty>
            <CommandGroup heading={copyExample("Navigation")}>
              <CommandItem>
                <HouseIcon  />
                <span>{<ExampleText>Home</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘H</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <InboxIcon  />
                <span>{<ExampleText>Inbox</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘I</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FileTextIcon  />
                <span>{<ExampleText>Documents</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘D</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FolderIcon  />
                <span>{<ExampleText>Folders</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘F</ExampleText>}</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Actions")}>
              <CommandItem>
                <PlusIcon  />
                <span>{<ExampleText>New File</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘N</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FolderPlusIcon  />
                <span>{<ExampleText>New Folder</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⇧⌘N</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CopyIcon  />
                <span>{<ExampleText>Copy</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘C</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <ScissorsIcon  />
                <span>{<ExampleText>Cut</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘X</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <ClipboardIcon  />
                <span>{<ExampleText>Paste</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘V</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TrashIcon  />
                <span>{<ExampleText>Delete</ExampleText>}</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("View")}>
              <CommandItem>
                <LayoutGridIcon  />
                <span>{<ExampleText>Grid View</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <ListIcon  />
                <span>{<ExampleText>List View</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <ZoomInIcon  />
                <span>{<ExampleText>Zoom In</ExampleText>}</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <ZoomOutIcon  />
                <span>{<ExampleText>Zoom Out</ExampleText>}</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Account")}>
              <CommandItem>
                <UserIcon  />
                <span>{<ExampleText>Profile</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘P</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon  />
                <span>{<ExampleText>Billing</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘B</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon  />
                <span>{<ExampleText>Settings</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘S</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <BellIcon  />
                <span>{<ExampleText>Notifications</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <HelpCircleIcon  />
                <span>{<ExampleText>Help &amp; Support</ExampleText>}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Tools")}>
              <CommandItem>
                <CalculatorIcon  />
                <span>{<ExampleText>Calculator</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <CalendarIcon  />
                <span>{<ExampleText>Calendar</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <ImageIcon  />
                <span>{<ExampleText>Image Editor</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <CodeIcon  />
                <span>{<ExampleText>Code Editor</ExampleText>}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
