"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftRightIcon } from "lucide-react"

import { useState } from "react"
import type { CSSProperties } from "react"
import { Badge } from "@exre/exui"
import {
  ColorPicker,
  getContrastRatio,
} from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"


/* WCAG 2.2 thresholds: 4.5 and 7 for body text, 3 for large text. */
const CHECKS = [
  { level: "AA", text: "Body", min: 4.5 },
  { level: "AAA", text: "Body", min: 7 },
  { level: "AA", text: "Large", min: 3 },
]

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [text, setText] = useState<string | null>("#1e3a8a")
  const [background, setBackground] = useState<string | null>("#dbeafe")
  const ratio = text && background ? getContrastRatio(text, background) : null

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{<ExampleText>Contrast checker</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>WCAG ratios for a text and background pair. </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <Frame>
            <FramePanel
              style={
                {
                  "--frame-panel-bg": background ?? undefined,
                  color: text ?? undefined,
                } as CSSProperties
              }
            >
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold">
                  {<ExampleText>Quarterly report is ready </ExampleText>}</p>
                <p className="text-sm">
                  {<ExampleText>Revenue grew 18% on the quarter, led by self-serve plans. </ExampleText>}</p>
              </div>
            </FramePanel>
          </Frame>
          <div className="flex items-end gap-2">
            <Field className="min-w-0 flex-1">
              <FieldLabel id={exampleId("contrast-text-label")} htmlFor={exampleId("contrast-text")}>
                {<ExampleText>Text </ExampleText>}</FieldLabel>
              <ColorPicker i18n={exampleLocales.colorPicker}
                id={exampleId("contrast-text")}
                value={text}
                onValueChange={setText}
                aria-labelledby={exampleId("contrast-text-label")}
              />
            </Field>
            <Button
              variant="outline"
              size="icon"
              aria-label={copyExample("Swap text and background")}
              onClick={() => {
                setText(background)
                setBackground(text)
              }}
            >
              <ArrowLeftRightIcon aria-hidden="true" />
            </Button>
            <Field className="min-w-0 flex-1">
              <FieldLabel
                id={exampleId("contrast-background-label")}
                htmlFor={exampleId("contrast-background")}
              >
                {<ExampleText>Background </ExampleText>}</FieldLabel>
              <ColorPicker i18n={exampleLocales.colorPicker}
                id={exampleId("contrast-background")}
                value={background}
                onValueChange={setBackground}
                aria-labelledby={exampleId("contrast-background-label")}
              />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div role="status">
              <p className="text-3xl font-semibold tabular-nums">
                {<ExampleText>{ratio ? `${ratio.toFixed(2)}:1` : "None"}</ExampleText>}
              </p>
              <p className="text-muted-foreground text-xs">{<ExampleText>Contrast ratio</ExampleText>}</p>
            </div>
            <ul className="flex flex-col items-end gap-1.5">
              {<ExampleText>{CHECKS.map((check) => {
                const pass = ratio !== null && ratio >= check.min
                return (
                  <li
                    key={`${check.level}-${check.text}`}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="text-muted-foreground">
                      {<ExampleText>{check.text}</ExampleText>} {<ExampleText>{check.level}</ExampleText>}
                    </span>
                    <Badge
                      variant={pass ? "success-light" : "destructive-light"}
                    >
                      {<ExampleText>{pass ? "Pass" : "Fail"}</ExampleText>}
                    </Badge>
                  </li>
                )
              })}</ExampleText>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
