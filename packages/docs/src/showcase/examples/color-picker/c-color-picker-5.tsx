"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerTrigger,
  getForegroundColor,
} from "@exre/exui"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"


const LABEL_COLORS = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#22c55e", label: "Green" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Pink" },
  { value: "#64748b", label: "Slate" },
]

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [name, setName] = useState("Needs design")
  const [color, setColor] = useState<string | null>("#8b5cf6")
  const custom =
    !!color && !LABEL_COLORS.some((preset) => preset.value === color)
  const ink = color ? getForegroundColor(color) : null

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{<ExampleText>Edit label</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Labels group issues across projects.</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={exampleId("label-name")}>{<ExampleText>Name</ExampleText>}</FieldLabel>
            <Input
              id={exampleId("label-name")}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel id={exampleId("label-color-label")}>{<ExampleText>Color</ExampleText>}</FieldLabel>
            <ColorPicker i18n={exampleLocales.colorPicker} value={color} onValueChange={setColor}>
              <div className="flex items-center gap-3">
                <ColorPickerSwatches
                  colors={LABEL_COLORS}
                  shape="circle"
                  aria-labelledby={exampleId("label-color-label")}
                  className="flex-1"
                />
                {/* The plus opens the full picker; once a custom color is
                    set, it shows that color instead. */}
                <ColorPickerTrigger size="icon-sm" aria-label={copyExample("Custom color")}>
                  {<ExampleText>{custom ? (
                    <ColorPickerSwatch shape="circle" />
                  ) : (
                    <PlusIcon aria-hidden="true" />
                  )}</ExampleText>}
                </ColorPickerTrigger>
                <ColorPickerContent align="end" />
              </div>
            </ColorPicker>
          </Field>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">{<ExampleText>Preview</ExampleText>}</span>
            <Badge
              style={{
                backgroundColor: color ?? undefined,
                color: ink ?? undefined,
              }}
            >
              {<ExampleText>{name.trim() || "Untitled"}</ExampleText>}
            </Badge>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
