"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GlobeIcon, LayersIcon, TerminalIcon } from "lucide-react"

import { useState } from "react"

import { ButtonGroup } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"


const environments = [
  {
    value: "production",
    label: "Production",
    icon: (
      <GlobeIcon aria-hidden="true" className="size-3.5 opacity-60" />
    ),
  },
  {
    value: "staging",
    label: "Staging",
    icon: (
      <LayersIcon aria-hidden="true" className="size-3.5 opacity-60" />
    ),
  },
  {
    value: "development",
    label: "Development",
    icon: (
      <TerminalIcon aria-hidden="true" className="size-3.5 opacity-60" />
    ),
  },
]

const timeRanges = [
  { value: "1h", label: "Last hour", category: "recent" },
  { value: "6h", label: "Last 6 hours", category: "recent" },
  { value: "12h", label: "Last 12 hours", category: "recent" },
  { value: "24h", label: "Last 24 hours", category: "recent" },
  { value: "3d", label: "Last 3 days", category: "plus" },
  { value: "7d", label: "Last 7 days", category: "plus" },
  { value: "14d", label: "Last 14 days", category: "plus" },
  { value: "30d", label: "Last 30 days", category: "plus" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [env, setEnv] = useState<string>("development")
  const [range, setRange] = useState<string>("12h")

  return (
    <ButtonGroup>
      <Select value={env} onValueChange={setEnv}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={copyExample("Select environment")} />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectGroup>
            {<ExampleText>{environments.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className="flex items-center gap-2">
                  {<ExampleText>{item.icon}</ExampleText>}
                  <span>{<ExampleText>{item.label}</ExampleText>}</span>
                </div>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={range} onValueChange={setRange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={copyExample("Select range")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{timeRanges
              .filter((r) => r.category === "recent")
              .map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {<ExampleText>{item.label}</ExampleText>}
                </SelectItem>
              ))}</ExampleText>}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{<ExampleText>Observability Plus</ExampleText>}</SelectLabel>
            {<ExampleText>{timeRanges
              .filter((r) => r.category === "plus")
              .map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {<ExampleText>{item.label}</ExampleText>}
                </SelectItem>
              ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
