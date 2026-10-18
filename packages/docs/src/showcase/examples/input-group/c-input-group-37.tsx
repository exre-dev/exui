"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ListFilterIcon, SearchIcon, XIcon } from "lucide-react"

import { useState } from "react"

import { Checkbox } from "@exre/exui"
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


const statuses = ["Pending", "Shipped", "Cancelled"] as const

type Status = (typeof statuses)[number]

function toggleStatus(values: Status[], value: Status) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          placeholder={copyExample("Search orders...")}
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
                aria-label={copyExample("Filter order status")}
              >
                <ListFilterIcon className="size-3.5" aria-hidden="true" />
                {<ExampleText>Status </ExampleText>}{<ExampleText>{selectedStatuses.length > 0 ? (
                  <span className="text-muted-foreground tabular-nums">
                    {<ExampleText>{selectedStatuses.length}</ExampleText>}
                  </span>
                ) : null}</ExampleText>}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-3">
              <div className="flex flex-col gap-2">
                {<ExampleText>{statuses.map((status) => (
                  <ExampleRuntimeConsumer key={status} render={({id: exampleId}) => (<div key={status} className="flex items-center gap-2.5">
                    <Checkbox
                      id={exampleId(`order-status-${status}`)}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          toggleStatus(previous, status)
                        )
                      }
                    />
                    <Label
                      htmlFor={exampleId(`order-status-${status}`)}
                      className="text-sm font-normal"
                    >
                      {<ExampleText>{status}</ExampleText>}
                    </Label>
                  </div>)} />
                ))}</ExampleText>}
              </div>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
