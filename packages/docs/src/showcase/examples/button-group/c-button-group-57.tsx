"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, MessageSquareIcon, ShieldCheckIcon, ZapIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


const modes = [
  {
    id: "assist",
    label: "Assist",
    icon: (
      <MessageSquareIcon className="size-3.5 opacity-60" aria-hidden="true" />
    ),
  },
  {
    id: "review",
    label: "Review",
    icon: (
      <ShieldCheckIcon className="size-3.5 opacity-60" aria-hidden="true" />
    ),
  },
  {
    id: "auto",
    label: "Auto",
    icon: (
      <ZapIcon className="size-3.5 opacity-60" aria-hidden="true" />
    ),
  },
] as const

const limits = ["2k credits", "10k credits", "Unlimited"]

type ModeId = (typeof modes)[number]["id"]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [active, setActive] = useState<ModeId>("review")
  const [limit, setLimit] = useState(limits[1])

  return (
    <ButtonGroup>
      {<ExampleText>{modes.map((mode) => (
        <Button
          key={mode.id}
          variant="outline"
          size="sm"
          className={cn(active === mode.id && "bg-muted")}
          onClick={() => setActive(mode.id)}
        >
          {<ExampleText>{mode.icon}</ExampleText>}
          {<ExampleText>{mode.label}</ExampleText>}
        </Button>
      ))}</ExampleText>}
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            aria-label={copyExample("Select credit cap")}
          >
            {<ExampleText>{limit}</ExampleText>}
            <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuGroup>
            {<ExampleText>{limits.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                {<ExampleText>{item}</ExampleText>}
              </DropdownMenuItem>
            ))}</ExampleText>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
