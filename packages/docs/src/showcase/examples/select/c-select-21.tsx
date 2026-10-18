"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { XIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"


const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "svelte", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [value, setValue] = useState("")

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setValue("")
  }

  return (
    <Field className="max-w-xs">
      <Select key={value || "__empty__"} value={value} onValueChange={setValue}>
        <SelectTrigger
          className={cn(value !== "" && "[&>svg:last-child]:hidden!")}
        >
          <SelectValue placeholder={copyExample("Select framework")} />
          {<ExampleText>{value !== "" ? (
            <div
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              onPointerDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <XIcon className="size-4" />
              <span className="sr-only">{<ExampleText>Clear selection</ExampleText>}</span>
            </div>
          ) : null}</ExampleText>}
        </SelectTrigger>
        <SelectContent position="popper">
          {<ExampleText>{frameworks.map((framework) => (
            <SelectItem key={framework.value} value={framework.value}>
              {<ExampleText>{framework.label}</ExampleText>}
            </SelectItem>
          ))}</ExampleText>}
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
