"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Frame, FramePanel } from "@exre/exui"
import {
  getSignaturePadBounds,
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadSave,
  type SignaturePadFormat,
} from "@exre/exui"

import { buttonVariants } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"

const FORMATS: { format: SignaturePadFormat; label: string; ext: string }[] = [
  { format: "png", label: "PNG", ext: "png" },
  { format: "jpeg", label: "JPEG", ext: "jpg" },
  { format: "svg", label: "SVG", ext: "svg" },
  { format: "json", label: "JSON", ext: "json" },
]

type Result = (typeof FORMATS)[number] & {
  value: string
  width: number
  height: number
}

const PADDING = 16

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample } = useExampleRuntime()

  const [result, setResult] = useState<Result | null>(null)
  const isImage = result !== null && result.format !== "json"

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <SignaturePad onValueChange={() => setResult(null)}>
        <SignaturePadArea className="h-44">
          <SignaturePadGuide />
          <SignaturePadPlaceholder />
        </SignaturePadArea>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonGroup aria-label={copyExample("Export format")}>
            <ButtonGroupText>{<ExampleText>Export</ExampleText>}</ButtonGroupText>
            {<ExampleText>{FORMATS.map((item) => (
              <SignaturePadSave
                key={item.format}
                format={item.format}
                /* Paper-white, so the export reads the same in a dark UI. */
                options={{ background: "#ffffff", padding: PADDING }}
                size="sm"
                onSave={(value, strokes) => {
                  const bounds = getSignaturePadBounds(strokes)
                  setResult({
                    ...item,
                    value,
                    width: Math.ceil((bounds?.width ?? 0) + PADDING * 2),
                    height: Math.ceil((bounds?.height ?? 0) + PADDING * 2),
                  })
                }}
              >
                {<ExampleText>{item.label}</ExampleText>}
              </SignaturePadSave>
            ))}</ExampleText>}
          </ButtonGroup>
          <SignaturePadClear variant="ghost" size="sm" className="ms-auto">
            {<ExampleText>Clear </ExampleText>}</SignaturePadClear>
        </div>
      </SignaturePad>
      <p role="status" className="sr-only">
        {<ExampleText>{result &&
          <>{formatExample("{format} ready, {size} KB", { format: result.label, size: (new Blob([result.value]).size / 1024).toFixed(1) })}</>}</ExampleText>}
      </p>
      {<ExampleText>{result && (
        <Frame spacing="sm">
          <FramePanel>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{<ExampleText>{result.label}</ExampleText>}</span>
                <span
                  aria-hidden="true"
                  className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
                />
                <span className="text-muted-foreground">
                  {<ExampleText>{(new Blob([result.value]).size / 1024).toFixed(1)}</ExampleText>} {<ExampleText> KB </ExampleText>}</span>
                <a
                  href={
                    isImage
                      ? result.value
                      : `data:application/json;charset=utf-8,${encodeURIComponent(result.value)}`
                  }
                  download={`signature.${result.ext}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "xs",
                    className: "ms-auto",
                  })}
                >
                  {<ExampleText>Download </ExampleText>}</a>
              </div>
              {<ExampleText>{isImage ? (
                <img
                  src={result.value}
                  alt={(formatExample("Signature exported as {format}", { format: result.label }))}
                  width={result.width}
                  height={result.height}
                  className="max-h-32 w-auto self-start"
                />
              ) : (
                <p className="text-muted-foreground line-clamp-3 font-mono text-xs break-all">
                  {<ExampleText>{result.value}</ExampleText>}
                </p>
              )}</ExampleText>}
            </div>
          </FramePanel>
        </Frame>
      )}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
