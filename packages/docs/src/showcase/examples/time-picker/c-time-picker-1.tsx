"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  TimePicker,
  TimePickerPanel,
} from "@exre/exui"

import { Card } from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  /* `HH:mm` in 24-hour time, or `null` once Clear empties it. Preselected
     so each column opens centered on its selected row. */
  const [value, setValue] = useState<string | null>("14:30")

  return (
    <div className="flex flex-col items-center gap-3">
      {/* `py-0` lets the panel sit flush, so it reads like the popover. */}
      <Card className="w-fit py-0">
        <TimePicker i18n={exampleLocales.timePicker}
          value={value}
          onValueChange={setValue}
          aria-label={copyExample("Meeting time")}
        >
          <TimePickerPanel />
        </TimePicker>
      </Card>
      <p role="status" className="text-muted-foreground text-sm">
        {<ExampleText>{value ? <>{formatExample("Meeting at {time}", { time: value })}</> : "No meeting time set"}</ExampleText>}
      </p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
