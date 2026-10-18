"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ListFilterIcon, MoreHorizontalIcon, SearchIcon, XIcon } from "lucide-react"

import { useState } from "react"

import { Checkbox } from "@exre/exui"
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
import { Label } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


const statuses = ["Active", "Lead", "Prospect"] as const

const statusCounts: Record<(typeof statuses)[number], number> = {
  Active: 12,
  Lead: 7,
  Prospect: 5,
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<
    (typeof statuses)[number][]
  >([])

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          placeholder={copyExample("Search contacts...")}
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

          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="xs"
                className="gap-1.5"
                aria-label={copyExample("Filter contacts")}
              >
                <ListFilterIcon className="size-3.5" aria-hidden="true" />
                {<ExampleText>{selectedStatuses.length > 0 ? (
                  <span className="tabular-nums">
                    {<ExampleText>{selectedStatuses.length}</ExampleText>}
                  </span>
                ) : (
                  "Status"
                )}</ExampleText>}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-3">
              <div className="flex flex-col gap-2">
                {<ExampleText>{statuses.map((status) => (
                  <ExampleRuntimeConsumer key={status} render={({id: exampleId}) => (<div key={status} className="flex items-center gap-2.5">
                    <Checkbox
                      id={exampleId(`contact-status-${status}`)}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          previous.includes(status)
                            ? previous.filter((item) => item !== status)
                            : [...previous, status]
                        )
                      }
                    />
                    <Label
                      htmlFor={exampleId(`contact-status-${status}`)}
                      className="flex grow items-center justify-between gap-1.5 font-normal"
                    >
                      {<ExampleText>{status}</ExampleText>}
                      <span className="text-muted-foreground text-xs">
                        {<ExampleText>{statusCounts[status]}</ExampleText>}
                      </span>
                    </Label>
                  </div>)} />
                ))}</ExampleText>}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label={copyExample("More actions")}
              >
                <MoreHorizontalIcon aria-hidden="true" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuGroup>
                <DropdownMenuItem>{<ExampleText>Bulk email</ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem>{<ExampleText>Export CSV</ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem>{<ExampleText>Add contact</ExampleText>}</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
