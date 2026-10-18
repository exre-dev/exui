"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, GlobeIcon, SearchIcon, XIcon } from "lucide-react"

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


const regions = ["Global", "United States", "Europe", "APAC"]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [searchQuery, setSearchQuery] = useState("")
  const [region, setRegion] = useState(regions[0])

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          placeholder={copyExample("Search companies...")}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <InputGroupAddon align="inline-end" className="gap-1">
          {<ExampleText>{searchQuery.length > 0 ? (
            <InputGroupButton
              aria-label={copyExample("Clear search")}
              size="icon-xs"
              variant="ghost"
              onClick={() => setSearchQuery("")}
            >
              <XIcon aria-hidden="true" />
            </InputGroupButton>
          ) : null}</ExampleText>}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="xs"
                className="gap-1.5"
                aria-label={copyExample("Select region")}
              >
                <GlobeIcon className="size-3.5" aria-hidden="true" />
                {<ExampleText>{region}</ExampleText>}
                <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuGroup>
                {<ExampleText>{regions.map((item) => (
                  <DropdownMenuItem key={item} onSelect={() => setRegion(item)}>
                    {<ExampleText>{item}</ExampleText>}
                  </DropdownMenuItem>
                ))}</ExampleText>}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
