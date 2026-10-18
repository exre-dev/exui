"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon } from "lucide-react"

import { useEffect, useState } from "react"
import { ExampleDateSelector as DateSelector } from "../_shared/date-selector-runtime"
import {
  formatDateValue,
  type DateSelectorValue,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"
import { Separator } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [value, setValue] = useState<DateSelectorValue | undefined>()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<
    DateSelectorValue | undefined
  >(value)

  const formattedValue = value ? formatDateValue(value) : ""
  const displayText = formattedValue || "Select a date"

  useEffect(() => {
    if (open) {
      setInternalValue(value)
    }
  }, [open, value])

  const handleApply = () => {
    setValue(internalValue)
    setOpen(false)
  }

  const handleCancel = () => {
    setInternalValue(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-56 justify-start">
          <CalendarIcon  />
          {<ExampleText>{displayText}</ExampleText>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto gap-3 p-0" align="start" sideOffset={4}>
        <div className="p-3">
          <DateSelector i18n={exampleLocales.dateSelector}
            value={internalValue}
            onChange={setInternalValue}
            allowRange={true}
            label={copyExample("Due date")}
            inputHint={copyExample("Try: 2025, Q4, 05/10/2025")}
          />
        </div>
        <Separator className="p-0" />
        <div className="flex justify-end gap-2 p-3 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            {<ExampleText>Cancel </ExampleText>}</Button>
          <Button onClick={handleApply}>{<ExampleText>Apply</ExampleText>}</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
