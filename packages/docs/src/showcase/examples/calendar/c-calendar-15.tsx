"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { subDays, subMonths, subYears } from "date-fns"

import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const today = new Date(EXAMPLE_EPOCH)
  const yesterday = subDays(today, 1)
  const lastWeek = subDays(today, 7)
  const lastMonth = subMonths(today, 1)
  const lastYear = subYears(today, 1)
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<Date>(today)

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
                    setDate(today)
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
                    setMonth(yesterday)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  {<ExampleText>Yesterday </ExampleText>}</Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastWeek)
                    setMonth(lastWeek)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  {<ExampleText>Last week </ExampleText>}</Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastMonth)
                    setMonth(lastMonth)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  {<ExampleText>Last month </ExampleText>}</Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastYear)
                    setMonth(lastYear)
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
            mode="single"
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
