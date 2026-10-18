"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftRightIcon, CircleAlertIcon, FileSpreadsheetIcon, UsersIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@exre/exui"

const ERRORS = [
  { row: 12, field: "email", problem: "Missing" },
  { row: 87, field: "phone", problem: "Not a phone number" },
  { row: 233, field: "email", problem: "Invalid domain" },
]

const TOTAL = 2404

// The last step counts up in its description, and rejected rows are a Table
// because they are scanned by row number.
function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()
  const [imported, setImported] = React.useState(0)
  const done = imported >= TOTAL

  React.useEffect(() => {
    if (done) return
    const timer = window.setTimeout(
      () => setImported((n) => Math.min(n + 143, TOTAL)),
      120
    )
    return () => window.clearTimeout(timer)
  }, [imported, done])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <FileSpreadsheetIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Parsed contacts-october.csv</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>2,418 rows</ExampleText></TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <ArrowLeftRightIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Mapped 8 of 9 columns</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>1 ignored</ExampleText></TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <CircleAlertIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Rejected 14 invalid rows</ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <div className="flex flex-col gap-2">
              {/* A borderless Card is the outer frame; the table sits flush in it. */}
              <Card className="p-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-8 w-14"><ExampleText>Row</ExampleText></TableHead>
                        <TableHead className="h-8"><ExampleText>Field</ExampleText></TableHead>
                        <TableHead className="h-8"><ExampleText>Problem</ExampleText></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ERRORS.map((error) => (
                        <TableRow key={error.row}>
                          <TableCell className="py-1.5"><ExampleText>{error.row}</ExampleText></TableCell>
                          <TableCell className="py-1.5">
                            <code className="text-xs">{error.field}</code>
                          </TableCell>
                          <TableCell className="py-1.5"><ExampleText>
                            {error.problem}
                          </ExampleText></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Button variant="link" size="xs" asChild className="self-start">
                <a href="#"><ExampleText>Download all 14 rows as CSV</ExampleText></a>
              </Button>
            </div>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status={done ? undefined : "running"}>
          <TraceIcon>
            <UsersIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>
            {done ? "Imported" : "Importing"} {TOTAL.toLocaleString("en-US")}{" "}
            contacts
          </ExampleText></TraceTitle>
          {/* Only the end result is announced; every tick would flood a
                screen reader with numbers. */}
          <TraceDescription aria-hidden={!done}><ExampleText>
            {done
              ? "in 2.1s"
              : formatExample("{count} of {total}", { count: imported.toLocaleString("en-US"), total: TOTAL.toLocaleString("en-US") })}
          </ExampleText></TraceDescription>
        </TraceLine>
      </Trace>
      <p role="status" className="sr-only"><ExampleText>
        {done ? formatExample("Imported {count} contacts", { count: TOTAL }) : ""}
      </ExampleText></p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
