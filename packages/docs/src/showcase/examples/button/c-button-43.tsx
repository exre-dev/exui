"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MenuIcon, XIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [open, setOpen] = useState(false)

  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={copyExample(open ? "Close menu" : "Open menu")}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      <span className="relative flex size-4 items-center justify-center">
        <MenuIcon aria-hidden="true" className={cn(
            "absolute size-4 transition-all duration-200",
            open
              ? "scale-75 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          )} />
        <XIcon aria-hidden="true" className={cn(
            "absolute size-4 transition-all duration-200",
            open
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 -rotate-90 opacity-0"
          )} />
      </span>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
