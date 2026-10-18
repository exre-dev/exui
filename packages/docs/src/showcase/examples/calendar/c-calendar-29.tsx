"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon } from "lucide-react"
type DateRange = NonNullable<Extract<React.ComponentProps<typeof Calendar>, {mode: "range"}>["selected"]>
import { useId, useState } from "react"
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns"


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
  const today = new Date(EXAMPLE_EPOCH)
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  }
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  }
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  }
  const monthToDate = {
    from: startOfMonth(today),
    to: today,
  }
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  }
  const yearToDate = {
    from: startOfYear(today),
    to: today,
  }
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  }
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<DateRange | undefined>(last7Days)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group/pick-date w-60 justify-between"
          id={exampleId(id)}
          variant={"outline"}
        >
          <span className={cn("truncate", date && "text-muted-foreground")}>
            {<ExampleText>{date?.from
              ? date.to
                ? `${format(date.from, "LLL dd, y", { locale: exampleLocale })} - ${format(date.to, "LLL dd, y", { locale: exampleLocale })}`
                : format(date.from, "LLL dd, y", { locale: exampleLocale })
              : "Pick a date range"}</ExampleText>}
          </span>
          <CalendarIcon aria-hidden="true" className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="flex max-sm:flex-col">
              <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                <div className="h-full sm:border-e">
                  <div className="flex flex-col px-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate({
                          from: today,
                          to: today,
                        })
                        setMonth(today)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Today </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(yesterday)
                        setMonth(yesterday.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Yesterday </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(last7Days)
                        setMonth(last7Days.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Last 7 days </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(last30Days)
                        setMonth(last30Days.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Last 30 days </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(monthToDate)
                        setMonth(monthToDate.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Month to date </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastMonth)
                        setMonth(lastMonth.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Last month </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(yearToDate)
                        setMonth(yearToDate.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Year to date </ExampleText>}</Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastYear)
                        setMonth(lastYear.to)
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      {<ExampleText>Last year </ExampleText>}</Button>
                  </div>
                </div>
              </div>
              <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
                disabled={[{ after: today }]}
                mode="range"
                month={month}
                onMonthChange={setMonth}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate)
                  }
                }}
                selected={date}
              />
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
