"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, HighlighterIcon, TypeIcon } from "lucide-react"

import { useState } from "react"
import {
  ColorPicker,
  ColorPickerClear,
  ColorPickerContent,
  ColorPickerSwatches,
  ColorPickerTrigger,
} from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import { Separator } from "@exre/exui"
import { Toggle } from "@exre/exui"


const TEXT_COLORS = [
  { value: "#6b7280", label: "Gray" },
  { value: "#dc2626", label: "Red" },
  { value: "#ea580c", label: "Orange" },
  { value: "#ca8a04", label: "Yellow" },
  { value: "#16a34a", label: "Green" },
  { value: "#0d9488", label: "Teal" },
  { value: "#2563eb", label: "Blue" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#db2777", label: "Pink" },
  { value: "#92400e", label: "Brown" },
]

const HIGHLIGHTS = [
  { value: "#fef08a", label: "Yellow" },
  { value: "#bbf7d0", label: "Green" },
  { value: "#bfdbfe", label: "Blue" },
  { value: "#fbcfe8", label: "Pink" },
  { value: "#fed7aa", label: "Orange" },
  { value: "#ddd6fe", label: "Violet" },
  { value: "#99f6e4", label: "Teal" },
  { value: "#fecaca", label: "Red" },
  { value: "#d9f99d", label: "Lime" },
  { value: "#e5e7eb", label: "Gray" },
]

const SWATCH_GRID = "grid-cols-[repeat(5,var(--color-picker-swatch-size))]"

/* A palette menu: presets, then a way back to no color at all. */
function ColorMenu({
  title,
  colors,
  reset,
}: {
  title: string
  colors: typeof TEXT_COLORS
  reset: string
}) {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ColorPickerContent className="w-auto">
      <span className="text-muted-foreground text-xs font-medium">{<ExampleText>{title}</ExampleText>}</span>
      <ColorPickerSwatches
        colors={colors}
        aria-label={copyExample(title)}
        className={SWATCH_GRID}
      />
      <Separator />
      <ColorPickerClear className="justify-start">{<ExampleText>{reset}</ExampleText>}</ColorPickerClear>
    </ColorPickerContent>
  )
}

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [bold, setBold] = useState(false)
  /* `null` is the editor's default ink and no highlight at all. */
  const [ink, setInk] = useState<string | null>(null)
  const [highlight, setHighlight] = useState<string | null>("#fef08a")
  /* Each palette closes on a pick, like an editor menu, and hands focus back
     to its toolbar button. */
  const [menu, setMenu] = useState<"ink" | "highlight" | null>(null)

  return (
    /* Two panels: the toolbar, then the text it formats. */
    <Frame spacing="sm" className="w-full max-w-md">
      <FramePanel>
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            aria-label={copyExample("Bold")}
            pressed={bold}
            onPressedChange={setBold}
          >
            <BoldIcon aria-hidden="true" />
          </Toggle>
          <Separator orientation="vertical" className="my-auto h-4" />
          <ColorPicker i18n={exampleLocales.colorPicker}
            value={ink}
            onValueChange={setInk}
            onValueCommit={() => setMenu(null)}
            open={menu === "ink"}
            onOpenChange={(open) => setMenu(open ? "ink" : null)}
            aria-label={copyExample("Text color")}
          >
            {/* The bar under the glyph shows the current ink. */}
            <ColorPickerTrigger variant="ghost" size="icon-sm">
              <span className="relative flex">
                <TypeIcon aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                  style={{ background: ink ?? "currentColor" }}
                />
              </span>
            </ColorPickerTrigger>
            <ColorMenu
              title={copyExample("Text color")}
              colors={TEXT_COLORS}
              reset="Default color"
            />
          </ColorPicker>
          <ColorPicker i18n={exampleLocales.colorPicker}
            value={highlight}
            onValueChange={setHighlight}
            onValueCommit={() => setMenu(null)}
            open={menu === "highlight"}
            onOpenChange={(open) => setMenu(open ? "highlight" : null)}
            aria-label={copyExample("Highlight color")}
          >
            <ColorPickerTrigger variant="ghost" size="icon-sm">
              <span className="relative flex">
                <HighlighterIcon aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                  style={{ background: highlight ?? "transparent" }}
                />
              </span>
            </ColorPickerTrigger>
            <ColorMenu
              title={copyExample("Highlight")}
              colors={HIGHLIGHTS}
              reset="No highlight"
            />
          </ColorPicker>
        </div>
      </FramePanel>
      <FramePanel>
        <p
          className="text-sm leading-relaxed data-bold:font-semibold"
          data-bold={bold || undefined}
          style={{ color: ink ?? undefined }}
        >
          {<ExampleText>The launch review moves to Thursday.</ExampleText>}{<ExampleText>{" "}</ExampleText>}
          <mark
            className="rounded-sm px-0.5 text-inherit"
            style={{ backgroundColor: highlight ?? "transparent" }}
          >
            {<ExampleText>Bring the final pricing and the onboarding copy </ExampleText>}</mark>{<ExampleText>{" "}</ExampleText>}
          {<ExampleText>so we can sign off before the press embargo lifts. </ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
