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

  const [category, setCategory] = useState("Category")

  return (
    <Field className="max-w-xs">
      <InputGroup className="rounded-full">
        <InputGroupInput
          placeholder={copyExample("Search products")}
          className="rounded-full px-5"
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                className="h-7 rounded-full px-3 text-xs"
              >
                {<ExampleText>{category}</ExampleText>}
                <ChevronDownIcon className="ml-1 size-3.5 opacity-60" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setCategory("Electronics")}>
                {<ExampleText>Electronics </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("Clothing")}>
                {<ExampleText>Clothing </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("Home")}>
                {<ExampleText>Home </ExampleText>}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
