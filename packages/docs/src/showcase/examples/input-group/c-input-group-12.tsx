"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

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
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [country, setCountry] = useState("+1")

  return (
    <Field className="w-full max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost">
                <span className="tabular-nums">{<ExampleText>{country}</ExampleText>}</span>
                <ChevronDownIcon  />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-24">
              <DropdownMenuItem onClick={() => setCountry("+1")}>
                {<ExampleText>+1 (US) </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCountry("+44")}>
                {<ExampleText>+44 (UK) </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCountry("+61")}>
                {<ExampleText>+61 (AU) </ExampleText>}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
        <InputGroupInput type="tel" placeholder={copyExample("123 456 7890")} />
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
