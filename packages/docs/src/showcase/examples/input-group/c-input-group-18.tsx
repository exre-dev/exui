"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpIcon, ChevronDownIcon, GlobeIcon, MicIcon, PlusIcon } from "lucide-react"

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
  InputGroupTextarea,
} from "@exre/exui"
import { Kbd } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [model, setModel] = useState("GPT-4o")

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder={copyExample("Ask AI anything...")}
          className="min-h-24 pb-12"
        />
        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-1">
            <InputGroupButton aria-label={copyExample("Add")} variant="ghost" size="icon-xs">
              <PlusIcon className="size-4" />
            </InputGroupButton>
            <InputGroupButton aria-label={copyExample("Voice input")} variant="ghost" size="icon-xs">
              <MicIcon className="size-4" />
            </InputGroupButton>
            <InputGroupButton variant="ghost" className="h-7 px-2 text-xs">
              <GlobeIcon className="mr-1 size-3.5" />
              {<ExampleText>Search </ExampleText>}</InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost" className="h-7 px-2 text-xs">
                  <Kbd className="border-border rounded-sm border">Σ</Kbd>
                  {<ExampleText>{model}</ExampleText>}
                  <ChevronDownIcon className="ml-1 size-3.5 opacity-60" />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-32">
                <DropdownMenuItem onClick={() => setModel("GPT-4o")}>
                  {<ExampleText>GPT-4o </ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModel("GPT-4")}>
                  {<ExampleText>GPT-4 </ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModel("Claude 3.5")}>
                  {<ExampleText>Claude 3.5 </ExampleText>}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <InputGroupButton aria-label={copyExample("Send")}
            variant="default"
            size="icon-xs"
            className="ml-auto"
          >
            <ArrowUpIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
