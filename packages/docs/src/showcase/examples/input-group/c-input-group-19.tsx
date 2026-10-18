"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AtSignIcon, ChevronDownIcon, CornerDownLeftIcon, FileTextIcon, ImageIcon, PaperclipIcon } from "lucide-react"

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


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [model, setModel] = useState("GPT-4o")

  return (
    <Field className="max-w-xs">
      <InputGroup className="bg-background">
        <InputGroupAddon align="block-start" className="gap-2 px-3 pt-3">
          <InputGroupButton aria-label={copyExample("Mention")} variant="outline" size="icon-xs">
            <AtSignIcon className="size-3.5" />
          </InputGroupButton>
          <InputGroupButton variant="outline">
            <PaperclipIcon className="size-3.5 not-only:rotate-45" />
            1
          </InputGroupButton>
          <InputGroupButton variant="outline">
            <FileTextIcon className="size-3.5 not-only:rotate-45" />
            {<ExampleText>1 Tab </ExampleText>}</InputGroupButton>
        </InputGroupAddon>

        <InputGroupTextarea
          placeholder={copyExample("Plan, search, build anything")}
          className="min-h-24 border-none py-4 shadow-none focus-visible:ring-0"
        />

        <InputGroupAddon align="block-end" className="px-3 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="secondary" size="sm">
                {<ExampleText>{model}</ExampleText>}
                <ChevronDownIcon  />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setModel("GPT-4o")}>
                {<ExampleText>GPT-4o </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModel("Claude 3.5 Sonnet")}>
                {<ExampleText>Claude 3.5 Sonnet </ExampleText>}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <InputGroupButton aria-label={copyExample("Add image")} variant="secondary" size="icon-sm">
              <ImageIcon className="text-muted-foreground" />
            </InputGroupButton>
            <InputGroupButton aria-label={copyExample("Send")} variant="default" size="icon-sm">
              <CornerDownLeftIcon  />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
