"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Calendar, CalendarDayButton } from "@exre/exui"

function getPriceForDate(date: Date) {
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()

  const val = (seed * 9301 + 49297) % 233280

  return Math.floor(50 + (val / 233280) * 200)
}

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(new Date(EXAMPLE_EPOCH))

  return (
    <div className="@container/calendar-price w-full max-w-sm">
    <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
      mode="single"
      selected={date}
      onSelect={setDate}
      showOutsideDays={false}
      className="mx-auto rounded-lg border [--cell-size:--spacing(8)] @min-[23rem]/calendar-price:[--cell-size:--spacing(12)]"
      components={{
        DayButton: ({ children, modifiers, day, ...props }) => {
          const price = getPriceForDate(day.date)
          const isGreen = price < 100

          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props}>
              {<ExampleText>{children}</ExampleText>}
              {<ExampleText>{!modifiers.outside && (
                <span
                  className={
                    isGreen ? "text-green-600 dark:text-green-400" : ""
                  }
                >
                  ${<ExampleText>{price}</ExampleText>}
                </span>
              )}</ExampleText>}
            </CalendarDayButton>
          )
        },
      }}
    />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
