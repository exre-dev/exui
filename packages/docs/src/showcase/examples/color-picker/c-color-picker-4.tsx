"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { ColorPicker } from "@exre/exui"

import { Card, CardContent } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const [overlay, setOverlay] = useState<string | null>("rgb(15 23 42 / 0.55)")

  return (
    <Card className="w-full max-w-sm overflow-hidden pt-0">
      <div className="relative flex h-40 items-end bg-[linear-gradient(135deg,#f97316,#ec4899_45%,#6366f1)] p-5">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: overlay ?? "transparent" }}
        />
        <div className="relative">
          <p className="text-xs font-medium tracking-wide text-white/80 uppercase">
            {<ExampleText>New season </ExampleText>}</p>
          <p className="text-lg font-semibold text-white">{<ExampleText>Spring collection</ExampleText>}</p>
        </div>
      </div>
      <CardContent>
        <Field>
          <FieldLabel id={exampleId("banner-overlay-label")} htmlFor={exampleId("banner-overlay")}>
            {<ExampleText>Banner overlay </ExampleText>}</FieldLabel>
          {/* `alpha` adds the opacity slider and field; `format="rgb"` writes
              the value as rgb(15 23 42 / 0.55), ready for a style prop. */}
          <ColorPicker i18n={exampleLocales.colorPicker}
            id={exampleId("banner-overlay")}
            value={overlay}
            onValueChange={setOverlay}
            alpha
            format="rgb"
            aria-labelledby={exampleId("banner-overlay-label")}
            aria-describedby={exampleId("banner-overlay-description")}
          />
          <FieldDescription id={exampleId("banner-overlay-description")}>
            {<ExampleText>Darken the artwork so the headline stays readable. </ExampleText>}</FieldDescription>
        </Field>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
