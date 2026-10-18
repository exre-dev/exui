"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { ExampleDateSelector as DateSelector } from "../_shared/date-selector-runtime"
import {
  type DateSelectorValue,
} from "@exre/exui"
import { format } from "date-fns"

import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const [value, setValue] = useState<DateSelectorValue | undefined>()

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Card className="p-0">
        <CardContent className="p-3">
          <DateSelector i18n={exampleLocales.dateSelector}
            value={value}
            onChange={setValue}
            label={copyExample("Due date")}
            inputHint={copyExample("Try: 2025, Q4, 05/10/2025")}
          />
        </CardContent>
      </Card>

      {<ExampleText>{value ? (
        <pre className="bg-muted w-full overflow-auto rounded-md p-3 font-mono text-xs md:w-[500px]">
          {JSON.stringify(
            value,
            (_key, val) => {
              if (val instanceof Date) {
                return format(val, "MM/dd/yyyy", { locale: exampleLocale })
              }
              return val
            },
            2
          )}
        </pre>
      ) : (
        <div className="text-muted-foreground text-sm">
          {<ExampleText>No value selected. Select a date to see the debug information. </ExampleText>}</div>
      )}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
