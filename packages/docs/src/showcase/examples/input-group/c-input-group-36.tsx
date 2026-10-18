"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
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


const httpMethodColors = {
  GET: "text-emerald-600 dark:text-emerald-400",
  POST: "text-blue-500",
  PUT: "text-amber-500",
  PATCH: "text-violet-500",
  DELETE: "text-destructive",
} as const

type HttpMethod = keyof typeof httpMethodColors

const httpMethods = Object.keys(httpMethodColors) as HttpMethod[]

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample } = useExampleRuntime()

  const [method, setMethod] = useState<HttpMethod>("GET")

  return (
    <Field className="max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                className={cn(
                  "gap-1.5 font-mono text-xs",
                  httpMethodColors[method]
                )}
                aria-label={(formatExample("HTTP method: {method}", { method: method }))}
              >
                {<ExampleText>{method}</ExampleText>}
                <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-28">
              <DropdownMenuGroup>
                {<ExampleText>{httpMethods.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    className={cn(
                      "font-mono text-xs font-semibold",
                      httpMethodColors[item]
                    )}
                    onSelect={() => setMethod(item)}
                  >
                    {<ExampleText>{item}</ExampleText>}
                  </DropdownMenuItem>
                ))}</ExampleText>}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="/v1/agents/run"
          className="font-mono text-xs"
          aria-label={copyExample("API endpoint path")}
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs" aria-label={copyExample("Send request")}>
            {<ExampleText>Send </ExampleText>}</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
