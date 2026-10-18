"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type DateRange = NonNullable<Extract<React.ComponentProps<typeof Calendar>, {mode: "range"}>["selected"]>
import { useState } from "react"
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns"


import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

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
    <Card className="@container/calendar-picker w-full max-w-md p-0">
      <CardContent className="p-0">
        <div className="flex flex-col items-center @min-[24rem]/calendar-picker:flex-row @min-[24rem]/calendar-picker:items-stretch">
          <div className="relative order-1 w-full border-t py-4 @min-[24rem]/calendar-picker:order-none @min-[24rem]/calendar-picker:w-32 @min-[24rem]/calendar-picker:border-t-0">
            <div className="h-full @min-[24rem]/calendar-picker:border-e">
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
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
