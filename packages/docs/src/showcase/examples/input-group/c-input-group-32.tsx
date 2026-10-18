"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


const roles = ["Admin", "Member", "Viewer"]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [role, setRole] = useState("Admin")

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon className="pr-1">
          <Avatar className="size-5">
            <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("Avatar")} />
            <AvatarFallback>{<ExampleText>LR</ExampleText>}</AvatarFallback>
          </Avatar>
        </InputGroupAddon>

        <InputGroupInput defaultValue="@shadcn" className="pl-1!" />

        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="h-7 text-xs">
                {<ExampleText>{role}</ExampleText>}
                <ChevronDownIcon className="size-3.5 opacity-60" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              {<ExampleText>{roles.map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                  {<ExampleText>{r}</ExampleText>}
                </DropdownMenuItem>
              ))}</ExampleText>}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
