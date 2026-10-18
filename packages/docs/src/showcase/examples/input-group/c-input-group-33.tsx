"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LayersIcon, LockIcon } from "lucide-react"

import { useState } from "react"

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
  InputGroupText,
  InputGroupTextarea,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [visibility, setVisibility] = useState("Personal")

  return (
    <Field className="max-w-3xl">
      <InputGroup className="bg-background h-auto items-start p-3 pl-4">
        <InputGroupAddon className="border-border bg-muted mt-1.5 inline-flex size-8 items-center justify-center rounded-md border p-0">
          <LayersIcon className="text-muted-foreground size-4" />
        </InputGroupAddon>

        <div className="flex flex-1 flex-col pt-2.5 pl-1">
          <InputGroupInput
            placeholder={copyExample("Enter project name...")}
            className="h-10 border-none text-base shadow-none focus-visible:ring-0"
          />
          <InputGroupTextarea
            placeholder={copyExample("Description as multiple lines of text are supported...")}
            className="text-muted-foreground min-h-16 border-none text-sm shadow-none focus-visible:ring-0"
          />
        </div>

        <InputGroupAddon align="inline-end" className="gap-2 border-none">
          <InputGroupText className="text-muted-foreground text-sm whitespace-nowrap">
            {<ExampleText>Save to </ExampleText>}</InputGroupText>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="outline"
                size="sm"
                className="h-8 gap-2 font-normal"
              >
                <LockIcon className="size-3.5" />
                {<ExampleText>{visibility}</ExampleText>}
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setVisibility("Personal")}>
                {<ExampleText>Personal </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility("Team")}>
                {<ExampleText>Team </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility("Public")}>
                {<ExampleText>Public </ExampleText>}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="bg-border mx-1 h-4 w-px self-center" />

          <InputGroupButton variant="secondary" size="sm">
            {<ExampleText>Cancel </ExampleText>}</InputGroupButton>
          <InputGroupButton variant="default" size="sm">
            {<ExampleText>Save </ExampleText>}</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
