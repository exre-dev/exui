"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerFields,
  ColorPickerWheel,
} from "@exre/exui"

import { Card, CardContent } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [value, setValue] = useState<string | null>("#f43f5e")

  return (
    <Card className="w-fit">
      <CardContent>
        <div className="flex flex-col items-center gap-5">
          <ColorPicker i18n={exampleLocales.colorPicker}
            value={value}
            onValueChange={setValue}
            aria-label={copyExample("Brush")}
          >
            {/* The area fills the square inside the ring: hue on the ring,
                saturation and brightness in the middle. */}
            <ColorPickerWheel className="size-56">
              <ColorPickerArea className="size-full" />
            </ColorPickerWheel>
            <ColorPickerFields
              formats={["hex", "rgb", "hsl"]}
              className="w-56"
            />
          </ColorPicker>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
