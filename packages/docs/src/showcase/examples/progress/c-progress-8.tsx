"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useEffect, useState } from "react"

import { Progress } from "@exre/exui"

  function OriginalPattern() {
  const { timers: exampleTimers } = useExampleRuntime()

  const [progress, setProgress] = useState(45)

  useEffect(() => {
    const timer = exampleTimers.setTimeout(() => setProgress(75), 500)
    return () => clearTimeout(timer)
  }, [exampleTimers])

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-green-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-yellow-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-fuchsia-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-indigo-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-violet-500"
      ></Progress>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
