"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon, ClockIcon } from "lucide-react"

import { useId, useState } from "react"
import { format } from "date-fns"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"
import { Separator } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date(EXAMPLE_EPOCH).getFullYear(), new Date(EXAMPLE_EPOCH).getMonth(), 12)
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group/pick-date w-60 justify-between"
          id={exampleId(id)}
          variant={"outline"}
        >
          <span className={cn("truncate", date && "text-muted-foreground")}>
            {<ExampleText>{date ? format(date, "PPP", { locale: exampleLocale }) : "Pick a date and time"}</ExampleText>}
          </span>
          <CalendarIcon aria-hidden="true" className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale} defaultMonth={new Date(EXAMPLE_EPOCH)}
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />

        <Separator />

        <FieldGroup className="grid grid-cols-2 gap-2.5">
          <Field className="gap-1.5">
            <FieldLabel htmlFor={exampleId("time-from")}>{<ExampleText>Start Time</ExampleText>}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={exampleId("time-from")}
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <ClockIcon  />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor={exampleId("time-to")}>{<ExampleText>End Time</ExampleText>}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={exampleId("time-to")}
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <ClockIcon  />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
