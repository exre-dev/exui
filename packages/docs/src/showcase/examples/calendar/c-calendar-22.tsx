"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import { useState } from "react"
import { formatDateRange } from "little-date"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent, CardFooter } from "@exre/exui"


const events = [
  {
    title: "Product Launch",
    start: "2026-01-24T10:00:00",
    end: "2026-01-24T11:30:00",
    colorful: "after:bg-green-500",
  },
  {
    title: "Weekly Standup",
    start: "2026-01-28T13:00:00",
    end: "2026-01-28T13:30:00",
    colorful: "after:bg-yellow-500",
  },
  {
    title: "Code Review Session",
    start: "2026-01-31T15:00:00",
    end: "2026-01-31T16:00:00",
    colorful: "after:bg-blue-500",
  },
]

  function OriginalPattern() {
  const { copy: copyExample, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(new Date(EXAMPLE_EPOCH))

  return (
    <Card className="w-2xs max-w-full py-4">
      <CardContent className="px-4">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full bg-transparent p-0"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4! pt-3! pb-0!">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {<ExampleText>{date?.toLocaleDateString(exampleLocale.code, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}</ExampleText>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title={copyExample("Add Event")}
          >
            <PlusIcon  />
            <span className="sr-only">{<ExampleText>Add Event</ExampleText>}</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {<ExampleText>{events.map((event) => (
            <div
              key={event.title}
              className={cn(
                "bg-muted relative p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1",
                "rounded-md",
                "after:rounded-full",
                event.colorful
              )}
            >
              <div className="font-medium">{<ExampleText>{event.title}</ExampleText>}</div>
              <div className="text-muted-foreground text-xs">
                {<ExampleText>{exampleLocale.code === "en-US"
                  ? formatDateRange(new Date(event.start), new Date(event.end), {
                      locale: exampleLocale.code,
                      today: new Date(EXAMPLE_EPOCH),
                    })
                  : new Intl.DateTimeFormat(exampleLocale.code, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).formatRange(new Date(event.start), new Date(event.end))}</ExampleText>}
              </div>
            </div>
          ))}</ExampleText>}
        </div>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
