"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type DropdownNavProps = React.ComponentProps<NonNullable<NonNullable<React.ComponentProps<typeof Calendar>["components"]>["DropdownNav"]>>
type DropdownProps = React.ComponentProps<NonNullable<NonNullable<React.ComponentProps<typeof Calendar>["components"]>["Dropdown"]>>
import { type ChangeEvent, type ChangeEventHandler, useState } from "react"


import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(new Date(EXAMPLE_EPOCH))

  const handleCalendarChange = (
    _value: string | number,
    _e: ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as ChangeEvent<HTMLSelectElement>
    _e(_event)
  }

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
          captionLayout="dropdown-years"
          classNames={{
            nav: "flex items-center w-full absolute top-0 inset-x-0 justify-between pointer-events-none [&>button]:pointer-events-auto",
          }}
          components={{
            DropdownNav: (props: DropdownNavProps) => {
              return (
                <div className="flex w-full items-center justify-center gap-3 [&>span]:text-sm [&>span]:font-medium">
                  {<ExampleText>{props.children}</ExampleText>}
                </div>
              )
            },
            YearsDropdown: (props: DropdownProps) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (value == null || !props.onChange) {
                      return
                    }
                    handleCalendarChange(value, props.onChange)
                  }}
                  value={String(props.value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {<ExampleText>{props.options?.map((option) => (
                      <SelectItem
                        disabled={option.disabled}
                        key={option.value}
                        value={String(option.value)}
                      >
                        {<ExampleText>{option.label}</ExampleText>}
                      </SelectItem>
                    ))}</ExampleText>}
                  </SelectContent>
                </Select>
              )
            },
          }}
          defaultMonth={new Date(EXAMPLE_EPOCH)}
          mode="single"
          onSelect={setDate}
          selected={date}
          startMonth={new Date(1980, 6)}
        />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
