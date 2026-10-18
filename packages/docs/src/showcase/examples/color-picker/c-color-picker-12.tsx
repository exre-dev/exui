"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerFields,
  ColorPickerPanel,
  ColorPickerSlider,
  ColorPickerSwatch,
  ColorPickerTrigger,
  formatColor,
  useColorPicker,
} from "@exre/exui"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"

const PROPERTIES = [
  { id: "inspector-fill", label: "Fill", value: "#6366f1" },
  { id: "inspector-stroke", label: "Stroke", value: "#0f172a" },
  { id: "inspector-shadow", label: "Shadow", value: "#0f172a40" },
]

/* Hex and opacity apart, the way design tools print a color. */
function InspectorValue() {
  const { color } = useColorPicker()
  if (!color) return null
  return (
    <>
      <ColorPickerSwatch />
      <span className="font-mono text-xs">
        {<ExampleText>{formatColor({ ...color, alpha: 1 }, "hex")
          .slice(1)
          .toUpperCase()}</ExampleText>}
      </span>
      <span className="text-muted-foreground ms-auto text-xs tabular-nums">
        {<ExampleText>{Math.round(color.alpha * 100)}</ExampleText>}%
      </span>
    </>
  )
}

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>{<ExampleText>Rectangle</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Hero card, 320 by 180</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2.5">
          {<ExampleText>{PROPERTIES.map(({ id, label, value }) => (
            <ExampleRuntimeConsumer key={id} render={({id: exampleId, locales: exampleLocales}) => (<div
              key={id}
              className="grid grid-cols-[3.5rem_1fr] items-center gap-3"
            >
              <span id={exampleId(id)} className="text-muted-foreground text-sm">
                {<ExampleText>{label}</ExampleText>}
              </span>
              <ColorPicker i18n={exampleLocales.colorPicker} defaultValue={value} alpha aria-labelledby={exampleId(id)}>
                <ColorPickerTrigger size="sm" className="w-full">
                  <InspectorValue />
                </ColorPickerTrigger>
                {/* Vertical hue and opacity tracks beside the area, the
                    compact layout of a design tool's inspector. */}
                <ColorPickerContent align="end">
                  <ColorPickerPanel>
                    <div className="flex gap-3">
                      <ColorPickerArea className="h-44 w-auto min-w-0 flex-1" />
                      <ColorPickerSlider
                        channel="hue"
                        orientation="vertical"
                        className="h-44"
                      />
                      <ColorPickerSlider
                        channel="alpha"
                        orientation="vertical"
                        className="h-44"
                      />
                    </div>
                    <ColorPickerFields />
                  </ColorPickerPanel>
                </ColorPickerContent>
              </ColorPicker>
            </div>)} />
          ))}</ExampleText>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
