"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon, Settings2Icon } from "lucide-react"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"


const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    initials: "EW",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [selectedUserId, setSelectedUserId] = useState<string>("3")

  return (
    <ButtonGroup>
      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={copyExample("Select user")} />
        </SelectTrigger>
        <SelectContent position="popper" className="min-w-[200px]">
          <SelectGroup>
            <SelectLabel>{<ExampleText>Team Members</ExampleText>}</SelectLabel>
            {<ExampleText>{users.map((user) => (
              <ExampleRuntimeConsumer key={user.id} render={({copy: copyExample}) => (<SelectItem key={user.id} value={user.id}>
                <span className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarImage src={user.avatar} alt={copyExample(user.name)} />
                    <AvatarFallback className="text-[10px]">
                      {<ExampleText>{user.initials}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{<ExampleText>{user.name}</ExampleText>}</span>
                </span>
              </SelectItem>)} />
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" aria-label={copyExample("Add Tag")}>
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label={copyExample("Settings")}>
        <Settings2Icon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
