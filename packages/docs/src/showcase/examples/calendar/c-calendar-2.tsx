"use client"

import * as React from "react"
import { ExampleRuntimeProvider, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type DateRange = NonNullable<Extract<React.ComponentProps<typeof Calendar>, {mode: "range"}>["selected"]>
import { useState } from "react"
import { addDays } from "date-fns"


import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const today = new Date(EXAMPLE_EPOCH)
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 5),
  })

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)} mode="range" onSelect={setDate} selected={date} />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
