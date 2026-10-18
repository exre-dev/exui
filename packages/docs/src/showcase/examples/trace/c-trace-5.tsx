"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ListChecksIcon, PencilIcon, PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react"
import * as React from "react"

import { Button } from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
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

type Action = "create" | "update" | "destroy"

type Change = { action: Action; address: string; detail?: string }

const CHANGES: Change[] = [
  { action: "create", address: "aws_sqs_queue.invoices" },
  {
    action: "update",
    address: "aws_lambda_function.invoices",
    detail: "+512 MB",
  },
  { action: "destroy", address: "aws_sqs_queue.invoices_v1" },
]

const COUNT_WORDS: Record<Action, { plan: string; done: string }> = {
  create: { plan: "to add", done: "added" },
  update: { plan: "to change", done: "changed" },
  destroy: { plan: "to destroy", done: "destroyed" },
}

// "3 to add, 1 to change, 1 to destroy", the summary terraform itself prints.
function countLine(tense: "plan" | "done", formatExample: ReturnType<typeof useExampleRuntime>["format"], copyExample: ReturnType<typeof useExampleRuntime>["copy"]) {
  return (Object.keys(COUNT_WORDS) as Action[])
    .map((action) => {
      const n = CHANGES.filter((c) => c.action === action).length
      return n ? formatExample("{count} {word}", { count: n, word: copyExample(COUNT_WORDS[action][tense]) }) : null
    })
    .filter(Boolean)
    .join(", ")
}

// "+3 ~1 -1", the symbols terraform prints beside each resource.
function countSymbols() {
  const symbol: Record<Action, string> = {
    create: "+",
    update: "~",
    destroy: "-",
  }
  return (Object.keys(symbol) as Action[])
    .map((action) => {
      const n = CHANGES.filter((c) => c.action === action).length
      return n ? `${symbol[action]}${n}` : null
    })
    .filter(Boolean)
    .join(" ")
}

const VERBS: Record<Action, [plan: string, running: string, done: string]> = {
  create: ["Create", "Creating", "Created"],
  update: ["Update", "Updating", "Updated"],
  destroy: ["Destroy", "Destroying", "Destroyed"],
}

type Phase = "review" | "applying" | "applied" | "denied"

// The planned rows are the rows that apply: each moves from pending to running
// to done in place.
function OriginalPattern() {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  const [phase, setPhase] = React.useState<Phase>("review")
  const [applied, setApplied] = React.useState(0)
  const statusRef = React.useRef<HTMLParagraphElement>(null)
  const applyRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (phase !== "applying") return
    const timer = window.setTimeout(() => {
      const next = applied + 1
      setApplied(next)
      if (next === CHANGES.length) setPhase("applied")
    }, 900)
    return () => window.clearTimeout(timer)
  }, [phase, applied])

  // The prompt unmounts on either answer, so focus moves to the line that
  // reports what the answer did.
  function answer(next: Phase) {
    setPhase(next)
    window.requestAnimationFrame(() => statusRef.current?.focus())
  }

  const destroyed = CHANGES.filter((c) => c.action === "destroy")

  const summary = {
    review: formatExample("Planned {count} changes", { count: CHANGES.length }),
    applying: formatExample("Applying {count} changes", { count: CHANGES.length }),
    applied: formatExample("Applied {count} changes", { count: CHANGES.length }),
    denied: formatExample("Planned {count} changes, apply denied", { count: CHANGES.length }),
  }[phase]

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <RefreshCwIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Refreshed state for 42 resources</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>11s</ExampleText></TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status={phase === "applying" ? "running" : undefined}>
              <TraceIcon>
                <ListChecksIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>{summary}</ExampleText></TraceTitle>
              {/* Terraform's own change symbols keep the row short; the
                      words are what a screen reader hears. */}
              <TraceDescription>
                <span aria-hidden="true"><ExampleText>{countSymbols()}</ExampleText></span>
                <span className="sr-only"><ExampleText>
                  {countLine(phase === "applied" ? "done" : "plan", formatExample, copyExample)}
                </ExampleText></span>
              </TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {CHANGES.map((change, index) => {
                const [plan, running, done] = VERBS[change.action]
                const isDone = index < applied
                const isRunning = phase === "applying" && index === applied
                return (
                  <TraceLine
                    key={change.address}
                    status={
                      isRunning ? "running" : isDone ? undefined : "pending"
                    }
                  >
                    <TraceIcon>
                      <ActionGlyph action={change.action} />
                    </TraceIcon>
                    <TraceTitle><ExampleText>
                      {isDone ? done : isRunning ? running : plan}{" "}
                      <span className="font-mono"><ExampleText>{change.address}</ExampleText></span>
                    </ExampleText></TraceTitle>
                    {change.detail ? (
                      <TraceDescription><ExampleText>{change.detail}</ExampleText></TraceDescription>
                    ) : null}
                  </TraceLine>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      {/* A pending approval is a question for the reader, not activity, so
            it is an Item outside the trace rather than one more row. */}
      {phase === "review" ? (
        <Item variant="outline" size="sm">
          <ItemContent>
            <ItemTitle>{formatExample("Apply {count} changes to production?", { count: CHANGES.length })}</ItemTitle>
            <ItemDescription>
              {formatExample("Destroys {resources}.", { resources: destroyed.map((c) => c.address).join(", ") })}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="sm"
              variant="outline"
              onClick={() => answer("denied")}
            ><ExampleText>
              Deny
            </ExampleText></Button>
            <Button ref={applyRef} size="sm" onClick={() => answer("applying")}><ExampleText>
              Apply
            </ExampleText></Button>
          </ItemActions>
        </Item>
      ) : null}
      {phase === "review" ? null : (
        <div className="flex items-center gap-3">
          {phase === "applying" ? null : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setApplied(0)
                setPhase("review")
                // This button unmounts with the phase it belongs to, so
                // focus moves to Apply on the prompt that replaces it.
                window.requestAnimationFrame(() => applyRef.current?.focus())
              }}
            ><ExampleText>
              Plan again
            </ExampleText></Button>
          )}
          <p
            ref={statusRef}
            role="status"
            tabIndex={-1}
            className="text-muted-foreground text-xs outline-none"
          ><ExampleText>
            {phase === "applying"
              ? formatExample("Applied {count} of {total}", { count: applied, total: CHANGES.length })
              : phase === "applied"
                ? formatExample("Apply complete: {changes}.", { changes: countLine("done", formatExample, copyExample) })
                : "Apply denied. Nothing was changed."}
          </ExampleText></p>
        </div>
      )}
    </div>
  )
}

function ActionGlyph({ action }: { action: Action }) {
  if (action === "create") {
    return (
      <PlusIcon aria-hidden="true"
      />
    )
  }
  if (action === "update") {
    return (
      <PencilIcon aria-hidden="true"
      />
    )
  }
  return (
    <Trash2Icon aria-hidden="true"
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
