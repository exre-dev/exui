"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import {
  formatTimeValue,
  parseTimeValue,
  TimePicker,
} from "@exre/exui"

import { Field, FieldGroup, FieldLabel } from "@exre/exui"

/* The range cannot cross midnight: the start stops at 23:30, so the shortest
   meeting still ends by 23:45, the last 15-minute slot of the day. */
const STEP = 15
const LATEST_END = 23 * 60 + 45

/* Minutes since midnight, both ways, through the picker's own value format. */
function toMinutes(value: string) {
  const time = parseTimeValue(value)
  return time ? time.hour * 60 + time.minute : 0
}

function fromMinutes(minutes: number) {
  return formatTimeValue({
    hour: Math.floor(minutes / 60),
    minute: minutes % 60,
    second: 0,
  })
}

/* Plain text rather than Intl, so the server and the browser agree. */
function formatDuration(minutes: number, formatExample: ReturnType<typeof useExampleRuntime>["format"]) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return formatExample("{minutes} min", { minutes: rest })
  return rest === 0 ? formatExample("{hours} h", { hours }) : formatExample("{hours} h {minutes} min", { hours, minutes: rest })
}

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [start, setStart] = useState<string | null>("09:00")
  const [end, setEnd] = useState<string | null>("10:00")

  const changeStart = (next: string | null) => {
    setStart(next)
    if (!next || !end) return
    /* The end moves by the same amount, so the meeting keeps its length.
       After a Clear there is no old start to shift from, so the end is only
       pushed past the new start when it would otherwise sit before it. */
    const shift = start ? toMinutes(next) - toMinutes(start) : 0
    const shifted = Math.max(toMinutes(end) + shift, toMinutes(next) + STEP)
    setEnd(fromMinutes(Math.min(shifted, LATEST_END)))
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <FieldGroup className="grid grid-cols-2">
        <Field>
          <FieldLabel id={exampleId(`${id}-start-label`)} htmlFor={exampleId(`${id}-start`)}>
            {<ExampleText>Start </ExampleText>}</FieldLabel>
          <TimePicker i18n={exampleLocales.timePicker}
            id={exampleId(`${id}-start`)}
            minuteStep={STEP}
            max="23:30"
            value={start}
            onValueChange={changeStart}
            aria-labelledby={exampleId(`${id}-start-label`)}
          />
        </Field>
        <Field>
          <FieldLabel id={exampleId(`${id}-end-label`)} htmlFor={exampleId(`${id}-end`)}>
            {<ExampleText>End </ExampleText>}</FieldLabel>
          {/* A `min` that follows the start disables every earlier slot, so
              the duration can never reach zero or go negative. */}
          <TimePicker i18n={exampleLocales.timePicker}
            id={exampleId(`${id}-end`)}
            minuteStep={STEP}
            min={start ? fromMinutes(toMinutes(start) + STEP) : undefined}
            value={end}
            onValueChange={setEnd}
            aria-labelledby={exampleId(`${id}-end-label`)}
          />
        </Field>
      </FieldGroup>
      <p role="status" className="text-muted-foreground text-sm">
        {<ExampleText>{start && end
          ? <>{formatExample("Duration: {duration}", { duration: formatDuration(toMinutes(end) - toMinutes(start), formatExample) })}</>
          : "Pick a start and an end time"}</ExampleText>}
      </p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
