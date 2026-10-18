"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, LoaderCircleIcon } from "lucide-react"
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

type JobState = "done" | "failed" | "running" | "pending"

type Step = { title: string; duration: string; failed?: boolean; log?: string }

type Job = {
  id: string
  title: Record<JobState, string>
  duration?: string
  initial: JobState
  steps?: Partial<Record<JobState, Step[]>>
}

const FAILURE_LOG = `FAIL search-input.test.tsx
  × debounces keystrokes
    onSearch ran 3 times, expected 1
  × cancels the timer on unmount
    onSearch ran after unmount`

const JOBS: Job[] = [
  {
    id: "install",
    title: {
      done: "Installed dependencies",
      failed: "Failed to install dependencies",
      running: "Installing dependencies",
      pending: "Install dependencies",
    },
    duration: "38s",
    initial: "done",
    steps: {
      done: [
        { title: "Restored the pnpm store from cache", duration: "4s" },
        { title: "Ran pnpm install --frozen-lockfile", duration: "31s" },
      ],
    },
  },
  {
    id: "test",
    title: {
      done: "Ran 418 tests",
      failed: "Tests failed, 2 of 418",
      running: "Running 418 tests",
      pending: "Run tests",
    },
    duration: "1m 12s",
    initial: "failed",
    steps: {
      done: [
        { title: "Ran unit tests", duration: "48s" },
        { title: "Ran component tests", duration: "24s" },
      ],
      failed: [
        { title: "Ran unit tests", duration: "48s" },
        {
          title: "Component tests failed",
          duration: "24s",
          failed: true,
          log: FAILURE_LOG,
        },
      ],
    },
  },
  {
    id: "build",
    title: {
      done: "Built the app",
      failed: "Build failed",
      running: "Building the app",
      pending: "Build the app",
    },
    duration: "1m 3s",
    initial: "pending",
  },
  {
    id: "deploy",
    title: {
      done: "Deployed a preview",
      failed: "Preview deploy failed",
      running: "Deploying a preview",
      pending: "Deploy a preview",
    },
    duration: "18s",
    initial: "pending",
  },
]

// Jobs a re-run repeats, in order. Everything before the failure keeps its
// result, which is what re-running only the failed jobs means.
const RERUN = ["test", "build", "deploy"]

function OriginalPattern() {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  // null until the reader re-runs; then how many re-run jobs have finished.
  const [rerun, setRerun] = React.useState<number | null>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  const stateOf = (job: Job): JobState => {
    const index = RERUN.indexOf(job.id)
    if (rerun === null || index === -1) return job.initial
    return index < rerun ? "done" : index === rerun ? "running" : "pending"
  }

  const states = JOBS.map(stateOf)
  const running = states.includes("running")
  const failed = states.includes("failed")

  React.useEffect(() => {
    if (rerun === null || rerun >= RERUN.length) return
    const timer = window.setTimeout(() => setRerun(rerun + 1), 1800)
    return () => window.clearTimeout(timer)
  }, [rerun])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        {JOBS.map((job, index) => {
          const state = states[index]
          const steps = job.steps?.[state]
          const line = (
            <TraceLine
              status={
                state === "failed"
                  ? "error"
                  : state === "done"
                    ? undefined
                    : state
              }
            >
              <TraceIcon>
                <JobGlyph state={state} />
              </TraceIcon>
              <TraceTitle><ExampleText>{job.title[state]}</ExampleText></TraceTitle>
              {state === "done" || state === "failed" ? (
                <TraceDescription><ExampleText>{job.duration}</ExampleText></TraceDescription>
              ) : null}
            </TraceLine>
          )
          if (!steps)
            return <React.Fragment key={job.id}>{line}</React.Fragment>
          return (
            <TraceCollapsible key={job.id} defaultOpen={state === "failed"}>
              <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  {steps.map((step) =>
                    step.log ? (
                      <TraceCollapsible key={step.title} defaultOpen>
                        <TraceCollapsibleTrigger>
                          <TraceLine status="error">
                            <TraceTitle><ExampleText>{step.title}</ExampleText></TraceTitle>
                            <TraceDescription><ExampleText>{step.duration}</ExampleText></TraceDescription>
                          </TraceLine>
                        </TraceCollapsibleTrigger>
                        <TraceCollapsibleContent>
                          <CodeBlock
                            code={step.log}
                            language="bash"
                            lineLevels={{ error: [2, 4] }}
                            label={copyExample("Failing test output")}
                          />
                        </TraceCollapsibleContent>
                      </TraceCollapsible>
                    ) : (
                      <TraceLine key={step.title}>
                        <TraceTitle><ExampleText>{step.title}</ExampleText></TraceTitle>
                        <TraceDescription><ExampleText>{step.duration}</ExampleText></TraceDescription>
                      </TraceLine>
                    )
                  )}
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          )
        })}
      </Trace>
      <div className="flex items-center gap-3">
        {/* The button disables itself on click, so focus moves to the line
              that reports the re-run instead of falling back to the page. */}
        <Button
          size="sm"
          variant="outline"
          disabled={!failed}
          onClick={() => {
            setRerun(0)
            statusRef.current?.focus()
          }}
        ><ExampleText>
          Re-run failed jobs
        </ExampleText></Button>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-muted-foreground text-xs outline-none"
        ><ExampleText>
          {failed
            ? "Build and deploy wait on the tests"
            : running
              ? formatExample("Re-running {count} jobs", { count: RERUN.length })
              : "All jobs passed"}
        </ExampleText></p>
      </div>
    </div>
  )
}

function JobGlyph({ state }: { state: JobState }) {
  if (state === "failed") {
    return (
      <CircleXIcon aria-hidden="true"
      />
    )
  }
  if (state === "pending") {
    return (
      <CircleDashedIcon aria-hidden="true"
      />
    )
  }
  if (state === "running") {
    return (
      <LoaderCircleIcon aria-hidden="true"
        className="motion-safe:animate-spin"
      />
    )
  }
  return (
    <CircleCheckIcon aria-hidden="true"
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
