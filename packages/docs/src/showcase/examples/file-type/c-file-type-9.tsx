"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { XIcon } from "lucide-react"

import { useId, useRef, useState } from "react"
import {
  FileType,
  getFileType,
  getFileTypeCategory,
  type FileTypeVariant,
} from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent, CardFooter } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


// One sample per kind of input getFileType reads: a file name, a path in
// another case, a MIME type, a folder, a well-known name and a URL with a
// query. The long URL goes last, so the wrap never strands a short chip on a
// row of its own.
const SAMPLES = [
  "Q3 report.pdf",
  "photos/IMG_2041.HEIC",
  "video/quicktime",
  "assets/",
  ".env.local",
  "https://example.com/data.csv?v=2",
]

const VARIANTS: { variant: FileTypeVariant; label: string }[] = [
  { variant: "outline", label: "Outline" },
  { variant: "solid", label: "Solid" },
  { variant: "light", label: "Light" },
  { variant: "mono", label: "Mono" },
]

// Only the two fallbacks need words: a value with nothing to resolve draws a
// blank page, and an unknown extension draws a neutral page with its label.
function describe(value: string, type: string) {
  if (!value.trim()) return "Nothing to resolve yet, so it shows a blank page."
  if (type === "empty") {
    return "No extension or known MIME type, so it shows a blank page."
  }
  if (getFileTypeCategory(type) === "file") {
    return "Unknown extension, so it shows a neutral page with its label."
  }
  return null
}

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  // Opens on a sample so the card shows a resolved type; Clear reaches the
  // blank state.
  const [value, setValue] = useState("Q3 report.pdf")

  // getFileType is a pure string parse, so the icons, the readout and the
  // hint all derive from the raw value on each render, with no effect.
  const type = getFileType(value)
  const family = getFileTypeCategory(type)
  const hint = describe(value, type)

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Field>
          <FieldLabel htmlFor={exampleId(`${id}-value`)}>
            {<ExampleText>File name, path, URL or MIME type </ExampleText>}</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              {/* The field already shows the name and the status below
                  announces the result, so this icon is decorative here. */}
              <FileType type={type} size="mini" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              id={exampleId(`${id}-value`)}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={copyExample("invoice.docx or image/png")}
              autoComplete="off"
              spellCheck={false}
            />
            {<ExampleText>{value ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={copyExample("Clear")}
                  onClick={() => {
                    // The button unmounts once the field is empty, so focus
                    // goes back to the field instead of falling to the body.
                    setValue("")
                    inputRef.current?.focus()
                  }}
                >
                  <XIcon aria-hidden="true" />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}</ExampleText>}
          </InputGroup>
        </Field>
        <div
          role="group"
          aria-labelledby={exampleId(`${id}-samples`)}
          className="flex flex-wrap items-center gap-1.5"
        >
          <span
            id={exampleId(`${id}-samples`)}
            className="text-muted-foreground me-1 text-xs"
          >
            {<ExampleText>Try </ExampleText>}</span>
          {<ExampleText>{SAMPLES.map((sample) => (
            <Button
              key={sample}
              variant="outline"
              size="xs"
              className="max-w-full"
              onClick={() => setValue(sample)}
            >
              {/* The span, not the button, truncates: a long URL then ends
                  in an ellipsis on a narrow card instead of overflowing. */}
              <span className="truncate">{<ExampleText>{sample}</ExampleText>}</span>
            </Button>
          ))}</ExampleText>}
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-4 justify-items-center gap-4">
            {<ExampleText>{VARIANTS.map(({ variant, label }) => (
              <div key={variant} className="flex flex-col items-center gap-2">
                <FileType type={type} variant={variant} size="lg" />
                <span className="text-muted-foreground text-xs">{<ExampleText>{label}</ExampleText>}</span>
              </div>
            ))}</ExampleText>}
          </div>
        </CardContent>
        <CardFooter>
          {/* A polite live region holding text only: the icons sit outside
              it, so each change is read once as "Type pdf, Family document". */}
          <div role="status" className="flex min-w-0 flex-1 flex-col gap-1">
            <dl className="flex min-w-0 flex-wrap gap-x-6 gap-y-1">
              <div className="flex min-w-0 gap-2">
                <dt className="text-muted-foreground">{<ExampleText>Type</ExampleText>}</dt>
                <dd className="truncate font-mono">{<ExampleText>{type}</ExampleText>}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">{<ExampleText>Family</ExampleText>}</dt>
                <dd className="font-mono">{<ExampleText>{family}</ExampleText>}</dd>
              </div>
            </dl>
            {<ExampleText>{hint ? (
              <p className="text-muted-foreground text-xs">{<ExampleText>{hint}</ExampleText>}</p>
            ) : null}</ExampleText>}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
