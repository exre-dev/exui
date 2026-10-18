"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  TimePicker,
  TimePickerColumns,
  TimePickerPanel,
} from "@exre/exui"

import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"

/* Plain arrays rather than Intl or toLocale*, so the server and the browser
   always print the same summary. */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/* Fixed dates, so the server and every visitor render the same month. */
const FIRST_MONTH = new Date(2026, 9, 1)
const SUGGESTED_DAY = new Date(2026, 9, 14)

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState(SUGGESTED_DAY)
  const [time, setTime] = useState("09:00")
  const [scheduled, setScheduled] = useState<string | null>(null)

  const summary = `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} at ${time}`
  const displaySummary = formatExample("{weekday}, {month} {day} at {time}", { weekday: copyExample(WEEKDAYS[date.getDay()]), month: copyExample(MONTHS[date.getMonth()]), day: date.getDate(), time })
  /* Derived, so changing the day or the time after scheduling reads as a
     new, unsaved choice again. */
  const isScheduled = scheduled === summary

  return (
    <Card className="mx-auto w-fit max-w-full">
      <CardHeader>
        <CardTitle>{<ExampleText>Schedule a post</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>Pick the day and the time it goes live. </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* `required` keeps one day selected, so the summary always has
              a date to show. */}
          <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
            mode="single"
            required
            selected={date}
            onSelect={setDate}
            defaultMonth={FIRST_MONTH}
          />
          <div className="flex justify-center self-stretch max-sm:border-t max-sm:pt-4 sm:border-s sm:ps-4">
            <TimePicker i18n={exampleLocales.timePicker}
              aria-label={copyExample("Publish time")}
              value={time}
              onValueChange={(next) => {
                /* No footer means no Clear, so `next` is never null here. */
                if (next) setTime(next)
              }}
              minuteStep={15}
            >
              <TimePickerPanel className="[--time-picker-rows:7]">
                {/* No footer: Now would set the time but not the date. */}
                <TimePickerColumns />
              </TimePickerPanel>
            </TimePicker>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p role="status" className="me-3 min-w-0 flex-1 text-sm">
          {<ExampleText>{isScheduled && (
            <span className="text-muted-foreground">{<ExampleText>Scheduled for </ExampleText>}</span>
          )}</ExampleText>}
          <span className="font-medium tabular-nums">{<ExampleText><>{displaySummary}</></ExampleText>}</span>
        </p>
        <Button onClick={() => setScheduled(summary)}>{<ExampleText>Schedule</ExampleText>}</Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
