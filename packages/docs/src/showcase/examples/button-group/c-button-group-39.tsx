"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup className="**:data-[slot=button]:border-x-0">
      <Button variant="default">{<ExampleText>Save</ExampleText>}</Button>
      <ButtonGroupSeparator className="bg-primary-foreground/10" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon" aria-label={copyExample("More options")}>
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>{<ExampleText>Save and publish</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Save as draft</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Save and exit</ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
