"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { WebhookIcon } from "lucide-react"
import * as React from "react"
import { CodeBlock } from "@exre/exui"

import { Button } from "@exre/exui"
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

type Attempt = {
  number: number
  at: string
  ok: boolean
  title?: string
  deliveredMs?: number
  body: string
  language: "json" | "bash"
}

const PAYLOAD = `{
  "id": "evt_3Q9xLm2",
  "type": "invoice.paid",
  "invoice": "in_1Q9xKt",
  "amount_paid": 18400
}`

const HISTORY: Attempt[] = [
  {
    number: 1,
    at: "14:02:11",
    ok: false,
    title: "Attempt 1 timed out after 30s",
    body: "No response from hooks.northwind.dev within 30000 ms",
    language: "bash",
  },
  {
    number: 2,
    at: "14:03:12",
    ok: false,
    title: "Attempt 2 failed with 500",
    body: `{ "error": "database is in recovery mode" }`,
    language: "json",
  },
  {
    number: 3,
    at: "14:07:40",
    ok: true,
    title: "Attempt 3 delivered, 200 in 214 ms",
    deliveredMs: 214,
    body: PAYLOAD,
    language: "json",
  },
]

// Resend appends an attempt instead of replacing the last one.
function OriginalPattern() {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  const [attempts, setAttempts] = React.useState(HISTORY)
  const [sending, setSending] = React.useState(false)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    if (!sending) return
    const timer = window.setTimeout(() => {
      // The clock is read in the timer, never during render.
      const at = new Date().toLocaleTimeString("en-GB")
      setAttempts((current) => [
        ...current,
        {
          number: current.length + 1,
          at,
          ok: true,
          deliveredMs: 188,
          body: PAYLOAD,
          language: "json",
        },
      ])
      setSending(false)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [sending])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        {/* The newest attempt starts open. defaultOpen applies on mount, so a
            resend opens its own row without closing the previous one. */}
        {attempts.map((attempt, index) => (
          <TraceCollapsible
            key={attempt.number}
            defaultOpen={index === attempts.length - 1}
          >
            <TraceCollapsibleTrigger>
              <TraceLine status={attempt.ok ? undefined : "error"}>
                <TraceIcon>
                  <WebhookIcon aria-hidden="true"
                  />
                </TraceIcon>
                <TraceTitle>{attempt.deliveredMs
                  ? formatExample("Attempt {number} delivered, 200 in {ms} ms", { number: attempt.number, ms: attempt.deliveredMs })
                  : copyExample(attempt.title ?? "")}</TraceTitle>
                <TraceDescription>{attempt.at}</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <CodeBlock
                code={attempt.body}
                language={attempt.language}
                highlight={attempt.language === "json"}
                label={copyExample(attempt.ok ? "Request payload" : "Response")}
                wrap
              />
            </TraceCollapsibleContent>
          </TraceCollapsible>
        ))}
        {sending ? (
          <TraceLine status="running">
            <TraceIcon>
              <WebhookIcon aria-hidden="true"
              />
            </TraceIcon>
            <TraceTitle>{formatExample("Sending attempt {number}", { number: attempts.length + 1 })}</TraceTitle>
          </TraceLine>
        ) : null}
      </Trace>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={sending}
          onClick={() => {
            setSending(true)
            // The button disables itself, so focus moves to the status line.
            statusRef.current?.focus()
          }}
        >
          <ExampleText>Resend event</ExampleText>
        </Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground text-xs outline-none"
        >
          {sending ? copyExample("Sending") : formatExample("{count} attempts", { count: attempts.length })}
        </p>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
