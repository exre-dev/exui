"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import { ScrollArea } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const today = new Date(EXAMPLE_EPOCH)
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)

  // Mock time slots data
  const timeSlots = [
    { available: false, time: "09:00" },
    { available: false, time: "09:30" },
    { available: true, time: "10:00" },
    { available: true, time: "10:30" },
    { available: true, time: "11:00" },
    { available: true, time: "11:30" },
    { available: false, time: "12:00" },
    { available: true, time: "12:30" },
    { available: true, time: "13:00" },
    { available: true, time: "13:30" },
    { available: true, time: "14:00" },
    { available: false, time: "14:30" },
    { available: false, time: "15:00" },
    { available: true, time: "15:30" },
    { available: true, time: "16:00" },
    { available: true, time: "16:30" },
    { available: true, time: "17:00" },
    { available: true, time: "17:30" },
  ]

  return (
    <Card className="@container/calendar-picker w-full max-w-md p-0">
      <CardContent className="p-0">
        <div className="flex flex-col items-center @min-[26rem]/calendar-picker:flex-row @min-[26rem]/calendar-picker:items-stretch">
          <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
            disabled={[{ before: today }]}
            mode="single"
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate)
                setTime(null)
              }
            }}
            selected={date}
          />
          <div className="relative h-48 w-full @min-[26rem]/calendar-picker:h-auto @min-[26rem]/calendar-picker:w-40">
            <div className="absolute inset-0 border-t py-4 @min-[26rem]/calendar-picker:border-t-0">
              <ScrollArea className="h-full @min-[26rem]/calendar-picker:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">
                      {<ExampleText>{format(date, "EEEE, d", { locale: exampleLocale })}</ExampleText>}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 px-5 @min-[26rem]/calendar-picker:grid-cols-1">
                    {<ExampleText>{timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        className="w-full"
                        disabled={!available}
                        key={timeSlot}
                        onClick={() => setTime(timeSlot)}
                        size="sm"
                        variant={time === timeSlot ? "default" : "outline"}
                      >
                        {<ExampleText>{timeSlot}</ExampleText>}
                      </Button>
                    ))}</ExampleText>}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
