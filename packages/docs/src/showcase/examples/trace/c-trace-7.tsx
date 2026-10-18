"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookOpenIcon, PackageIcon, SearchIcon, SparklesIcon, TruckIcon } from "lucide-react"
import * as React from "react"

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

type Lookup = {
  id: string
  pending: string
  running: string
  done: string
  finding: string
  href?: string
  icon: "order" | "truck" | "policy"
}

const LOOKUPS: Lookup[] = [
  {
    id: "order",
    pending: "Look up order #48213",
    running: "Looking up order #48213",
    done: "Looked up order #48213",
    finding: "Shipped Oct 9",
    href: "#",
    icon: "order",
  },
  {
    id: "carrier",
    pending: "Check carrier tracking for 1Z84F0",
    running: "Checking carrier tracking for 1Z84F0",
    done: "Checked carrier tracking for 1Z84F0",
    finding: "Held at Louisville hub",
    icon: "truck",
  },
  {
    id: "policy",
    pending: "Read the late delivery policy",
    running: "Reading the late delivery policy",
    done: "Read the late delivery policy",
    finding: "Section 4.2",
    href: "#",
    icon: "policy",
  },
]

const DRAFTS = [
  "Hi Dana, your order is held in Louisville until Friday. I've refunded your $12 shipping.",
  "Hi Dana, a carrier delay holds your order until Friday. Your $12 shipping is refunded.",
]

// The lookups fold into one row and the draft opens in the row after them.
function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()
  const [draft, setDraft] = React.useState(0)
  // Lookups finished in the current pass. Equal to LOOKUPS.length when idle.
  const [finished, setFinished] = React.useState(LOOKUPS.length)
  const [stepsOpen, setStepsOpen] = React.useState<boolean>()
  const [inserted, setInserted] = React.useState(false)
  const busy = finished < LOOKUPS.length
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    if (!busy) return
    const timer = window.setTimeout(() => setFinished((n) => n + 1), 700)
    return () => window.clearTimeout(timer)
  }, [busy, finished])

  // Both buttons disable while a pass runs, so focus moves to the status line.
  function regenerate() {
    statusRef.current?.focus()
    setInserted(false)
    setStepsOpen(undefined)
    setFinished(0)
    setDraft((n) => (n + 1) % DRAFTS.length)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        {/* Open while the copilot works, folded once it is done, and the
            agent's own click wins either way. */}
        <TraceCollapsible open={stepsOpen ?? busy} onOpenChange={setStepsOpen}>
          <TraceCollapsibleTrigger>
            <TraceLine status={busy ? "running" : undefined}>
              <TraceIcon>
                <SearchIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>
                {busy ? "Checking the order" : "Checked the order and policy"}
              </ExampleText></TraceTitle>
              <TraceDescription><ExampleText>
                {busy
                  ? formatExample("{count} of {total}", { count: finished, total: LOOKUPS.length })
                  : formatExample("{count} lookups", { count: LOOKUPS.length })}
              </ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {LOOKUPS.map((lookup, index) => {
                const state =
                  index < finished
                    ? "done"
                    : index === finished
                      ? "running"
                      : "pending"
                const line = (
                  <TraceLine status={state === "done" ? undefined : state}>
                    <TraceIcon>
                      <LookupGlyph icon={lookup.icon} />
                    </TraceIcon>
                    <TraceTitle><ExampleText>{lookup[state]}</ExampleText></TraceTitle>
                    {state === "done" ? (
                      <TraceDescription><ExampleText>{lookup.finding}</ExampleText></TraceDescription>
                    ) : null}
                  </TraceLine>
                )
                // Only a finished lookup with a record behind it links out.
                return state === "done" && lookup.href ? (
                  <a key={lookup.id} href={lookup.href}><ExampleText>
                    {line}
                  </ExampleText></a>
                ) : (
                  <React.Fragment key={lookup.id}>{line}</React.Fragment>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        {busy ? (
          <TraceLine status="pending">
            <TraceIcon>
              <DraftGlyph />
            </TraceIcon>
            <TraceTitle><ExampleText>Draft a reply to Dana</ExampleText></TraceTitle>
          </TraceLine>
        ) : (
          <TraceCollapsible key={draft} defaultOpen>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <DraftGlyph />
                </TraceIcon>
                <TraceTitle><ExampleText>Drafted a reply to Dana</ExampleText></TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              {/* The reply is what gets sent, so it reads at full contrast
                  inside the muted panel. */}
              <p className="text-foreground text-pretty"><ExampleText>{DRAFTS[draft]}</ExampleText></p>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        )}
      </Trace>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={busy} onClick={() => setInserted(true)}><ExampleText>
          Insert reply
        </ExampleText></Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={regenerate}
        ><ExampleText>
          Regenerate
        </ExampleText></Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground ml-auto text-xs outline-none"
        ><ExampleText>
          {busy
            ? "Drafting a new reply"
            : inserted
              ? "Added to the composer"
              : ""}
        </ExampleText></p>
      </div>
    </div>
  )
}

function DraftGlyph() {
  return (
    <SparklesIcon aria-hidden="true"
    />
  )
}

function LookupGlyph({ icon }: { icon: Lookup["icon"] }) {
  switch (icon) {
    case "order":
      return (
        <PackageIcon aria-hidden="true"
        />
      )
    case "truck":
      return (
        <TruckIcon aria-hidden="true"
        />
      )
    case "policy":
      return (
        <BookOpenIcon aria-hidden="true"
        />
      )
  }
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
