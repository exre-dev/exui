"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type WeekNumberProps = React.ComponentProps<NonNullable<NonNullable<React.ComponentProps<typeof Calendar>["components"]>["WeekNumber"]>>
import { useState } from "react"


import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(new Date(EXAMPLE_EPOCH))

  return (
    <Card className="@container/calendar-week w-full max-w-xs p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
          className="mx-auto [--cell-size:--spacing(7)] @min-[18rem]/calendar-week:[--cell-size:--spacing(8)]"
          components={{
            WeekNumber: ({ week, ...props }: WeekNumberProps) => {
              return (
                <th {...props}>
                  <span className="text-muted-foreground inline-flex size-(--cell-size) items-center justify-center text-sm font-normal">
                    {<ExampleText>{week.weekNumber}</ExampleText>}
                  </span>
                </th>
              )
            },
          }}
          fixedWeeks
          mode="single"
          onSelect={setDate}
          selected={date}
          showWeekNumber
        />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
