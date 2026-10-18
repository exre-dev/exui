"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import type { ReactNode } from "react"

import { ClaudeAiIcon } from "../_shared/brands/claudeAiIcon"
import { Gemini } from "../_shared/brands/gemini"
import { Openai } from "../_shared/brands/openai"
import { OpenaiDark } from "../_shared/brands/openaiDark"
import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@exre/exui"


interface MenuItem {
  id: string
  label: string
  logo: ReactNode
  logoDark?: ReactNode
}

const menuItems: Array<MenuItem> = [
  {
    id: "gpt4o",
    label: "GPT-5.4",
    logo: <Openai />,
    logoDark: <OpenaiDark />,
  },
  {
    id: "claude",
    label: "Claude 4.6 Opus",
    logo: <ClaudeAiIcon />,
  },
  { id: "gemini", label: "Gemini 3.1 Pro", logo: <Gemini /> },
]

  function OriginalPattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-36">
          {<ExampleText>Select model </ExampleText>}<ChevronDownIcon className="ml-auto" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{<ExampleText>Model</ExampleText>}</DropdownMenuLabel>
          {<ExampleText>{menuItems.map((item) => (
            <DropdownMenuItem key={item.id}>
              {<ExampleText>{item.logoDark ? (
                <>
                  <span aria-hidden className="dark:hidden">
                    {<ExampleText>{item.logo}</ExampleText>}
                  </span>
                  <span aria-hidden className="hidden dark:block">
                    {<ExampleText>{item.logoDark}</ExampleText>}
                  </span>
                </>
              ) : (
                item.logo
              )}</ExampleText>}
              <span>{<ExampleText>{item.label}</ExampleText>}</span>
            </DropdownMenuItem>
          ))}</ExampleText>}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
