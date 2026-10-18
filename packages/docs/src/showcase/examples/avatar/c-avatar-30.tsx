"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useEffect, useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Spinner,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample, timers: exampleTimers } = useExampleRuntime()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = exampleTimers.setInterval(() => setLoading((prev) => !prev), 2000) // Toggle loading state every 2 seconds
    return () => clearInterval(interval)
  }, [exampleTimers])

  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("@shadcn")} />
        <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
      </Avatar>
      {<ExampleText>{loading && (
        <div className="bg-background/60 absolute inset-0 flex items-center justify-center rounded-full">
          <Spinner className="text-primary" />
        </div>
      )}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
