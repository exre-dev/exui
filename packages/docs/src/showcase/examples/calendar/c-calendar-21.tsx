"use client"

import * as React from "react"
import { ExampleRuntimeProvider, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type DateRange = NonNullable<Extract<React.ComponentProps<typeof Calendar>, {mode: "range"}>["selected"]>
import { useState } from "react"


import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

const now = new Date(EXAMPLE_EPOCH)
const year = now.getFullYear()
const month = now.getMonth()
const endOfMonth = new Date(year, month + 1, 0).getDate()

const from = new Date(year, month, Math.min(6, endOfMonth))
const to = new Date(year, month, Math.min(18, endOfMonth))

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<DateRange | undefined>({
    from,
    to,
  })

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
          mode="range"
          numberOfMonths={2}
          classNames={{ months: "relative flex flex-wrap gap-4", month: "flex w-max flex-col gap-4" }}
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
