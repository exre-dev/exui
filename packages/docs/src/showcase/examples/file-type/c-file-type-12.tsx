"use client"


import { useExampleRuntime, ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import { FileType } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

type ExportFormat = "pdf" | "docx" | "xlsx" | "csv" | "png"

const FORMATS: Array<{
  value: ExportFormat
  title: string
  description: string
}> = [
  {
    value: "pdf",
    title: "PDF document",
    description: "Fixed layout, ready to share or print",
  },
  {
    value: "docx",
    title: "Word document",
    description: "Editable in Word or Google Docs",
  },
  {
    value: "xlsx",
    title: "Excel workbook",
    description: "Every table on its own sheet",
  },
  {
    value: "csv",
    title: "CSV table",
    description: "Plain rows for any data tool",
  },
  {
    value: "png",
    title: "PNG images",
    description: "One image per page, for slides",
  },
]

  function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()

  // A prefix from useId keeps every label paired with its own radio when the
  // picker renders more than once on a page.
  const id = useId()
  // Preselected on purpose: an export always needs a format, so there is no
  // empty state worth showing.
  const [format, setFormat] = useState<ExportFormat>("pdf")
  const [exported, setExported] = useState<ExportFormat | null>(null)

  return (
    <FieldSet className="mx-auto w-full max-w-sm">
      <FieldLegend>{<ExampleText>Export format</ExampleText>}</FieldLegend>
      <FieldDescription>{<ExampleText>Q3 revenue report, 24 pages.</ExampleText>}</FieldDescription>
      {/* The group reports a plain value, narrowed back to the union here. */}
      <RadioGroup
        value={format}
        onValueChange={(value) => setFormat(value as ExportFormat)}
      >
        {<ExampleText>{FORMATS.map((option) => (
          <ExampleRuntimeConsumer key={option.value} render={({id: exampleId}) => (<FieldLabel key={option.value} htmlFor={exampleId(`${id}-${option.value}`)}>
            <Field orientation="horizontal">
              {/*
               * The icon keeps its own accessible name ("DOCX file"): the
               * title beside it is a plain name, not the extension.
               */}
              <FileType type={option.value} />
              <FieldContent>
                <FieldTitle>{<ExampleText>{option.title}</ExampleText>}</FieldTitle>
                <FieldDescription>{<ExampleText>{option.description}</ExampleText>}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={option.value}
                id={exampleId(`${id}-${option.value}`)}
              />
            </Field>
          </FieldLabel>)} />
        ))}</ExampleText>}
      </RadioGroup>
      <div className="flex items-center justify-between gap-3">
        {/* Exporting changes nothing on screen, so the result is announced here. */}
        <p role="status" className="text-muted-foreground min-w-0 text-xs">
          {<ExampleText>{exported ? <>{formatExample("Exported {file}", { file: `q3-revenue-report.${exported}` })}</> : null}</ExampleText>}
        </p>
        <Button type="button" onClick={() => setExported(format)}>
          {<ExampleText>Export </ExampleText>}{<ExampleText>{format.toUpperCase()}</ExampleText>}
        </Button>
      </div>
    </FieldSet>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
