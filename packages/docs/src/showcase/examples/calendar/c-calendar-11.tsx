"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { addDays } from "date-fns"

import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const today = new Date(EXAMPLE_EPOCH)
  const selectedDay = addDays(today, -28)
  const [month, setMonth] = useState(selectedDay)
  const [date, setDate] = useState<Date | undefined>(selectedDay)

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={setDate}
          selected={date}
        />
        <Button
          className="mb-2 ml-4"
          onClick={() => setMonth(today)}
          size="sm"
          variant="outline"
        >
          {<ExampleText>Current month </ExampleText>}</Button>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
