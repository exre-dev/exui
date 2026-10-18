"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon } from "lucide-react"

import { useId, useState } from "react"
import { format } from "date-fns"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group/pick-date w-60 justify-between"
          id={exampleId(id)}
          variant="outline"
        >
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {<ExampleText>{date ? format(date, "PPP", { locale: exampleLocale }) : "Pick a date"}</ExampleText>}
          </span>
          <CalendarIcon aria-hidden="true" className="opacity-60 transition-opacity group-hover/pick-date:opacity-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)} mode="single" onSelect={setDate} selected={date} />
      </PopoverContent>
    </Popover>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
