"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { ScrollArea } from "@exre/exui"


  function OriginalPattern() {
  const { locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [date, setDate] = useState<Date | undefined>(new Date(EXAMPLE_EPOCH))
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00")

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60

    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = Array.from(
    { length: 3 },
    (_, i) =>
      new Date(
        new Date(EXAMPLE_EPOCH).getFullYear(),
        new Date(EXAMPLE_EPOCH).getMonth(),
        new Date(EXAMPLE_EPOCH).getDate() + i
      )
  )

  return (
    <Card className="@container/booking w-full max-w-xl gap-0 p-0">
      <CardHeader className="flex h-max items-center justify-start border-b px-4! py-3!">
        <CardTitle>{<ExampleText>Book your appointment</ExampleText>}</CardTitle>
      </CardHeader>
      <CardContent className="relative p-0 @min-[31rem]/booking:pr-48">
        <div className="flex justify-center p-4">
          <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={bookedDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
          />
        </div>
        <div className="inset-y-0 right-0 flex h-60 w-full flex-col gap-4 border-t @min-[31rem]/booking:absolute @min-[31rem]/booking:h-auto @min-[31rem]/booking:w-48 @min-[31rem]/booking:border-t-0 @min-[31rem]/booking:border-l">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
              {<ExampleText>{timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="w-full shadow-none"
                >
                  {<ExampleText>{time}</ExampleText>}
                </Button>
              ))}</ExampleText>}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-4 py-3! @min-[31rem]/booking:flex-row">
        <div className="flex max-w-64 items-center gap-2 text-sm">
          {<ExampleText>{date && selectedTime ? (
            <>
              <CircleCheckIcon className="size-4 shrink-0" />
              <span className="text-sm">
                {<ExampleText>Your meeting is booked for</ExampleText>}{<ExampleText>{" "}</ExampleText>}
                <span className="font-medium">
                  {<ExampleText>{" "}</ExampleText>}
                  {<ExampleText>{date?.toLocaleDateString(exampleLocale.code, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}</ExampleText>}{<ExampleText>{" "}</ExampleText>}
                </span>
                {<ExampleText>at </ExampleText>}<span className="font-medium">{<ExampleText>{selectedTime}</ExampleText>}</span>
              </span>
            </>
          ) : (
            <>{<ExampleText>Select a date and time for your meeting.</ExampleText>}</>
          )}</ExampleText>}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full @min-[31rem]/booking:ml-auto @min-[31rem]/booking:w-auto"
          variant="outline"
        >
          {<ExampleText>Confirm </ExampleText>}</Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
