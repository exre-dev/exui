import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CodeIcon, DatabaseIcon, GlobeIcon, ServerIcon } from "lucide-react"
import { Badge } from "@exre/exui"

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

type Span = {
  id: string
  name: string
  // Picks the row's glyph only; the OpenTelemetry span kind is not shown.
  icon: "server" | "database" | "http" | "code"
  ms: number
  error?: boolean
  attributes?: Record<string, string>
  children?: Span[]
}

// Attribute keys follow the current OpenTelemetry semantic conventions.
const ROOT: Span = {
  id: "root",
  name: "POST /api/checkout",
  icon: "server",
  ms: 842,
  children: [
    {
      id: "cart",
      name: "SELECT cart_items",
      icon: "database",
      ms: 96,
      attributes: {
        "db.system.name": "postgresql",
        "db.response.returned_rows": "7",
      },
    },
    {
      id: "reserve-1",
      name: "POST /inventory/reserve",
      icon: "http",
      ms: 34,
      error: true,
      attributes: {
        "http.response.status_code": "409",
        "error.type": "409",
      },
    },
    {
      id: "reserve-2",
      name: "POST /inventory/reserve",
      icon: "http",
      ms: 30,
      attributes: {
        "http.response.status_code": "200",
        "http.request.resend_count": "1",
      },
    },
    {
      id: "payment",
      name: "payments.createIntent",
      icon: "code",
      ms: 610,
      children: [
        {
          id: "payment-http",
          name: "POST /v1/payment_intents",
          icon: "http",
          ms: 598,
          attributes: {
            "server.address": "api.payments.example",
            "http.response.status_code": "200",
          },
        },
      ],
    },
  ],
}

// Self time is a span's duration minus its children's: the span that spent
// the time itself, not a parent that only waited on it.
function slowest(span: Span): { span: Span; self: number } {
  const own = {
    span,
    self: span.ms - (span.children ?? []).reduce((sum, c) => sum + c.ms, 0),
  }
  return (span.children ?? [])
    .map(slowest)
    .reduce((best, next) => (next.self > best.self ? next : best), own)
}

const HOT = slowest(ROOT).span

// Child spans nest inside their parent's row, and the path to the slowest span
// starts open.
function OriginalPattern() {
  return (
    <div className="w-full max-w-md text-sm">
      <Trace>
        <SpanRow span={ROOT} />
      </Trace>
    </div>
  )
}

function contains(span: Span, id: string): boolean {
  return span.id === id || (span.children ?? []).some((c) => contains(c, id))
}

function SpanRow({ span }: { span: Span }) {
  const share = Math.round((span.ms / ROOT.ms) * 100)

  return (
    <TraceCollapsible
      defaultOpen={Boolean(span.children) && contains(span, HOT.id)}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={span.error ? "error" : undefined}>
          <TraceIcon>
            <SpanGlyph icon={span.icon} />
          </TraceIcon>
          <TraceTitle><ExampleText>
            <code className="text-xs">{span.name}</code>
            {span.error ? " failed" : null}
          </ExampleText></TraceTitle>
          <TraceDescription><ExampleText>{span.ms} ms</ExampleText></TraceDescription>
          {span.id === HOT.id ? (
            <Badge variant="warning-light">
              {share}%<span className="sr-only"><ExampleText> of the request time</ExampleText></span>
            </Badge>
          ) : null}
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        {span.children ? (
          <Trace>
            {span.children.map((child) => (
              <SpanRow key={child.id} span={child} />
            ))}
          </Trace>
        ) : (
          <dl className="flex flex-col gap-1 font-mono text-xs">
            {Object.entries(span.attributes ?? {}).map(([key, value]) => (
              <div key={key} className="flex gap-3">
                <dt className="min-w-0 truncate">{key}</dt>
                <dd className="text-foreground ml-auto shrink-0">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function SpanGlyph({ icon }: { icon: Span["icon"] }) {
  switch (icon) {
    case "server":
      return (
        <ServerIcon aria-hidden="true"
        />
      )
    case "database":
      return (
        <DatabaseIcon aria-hidden="true"
        />
      )
    case "http":
      return (
        <GlobeIcon aria-hidden="true"
        />
      )
    case "code":
      return (
        <CodeIcon aria-hidden="true"
        />
      )
  }
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
