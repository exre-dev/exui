"use client"


import { ExampleRuntimeProvider, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(new Date(EXAMPLE_EPOCH))

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
          mode="single"
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
