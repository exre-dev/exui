"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const statuses = [
  { value: "ready", label: "Ready", color: "bg-emerald-400" },
  { value: "error", label: "Error", color: "bg-red-500" },
  { value: "building", label: "Building", color: "bg-amber-500" },
  { value: "queued", label: "Queued", color: "bg-blue-500" },
  { value: "initializing", label: "Initializing", color: "bg-primary" },
  { value: "canceled", label: "Canceled", color: "bg-fuchsia-500" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [selected, setSelected] = useState<string>(statuses[0].value)

  return (
    <Field className="max-w-xs">
      <Select value={selected} onValueChange={(val) => setSelected(val)}>
        <SelectTrigger className="w-full justify-between">
          <SelectValue placeholder={copyExample("Select status")} />
        </SelectTrigger>
        <SelectContent position="popper" className="min-w-48">
          <SelectGroup>
            {<ExampleText>{statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-full", status.color)} />
                  <span>{<ExampleText>{status.label}</ExampleText>}</span>
                </div>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
