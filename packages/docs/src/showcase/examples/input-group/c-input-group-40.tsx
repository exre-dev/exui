"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, CopyIcon, LinkIcon } from "lucide-react"

import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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


const visibilityOptions = ["Private", "Team", "Public"]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [visibility, setVisibility] = useState(visibilityOptions[0])

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <LinkIcon className="size-4 opacity-60" aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="agentflow.ai/runbooks/q2-review"
          aria-label={copyExample("Share link")}
        />

        <InputGroupAddon align="inline-end" className="gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="xs"
                className="gap-1.5"
                aria-label={copyExample("Select visibility")}
              >
                {<ExampleText>{visibility}</ExampleText>}
                <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuGroup>
                {<ExampleText>{visibilityOptions.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onSelect={() => setVisibility(item)}
                  >
                    {<ExampleText>{item}</ExampleText>}
                  </DropdownMenuItem>
                ))}</ExampleText>}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            aria-label={copyExample("Copy link")}
          >
            <CopyIcon aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
