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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

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
    if (internalValue) {
      setValue(internalValue)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-56 justify-start">
          <CalendarIcon  />
          {<ExampleText>{displayText}</ExampleText>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{<ExampleText>Select Due Date</ExampleText>}</DialogTitle>
        </DialogHeader>

        <DateSelector i18n={exampleLocales.dateSelector}
          value={internalValue}
          onChange={setInternalValue}
          showInput={true}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
          </DialogClose>
          <Button onClick={handleApply}>{<ExampleText>Apply</ExampleText>}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
