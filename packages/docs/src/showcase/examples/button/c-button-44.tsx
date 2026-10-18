"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"

import { useEffect, useState } from "react"

import { Button } from "@exre/exui"
import { Spinner } from "@exre/exui"


type Status = "idle" | "loading" | "success"

  function OriginalPattern() {
  const { timers: exampleTimers } = useExampleRuntime()

  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    if (status !== "success") return

    const timer = exampleTimers.setTimeout(() => setStatus("idle"), 2000)
    return () => clearTimeout(timer)
  }, [status, exampleTimers])

  return (
    <Button
      onClick={() => {
        if (status !== "idle") return

        setStatus("loading")
        exampleTimers.setTimeout(() => setStatus("success"), 900)
      }}
      disabled={status === "loading"}
      aria-busy={status === "loading"}
      aria-live="polite"
      className="min-w-32"
    >
      {<ExampleText>{status === "loading" ? (
        <>
          <Spinner aria-hidden="true" />
          {<ExampleText>Saving… </ExampleText>}</>
      ) : status === "success" ? (
        <>
          <CheckIcon aria-hidden="true" />
          {<ExampleText>Saved </ExampleText>}</>
      ) : (
        "Save changes"
      )}</ExampleText>}
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
