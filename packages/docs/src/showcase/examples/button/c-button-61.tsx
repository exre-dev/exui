"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoonIcon, SunIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"


  function OriginalPattern() {
  const {format: formatExample } = useExampleRuntime()

  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={(formatExample(theme === "dark" ? "Switch to light mode" : "Switch to dark mode", {}))}
    >
      <SunIcon className={cn(
          "size-4 transition-all duration-300",
          theme === "dark"
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )} />
      <MoonIcon className={cn(
          "absolute size-4 transition-all duration-300",
          theme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0"
        )} />
      <span className="sr-only">{<ExampleText>Toggle theme</ExampleText>}</span>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
