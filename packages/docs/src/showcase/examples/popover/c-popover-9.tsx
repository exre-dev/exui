"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useEffect, useState } from "react"
import { Badge } from "@exre/exui"
import { format, formatDistance } from "date-fns"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, timers: exampleTimers } = useExampleRuntime()

  const [now, setNow] = useState(new Date(EXAMPLE_EPOCH))

  useEffect(() => {
    const timer = exampleTimers.setInterval(() => setNow(previous => new Date(previous.getTime() + 1000)), 1000)
    return () => clearInterval(timer)
  }, [exampleTimers])

  // Static reference time for the "last deployed" example
  const referenceTime = new Date(now.getTime() - 1000 * 60 * 120) // 2 hours ago

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <p className="text-muted-foreground text-sm">
        {<ExampleText>Last deployed</ExampleText>}{<ExampleText>{" "}</ExampleText>}
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-foreground cursor-default underline decoration-dashed decoration-1 underline-offset-4 outline-hidden">
              {<ExampleText>{formatDistance(referenceTime, now, { locale: exampleLocale,  addSuffix: true })}</ExampleText>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto max-w-86 gap-0 p-0" align="start">
            <p className="text-foreground border-b px-2 py-1 font-medium">
              {<ExampleText>{formatDistance(referenceTime, now, { locale: exampleLocale,  addSuffix: true })}</ExampleText>}
            </p>
            <div className="px-2 py-1.5">
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4 pb-1.5">
                      <Badge variant="outline">{<ExampleText>UTC</ExampleText>}</Badge>
                    </td>
                    <td className="pr-6 pb-1.5">
                      {<ExampleText>{format(referenceTime, "MMM d, yyyy", { locale: exampleLocale })}</ExampleText>}
                    </td>
                    <td className="text-muted-foreground pb-1.5">
                      {<ExampleText>{format(referenceTime, "hh:mm:ss a", { locale: exampleLocale })}</ExampleText>}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <span className="bg-muted rounded px-1.5 py-0.5 font-medium">
                        {<ExampleText>{Intl.DateTimeFormat()
                          .resolvedOptions()
                          .timeZone.split("/")
                          .pop()
                          ?.replace("_", " ") || "Local"}</ExampleText>}
                      </span>
                    </td>
                    <td className="pr-6">{<ExampleText>{format(now, "MMM d, yyyy", { locale: exampleLocale })}</ExampleText>}</td>
                    <td className="text-muted-foreground w-28">
                      {<ExampleText>{format(now, "hh:mm:ss a", { locale: exampleLocale })}</ExampleText>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PopoverContent>
        </Popover>{<ExampleText>{" "}</ExampleText>}
        {<ExampleText>by CI/CD pipeline. </ExampleText>}</p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
