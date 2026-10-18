"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { addDays } from "date-fns"

import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent, CardFooter } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date(EXAMPLE_EPOCH).getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date(EXAMPLE_EPOCH).getFullYear(), new Date(EXAMPLE_EPOCH).getMonth(), 1)
  )

  return (
    <Card className="@container/calendar-presets mx-auto w-full max-w-[300px]" size="sm">
      <CardContent>
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          className="mx-auto p-0 [--cell-size:--spacing(8)] @min-[18rem]/calendar-presets:[--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        {<ExampleText>{[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "3 days", value: 3 },
          { label: "Week", value: 7 },
          { label: "2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(EXAMPLE_EPOCH), preset.value)
              setDate(newDate)
              setCurrentMonth(
                new Date(newDate.getFullYear(), newDate.getMonth(), 1)
              )
            }}
          >
            {<ExampleText>{preset.label}</ExampleText>}
          </Button>
        ))}</ExampleText>}
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
