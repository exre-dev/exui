"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { cn } from "@exre/exui"

const emojis = [
  { value: 1, emoji: "😞", label: "Terrible" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🤩", label: "Amazing" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
      <p className="text-sm font-medium">{<ExampleText>How was your experience?</ExampleText>}</p>
      <div className="flex gap-2">
        {<ExampleText>{emojis.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-label={copyExample(item.label)}
            aria-pressed={selected === item.value}
            onClick={() => setSelected(item.value)}
            className={cn(
              "rounded-lg flex size-10 items-center justify-center border-2 text-2xl transition-all",
              selected === item.value
                ? "border-border bg-muted scale-110"
                : "hover:bg-muted border-transparent"
            )}
          >
            {<ExampleText>{item.emoji}</ExampleText>}
          </button>
        ))}</ExampleText>}
      </div>
      {<ExampleText>{selected && (
        <p className="text-muted-foreground text-sm">
          {<ExampleText>{emojis.find((e) => e.value === selected)?.label}</ExampleText>}
        </p>
      )}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
