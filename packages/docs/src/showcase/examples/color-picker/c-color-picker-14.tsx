"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerInput,
  ColorPickerSwatch,
  formatColor,
  parseColor,
} from "@exre/exui"
import type { ColorPickerColor } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/* Tailwind's blue scale in OKLCH: lightness per step, and chroma relative to
   500. The base color becomes 500 and the curve bends around its lightness. */
const LIGHTNESS = [
  97, 93.2, 88.2, 80.9, 70.7, 62.3, 54.6, 48.8, 42.4, 37.9, 28.2,
]
const CHROMA = [0.07, 0.15, 0.28, 0.47, 0.77, 1, 1.14, 1.14, 0.93, 0.68, 0.43]

function buildScale(base: ColorPickerColor) {
  const oklch = parseColor(formatColor(base, "oklch"))
  if (!oklch) return []
  const [lightness, chroma, hue] = oklch.channels
  return STEPS.map((step, index) => {
    const target = LIGHTNESS[index]
    const l =
      index < 5
        ? 100 - ((100 - target) * (100 - lightness)) / (100 - 62.3)
        : (target * lightness) / 62.3
    const color: ColorPickerColor = {
      space: "oklch",
      channels: [l, chroma * CHROMA[index], hue],
      alpha: 1,
    }
    return { step, value: formatColor(color, "hex") }
  })
}

  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const [base, setBase] = useState<string | null>("#7c3aed")
  const [copied, setCopied] = useState(false)
  const parsed = parseColor(base)
  const scale = parsed ? buildScale(parsed) : []
  const css = scale
    .map(({ step, value }) => `--brand-${step}: ${value};`)
    .join("\n")

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{<ExampleText>Brand scale</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>11 shades from one base color.</ExampleText>}</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            disabled={!css}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(css)
                setCopied(true)
              } catch {
                setCopied(false)
              }
            }}
          >
            {<ExampleText>{copied ? "Copied" : "Copy CSS"}</ExampleText>}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor={exampleId("brand-base")}>{<ExampleText>Base color</ExampleText>}</FieldLabel>
            <ColorPicker i18n={exampleLocales.colorPicker}
              id={exampleId("brand-base")}
              value={base}
              onValueChange={(next) => {
                setBase(next)
                setCopied(false)
              }}
            >
              <ColorPickerInput />
              <ColorPickerContent />
            </ColorPicker>
          </Field>
          <ol className="grid grid-cols-11 gap-1">
            {<ExampleText>{scale.map(({ step, value }) => (
              <ExampleRuntimeConsumer key={step} render={({copy: copyExample}) => (<li key={step} className="flex flex-col items-center gap-1.5">
                <ColorPickerSwatch
                  color={value}
                  aria-label={copyExample(`${step}, ${value}`)}
                  className="h-10 w-full"
                />
                <span className="text-muted-foreground text-[0.625rem] tabular-nums">
                  {<ExampleText>{step}</ExampleText>}
                </span>
              </li>)} />
            ))}</ExampleText>}
          </ol>
          <span role="status" className="sr-only">
            {<ExampleText>{copied ? "CSS variables copied" : ""}</ExampleText>}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
