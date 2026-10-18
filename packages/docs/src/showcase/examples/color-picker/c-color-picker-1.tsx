"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  ColorPicker,
  ColorPickerPanel,
} from "@exre/exui"

import { Card, CardContent } from "@exre/exui"

const SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
]

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [value, setValue] = useState<string | null>("#6366f1")

  return (
    <Card size="sm" className="w-full max-w-96">
      <CardContent>
        {/* `alpha` adds the opacity slider and field; `swatches` adds the
            presets row under the default panel. */}
        <ColorPicker i18n={exampleLocales.colorPicker}
          value={value}
          onValueChange={setValue}
          alpha
          swatches={SWATCHES}
          aria-label={copyExample("Fill color")}
        >
          <ColorPickerPanel />
        </ColorPicker>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
