"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BrainIcon, CircleStopIcon, PencilIcon, ScrollTextIcon, TerminalIcon } from "lucide-react"
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

type StepKind = "reasoning" | "logs" | "edit" | "test"

type Step = {
  id: string
  kind: StepKind
  running: string
  done: string
  stopped: string
  description?: string
  ms: number
  detail?:
    | { type: "text"; text: string }
    | {
        type: "code"
        code: string
        language: string
        diff?: { added: number[]; removed: number[] }
        errors?: number[]
      }
}

const REASONING =
  "A 502 means the function crashed or timed out. The logs will say which."

const STEPS: Step[] = [
  {
    id: "think",
    kind: "reasoning",
    running: "Thinking",
    done: "Thought for 4s",
    stopped: "Stopped while thinking",
    ms: 0,
    detail: { type: "text", text: REASONING },
  },
  {
    id: "logs",
    kind: "logs",
    running: "Searching logs for POST /api/checkout",
    done: "Searched logs for POST /api/checkout",
    stopped: "Stopped searching logs",
    description: "38 errors",
    ms: 1600,
    detail: {
      type: "code",
      language: "bash",
      errors: [2, 3],
      code: `14:02:11 POST /api/checkout 200 412ms
14:02:19 POST /api/checkout 502 10.0s
14:02:19 Task timed out after 10s`,
    },
  },
  {
    id: "edit",
    kind: "edit",
    running: "Editing app/api/checkout/route.ts",
    done: "Edited app/api/checkout/route.ts",
    stopped: "Stopped editing app/api/checkout/route.ts",
    description: "+3 -1",
    ms: 1800,
    detail: {
      type: "code",
      language: "typescript",
      diff: { added: [2, 3, 4], removed: [1] },
      code: `const rates = await shipping.quote(cart)
const rates = await shipping.quote(cart, {
  signal: AbortSignal.timeout(3000),
})`,
    },
  },
  {
    id: "test",
    kind: "test",
    running: "Running pnpm test checkout",
    done: "Ran pnpm test checkout",
    stopped: "Stopped pnpm test checkout",
    description: "9 passed",
    ms: 2200,
    detail: {
      type: "code",
      language: "bash",
      code: `✓ checkout/route.test.ts (9 tests)
Tests  9 passed`,
    },
  },
]

type RunState = "running" | "stopped" | "done"

function OriginalPattern() {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  const [state, setState] = React.useState<RunState>("running")
  // Steps finished so far. The step at this index is the live one.
  const [finished, setFinished] = React.useState(0)
  const [chars, setChars] = React.useState(0)
  // Only rows the reader has toggled are stored, so `open ?? running` lets a
  // live row open itself and still lets a click win in either direction.
  const [openById, setOpenById] = React.useState<Record<string, boolean>>({})

  const live = state === "running" ? STEPS[finished] : undefined
  const liveText = live?.detail?.type === "text" ? copyExample(live.detail.text) : undefined

  React.useEffect(() => {
    if (!live) return
    // Reasoning streams in 3 characters at a time; tool steps resolve whole.
    if (liveText !== undefined) {
      if (chars < liveText.length) {
        const id = window.setTimeout(() => setChars((value) => value + 3), 24)
        return () => window.clearTimeout(id)
      }
    }
    const id = window.setTimeout(() => {
      const next = finished + 1
      setFinished(next)
      if (next === STEPS.length) setState("done")
    }, live.ms || 600)
    return () => window.clearTimeout(id)
  }, [live, chars, finished, liveText])

  function restart() {
    setFinished(0)
    setChars(0)
    setOpenById({})
    setState("running")
  }

  const shown = STEPS.slice(0, Math.min(finished + 1, STEPS.length))

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        {shown.map((step, index) => {
          const isLive = state === "running" && index === finished
          const wasStopped = state === "stopped" && index === finished
          const title = isLive
            ? step.running
            : wasStopped
              ? step.stopped
              : step.done
          const line = (
            <TraceLine status={isLive ? "running" : undefined}>
              <TraceIcon>
                {wasStopped ? <StopGlyph /> : <StepGlyph kind={step.kind} />}
              </TraceIcon>
              <TraceTitle><ExampleText>{title}</ExampleText></TraceTitle>
              {!isLive && !wasStopped && step.description ? (
                <TraceDescription><ExampleText>{step.description}</ExampleText></TraceDescription>
              ) : null}
            </TraceLine>
          )

          // A step with nothing to show, or one that never produced its
          // output, stays a plain line rather than a trigger that opens empty.
          const hasDetail =
            step.detail &&
            (index < finished || (isLive && step.detail.type === "text"))
          if (!hasDetail || wasStopped) {
            return <React.Fragment key={step.id}>{line}</React.Fragment>
          }

          return (
            <TraceCollapsible
              key={step.id}
              open={openById[step.id] ?? isLive}
              onOpenChange={(open) =>
                setOpenById((current) => ({ ...current, [step.id]: open }))
              }
            >
              <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                {step.detail?.type === "text" ? (
                  <p className="text-pretty"><ExampleText>
                    {isLive
                      ? copyExample(step.detail.text).slice(0, chars)
                      : copyExample(step.detail.text)}
                  </ExampleText></p>
                ) : step.detail ? (
                  <CodeBlock
                    code={step.detail.code}
                    language={step.detail.language}
                    diff={step.detail.diff}
                    lineLevels={
                      step.detail.errors
                        ? { error: step.detail.errors }
                        : undefined
                    }
                    label={formatExample("Output of {step}", { step: copyExample(step.done) })}
                  />
                ) : null}
              </TraceCollapsibleContent>
            </TraceCollapsible>
          )
        })}
      </Trace>
      <div className="flex items-center gap-3">
        {/* One button that swaps its label keeps focus where the reader
              left it, instead of unmounting under the cursor. */}
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            state === "running" ? setState("stopped") : restart()
          }
        ><ExampleText>
          {state === "running" ? "Stop" : "Run again"}
        </ExampleText></Button>
        <p role="status" className="text-muted-foreground text-xs"><ExampleText>
          {state === "done"
            ? formatExample("Finished in {count} steps", { count: STEPS.length })
            : state === "stopped"
              ? "Stopped by you"
              : "Working"}
        </ExampleText></p>
      </div>
    </div>
  )
}

function StepGlyph({ kind }: { kind: StepKind }) {
  switch (kind) {
    case "reasoning":
      return (
        <BrainIcon aria-hidden="true"
        />
      )
    case "logs":
      return (
        <ScrollTextIcon aria-hidden="true"
        />
      )
    case "edit":
      return (
        <PencilIcon aria-hidden="true"
        />
      )
    case "test":
      return (
        <TerminalIcon aria-hidden="true"
        />
      )
  }
}

function StopGlyph() {
  return (
    <CircleStopIcon aria-hidden="true"
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
