"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CopyIcon, ListIcon, SearchIcon, SendIcon } from "lucide-react"
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
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@exre/exui"

const DOMAIN = "mail.northwind.dev"

const RECORDS = [
  {
    id: "spf",
    label: "SPF",
    type: "TXT",
    name: "mail",
    value: "v=spf1 include:_spf.mailer.dev ~all",
  },
  {
    id: "dkim",
    label: "DKIM",
    type: "CNAME",
    name: "k1._domainkey.mail",
    value: "k1.dkim.mailer.dev",
  },
  {
    id: "dmarc",
    label: "DMARC",
    type: "TXT",
    name: "_dmarc.mail",
    value: "v=DMARC1; p=none; rua=mailto:dmarc@northwind.dev",
  },
]

type Phase = "checking" | "partial" | "rechecking" | "ready"

// The records stay open beside the check that waits on them.
function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()
  const [phase, setPhase] = React.useState<Phase>("checking")
  const [copied, setCopied] = React.useState<string | null>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    const next: Partial<Record<Phase, Phase>> = {
      checking: "partial",
      rechecking: "ready",
    }
    const target = next[phase]
    if (!target) return
    const timer = window.setTimeout(() => setPhase(target), 1600)
    return () => window.clearTimeout(timer)
  }, [phase])

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(null), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
    } catch {
      // Clipboard access is refused outside a secure context. The full value
      // is still in the cell's title.
    }
  }

  const checking = phase === "checking" || phase === "rechecking"
  const verified = phase === "ready"
  const found =
    phase === "partial"
      ? ["spf", "dkim"]
      : verified
        ? RECORDS.map((r) => r.id)
        : []

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <ListIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>
                {formatExample("Add {count} records at your DNS provider", { count: RECORDS.length })}
              </ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            {/* A borderless Card is the outer frame; the table sits flush in it. */}
            <Card className="p-0">
              <CardContent className="p-0">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8 w-16"><ExampleText>Type</ExampleText></TableHead>
                      <TableHead className="h-8 w-28"><ExampleText>Name</ExampleText></TableHead>
                      <TableHead className="h-8"><ExampleText>Value</ExampleText></TableHead>
                      <TableHead className="h-8 w-9">
                        <span className="sr-only"><ExampleText>Copy</ExampleText></span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECORDS.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="py-1.5"><ExampleText>{record.type}</ExampleText></TableCell>
                        <TableCell className="py-1.5">
                          <code className="block truncate text-xs">
                            {record.name}
                          </code>
                        </TableCell>
                        <TableCell className="py-1.5" title={record.value}>
                          <code className="block truncate text-xs">
                            {record.value}
                          </code>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            aria-label={formatExample("Copy the {record} value", { record: record.label })}
                            onClick={() => copy(record.id, record.value)}
                          ><ExampleText>
                            {copied === record.id ? (
                              <CheckIcon aria-hidden="true"
                              />
                            ) : (
                              <CopyIcon aria-hidden="true"
                              />
                            )}
                          </ExampleText></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine
              status={
                checking ? "running" : phase === "partial" ? "error" : undefined
              }
            >
              <TraceIcon>
                <SearchIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>
                {checking
                  ? "Checking DNS for the records"
                  : verified
                    ? "Verified all 3 records"
                    : "Found 2 of 3 records, DMARC is missing"}
              </ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {RECORDS.map((record) => {
                const ok = found.includes(record.id)
                return (
                  <TraceLine
                    key={record.id}
                    status={checking ? "pending" : ok ? undefined : "error"}
                  >
                    <TraceTitle><ExampleText>
                      {checking
                        ? formatExample("Look up {record}", { record: record.label })
                        : ok
                          ? formatExample("{record} resolves", { record: record.label })
                          : formatExample("{record} not found on {name}", { record: record.label, name: record.name })}
                    </ExampleText></TraceTitle>
                  </TraceLine>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status={phase === "ready" ? undefined : "pending"}>
          <TraceIcon>
            <SendIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>
            {phase === "ready"
              ? formatExample("Ready to send from {domain}", { domain: DOMAIN })
              : formatExample("Start sending from {domain}", { domain: DOMAIN })}
          </ExampleText></TraceTitle>
        </TraceLine>
      </Trace>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={phase !== "partial"}
          onClick={() => {
            setPhase("rechecking")
            // The button disables itself, so focus moves to the status line.
            statusRef.current?.focus()
          }}
        ><ExampleText>
          Check DNS again
        </ExampleText></Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground min-w-0 text-xs outline-none"
        ><ExampleText>
          {checking
            ? "Checking"
            : phase === "partial"
              ? "DNS changes can take up to an hour"
              : "Domain verified"}
        </ExampleText></p>
      </div>
      <p role="status" className="sr-only"><ExampleText>
        {copied
          ? formatExample("Copied the {record} value", { record: RECORDS.find((r) => r.id === copied)?.label ?? "" })
          : ""}
      </ExampleText></p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
