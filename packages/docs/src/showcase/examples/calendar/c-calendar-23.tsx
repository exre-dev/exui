"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type DateRange = NonNullable<Extract<React.ComponentProps<typeof Calendar>, {mode: "range"}>["selected"]>
import { useState } from "react"

import { enUS, zhCN } from "date-fns/locale"

import { Calendar } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const localizedStrings = {
  en: {
    title: "Schedule a meeting",
    description: "Choose your preferred dates",
  },
  zh: {
    title: "安排会议",
    description: "选择您偏好的日期",
  },
} as const

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [locale, setLocale] = useState<keyof typeof localizedStrings>("en")

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 1, 9),
    to: new Date(2026, 1, 17),
  })

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="flex flex-wrap items-center justify-between gap-2 px-3">
        <CardTitle>{<ExampleText>{localizedStrings[locale].title}</ExampleText>}</CardTitle>
        <CardAction>
          <Select
            value={locale}
            onValueChange={(value) =>
              setLocale(value as keyof typeof localizedStrings)
            }
          >
            <SelectTrigger className="w-[60px]" aria-label={copyExample("Select language")}>
              <SelectValue placeholder={copyExample("Language")} />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectItem value="zh">{<ExampleText>Chinese</ExampleText>}</SelectItem>
              <SelectItem value="en">{<ExampleText>English</ExampleText>}</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="border-t px-3 pt-3">
        <Calendar labels={exampleLocales.calendarLabels}
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          defaultMonth={dateRange?.from}
          locale={locale === "zh" ? zhCN : enUS}
          numerals="latn"
          className="w-full bg-transparent p-0"
          buttonVariant="ghost"
        />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
