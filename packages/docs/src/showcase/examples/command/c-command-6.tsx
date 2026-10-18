"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
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

const users = [
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    role: "Admin",
  },
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    role: "Editor",
  },
  {
    name: "David Kim",
    email: "david@example.com",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    role: "Viewer",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    role: "Admin",
  },
  {
    name: "Michael Rodriguez",
    email: "michael@example.com",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    role: "Editor",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {<ExampleText>Search Users </ExampleText>}</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder={copyExample("Search by name or email...")} />
          <CommandList>
            <CommandEmpty>{<ExampleText>No users found.</ExampleText>}</CommandEmpty>
            <CommandGroup heading={copyExample("Team Members")}>
              {<ExampleText>{users.map((user) => (
                <ExampleRuntimeConsumer key={user.email} render={({copy: copyExample}) => (<CommandItem key={user.email} className="gap-2 py-2">
                  <Avatar className="size-6 shrink-0">
                    <AvatarImage src={user.avatar} alt={copyExample(user.name)} />
                    <AvatarFallback className="text-xs">
                      {<ExampleText>{user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{<ExampleText>{user.name}</ExampleText>}</span>
                    <span className="text-muted-foreground text-xs">
                      {<ExampleText>{user.email}</ExampleText>}
                    </span>
                  </div>
                  <div className="ml-auto" data-slot="command-shortcut">
                    <Badge
                      variant={
                        user.role === "Admin"
                          ? "primary-light"
                          : user.role === "Editor"
                            ? "info-light"
                            : "success-light"
                      }
                      size="sm"
                    >
                      {<ExampleText>{user.role}</ExampleText>}
                    </Badge>
                  </div>
                </CommandItem>)} />
              ))}</ExampleText>}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
