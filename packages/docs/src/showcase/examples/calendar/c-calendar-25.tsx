"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon } from "lucide-react"
type DateRange = NonNullable<Extract<React.ComponentProps<typeof Calendar>, {mode: "range"}>["selected"]>
import { useId, useState } from "react"
import { format } from "date-fns"


import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [date, setDate] = useState<DateRange | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group/pick-date w-60 justify-between"
          id={exampleId(id)}
          variant="outline"
        >
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {<ExampleText>{date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: exampleLocale })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: exampleLocale })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: exampleLocale })
              )
            ) : (
              "Pick a date range"
            )}</ExampleText>}
          </span>
          <CalendarIcon aria-hidden="true" className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
              mode="range"
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
