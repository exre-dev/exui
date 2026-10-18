"use client"


import { ExampleRuntimeProvider, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { addDays } from "date-fns"

import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const today = new Date(EXAMPLE_EPOCH)

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
          disabled={[
            { before: new Date(EXAMPLE_EPOCH) },
            new Date(EXAMPLE_EPOCH),
            { dayOfWeek: [0, 6] },
            {
              from: addDays(today, 14),
              to: addDays(today, 16),
            },
            {
              from: addDays(today, 23),
              to: addDays(today, 24),
            },
          ]}
          excludeDisabled
          mode="range"
        />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
