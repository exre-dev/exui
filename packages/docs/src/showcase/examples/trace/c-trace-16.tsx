"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CornerDownRightIcon, PackageIcon, ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"
import * as React from "react"
import { Badge } from "@exre/exui"

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

type Advisory = {
  id: string
  pkg: string
  version: string
  severity: "high" | "moderate"
  kind: string
  issue: string
  // From apps/web down to the vulnerable package, before and after the fix.
  path: string[]
  fixedPath: string[]
  fix: { action: string; done: string; why: string }
}

const ADVISORIES: Advisory[] = [
  {
    id: "CVE-2024-45296",
    pkg: "path-to-regexp",
    version: "0.1.7",
    severity: "high",
    kind: "ReDoS",
    issue: "Backtracking regex in route parsing, fixed in 0.1.10",
    path: ["express 4.19.2", "path-to-regexp 0.1.7"],
    fixedPath: ["express 4.20.0", "path-to-regexp 0.1.10"],
    fix: {
      action: "Upgrade express to 4.20.0",
      done: "Upgraded express to 4.20.0",
      why: "express 4.19.2 pins 0.1.7, so express itself has to move.",
    },
  },
  {
    id: "CVE-2024-4068",
    pkg: "braces",
    version: "3.0.2",
    severity: "high",
    kind: "Memory exhaustion",
    issue: "No limit on input length, fixed in 3.0.3",
    path: ["lint-staged 15.2.2", "micromatch 4.0.5", "braces 3.0.2"],
    fixedPath: ["lint-staged 15.2.2", "micromatch 4.0.5", "braces 3.0.3"],
    fix: {
      action: "Update the lockfile",
      done: "Updated braces to 3.0.3",
      why: "micromatch asks for ^3.0.2, which already allows 3.0.3.",
    },
  },
  {
    id: "CVE-2024-55565",
    pkg: "nanoid",
    version: "3.3.7",
    severity: "moderate",
    kind: "Predictable IDs",
    issue: "Non-integer sizes weaken the output, fixed in 3.3.8",
    path: ["postcss 8.4.38", "nanoid 3.3.7"],
    fixedPath: ["postcss 8.4.38", "nanoid 3.3.8"],
    fix: {
      action: "Update the lockfile",
      done: "Updated nanoid to 3.3.8",
      why: "postcss asks for ^3.3.7, which already allows 3.3.8.",
    },
  },
]

// The chain decides the fix: a parent that pins the version needs an upgrade,
// a caret range only a lockfile update.
function OriginalPattern() {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  const [fixed, setFixed] = React.useState<string[]>([])
  const [announcement, setAnnouncement] = React.useState("")
  const triggers = React.useRef(new Map<string, HTMLButtonElement>())
  const open = ADVISORIES.filter((a) => !fixed.includes(a.id))
  const high = open.filter((a) => a.severity === "high").length

  function fix(advisory: Advisory) {
    setFixed((current) => [...current, advisory.id])
    setAnnouncement(advisory.fix.done)
    // The button lives in the panel it changes, so focus returns to the row,
    // and the status line says what changed.
    triggers.current.get(advisory.id)?.focus()
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <PackageIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Audited 1,284 dependencies</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>
            {open.length ? formatExample("{count} open, {high} high", { count: open.length, high }) : copyExample("all fixed")}
          </ExampleText></TraceDescription>
        </TraceLine>
        {ADVISORIES.map((advisory) => {
          const done = fixed.includes(advisory.id)
          return (
            <TraceCollapsible key={advisory.id}>
              <TraceCollapsibleTrigger
                ref={(node: HTMLButtonElement | null) => {
                  if (node) triggers.current.set(advisory.id, node)
                  else triggers.current.delete(advisory.id)
                }}
              >
                <TraceLine>
                  <TraceIcon>
                    {done ? (
                      <ShieldCheckIcon aria-hidden="true"
                      />
                    ) : (
                      <ShieldAlertIcon aria-hidden="true"
                      />
                    )}
                  </TraceIcon>
                  <TraceTitle><ExampleText>
                    {done
                      ? advisory.fix.done
                      : formatExample("{kind} in {pkg} {version}", { kind: copyExample(advisory.kind), pkg: advisory.pkg, version: advisory.version })}
                  </ExampleText></TraceTitle>
                  {done ? null : (
                    <Badge
                      variant={
                        advisory.severity === "high"
                          ? "destructive-light"
                          : "warning-light"
                      }
                    >
                      {copyExample(advisory.severity)}
                    </Badge>
                  )}
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <div className="flex flex-col gap-3">
                  <p><ExampleText>{advisory.issue}.</ExampleText></p>
                  <Trace>
                    <TraceLine>
                      <TraceTitle><ExampleText>apps/web</ExampleText></TraceTitle>
                    </TraceLine>
                    {(done ? advisory.fixedPath : advisory.path).map((step) => (
                      <TraceLine key={step}>
                        <TraceIcon>
                          <CornerDownRightIcon aria-hidden="true"
                          />
                        </TraceIcon>
                        <TraceTitle>
                          <code className="text-xs">{step}</code>
                        </TraceTitle>
                      </TraceLine>
                    ))}
                  </Trace>
                  {done ? (
                    <p><ExampleText>{advisory.fix.why}</ExampleText></p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => fix(advisory)}
                      ><ExampleText>
                        {advisory.fix.action}
                      </ExampleText></Button>
                      <code className="text-xs">{advisory.id}</code>
                    </div>
                  )}
                </div>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          )
        })}
      </Trace>
      <p role="status" className="sr-only"><ExampleText>
        {announcement}
      </ExampleText></p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
