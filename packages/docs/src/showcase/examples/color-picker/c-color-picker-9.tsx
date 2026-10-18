"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFields,
  ColorPickerPanel,
  ColorPickerSlider,
  ColorPickerSwatches,
  ColorPickerTrigger,
} from "@exre/exui"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const [color, setColor] = useState<string | null>("#2563eb")
  const [recent, setRecent] = useState([
    "#0f172a",
    "#e11d48",
    "#f59e0b",
    "#10b981",
  ])

  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel id={exampleId("brush-color-label")} htmlFor={exampleId("brush-color")}>
          {<ExampleText>Brush color </ExampleText>}</FieldLabel>
        {/* `onValueCommit` fires once per pick, when a drag is released, so
            dragging across the area adds one recent color, not hundreds. */}
        <ColorPicker i18n={exampleLocales.colorPicker}
          id={exampleId("brush-color")}
          value={color}
          onValueChange={setColor}
          onValueCommit={(next) => {
            if (!next) return
            setRecent((list) =>
              [next, ...list.filter((item) => item !== next)].slice(0, 8)
            )
          }}
          aria-labelledby={exampleId("brush-color-label")}
          aria-describedby={exampleId("brush-color-description")}
        >
          <ColorPickerTrigger />
          <ColorPickerContent>
            <ColorPickerPanel>
              <ColorPickerArea />
              <div className="flex items-center gap-3">
                <ColorPickerEyeDropper />
                <ColorPickerSlider channel="hue" />
              </div>
              <ColorPickerFields />
              <div className="flex flex-col gap-2">
                <span
                  id={exampleId("brush-recent-label")}
                  className="text-muted-foreground text-xs font-medium"
                >
                  {<ExampleText>Recent </ExampleText>}</span>
                <ColorPickerSwatches
                  colors={recent}
                  aria-labelledby={exampleId("brush-recent-label")}
                />
              </div>
            </ColorPickerPanel>
          </ColorPickerContent>
        </ColorPicker>
        <FieldDescription id={exampleId("brush-color-description")}>
          {<ExampleText>Colors you pick are kept under Recent. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
