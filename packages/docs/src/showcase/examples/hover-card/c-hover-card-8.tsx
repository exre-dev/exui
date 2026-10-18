"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@exre/exui"


const releases = [
  {
    version: "v3.2.0",
    date: "Feb 5, 2026",
    tag: "Latest",
    tagVariant: "success" as const,
    description:
      "Added real-time collaboration cursors, improved markdown editor performance, and fixed PDF export layout issues.",
  },
  {
    version: "v3.1.4",
    date: "Jan 22, 2026",
    tag: "Patch",
    tagVariant: "destructive" as const,
    description:
      "Resolved a memory leak in the dashboard widgets, patched a security vulnerability in file uploads.",
  },
  {
    version: "v3.1.0",
    date: "Jan 10, 2026",
    tag: "Minor",
    tagVariant: "info" as const,
    description:
      "Introduced API rate limiting dashboard, added webhook retry configuration, and new audit log filters.",
  },
  {
    version: "v3.0.0",
    date: "Dec 15, 2025",
    tag: "Major",
    tagVariant: "warning" as const,
    description:
      "Complete UI redesign with new component library, migrated to edge runtime, and added multi-tenant workspace support.",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [current, setCurrent] = useState(0)

  const handleNext = () => {
    if (current < releases.length - 1) {
      setCurrent(current + 1)
    }
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1)
    }
  }

  const isFirst = current === 0
  const isLast = current === releases.length - 1
  const release = releases[current]

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger className="text-primary cursor-default text-sm font-medium underline decoration-dashed decoration-1 underline-offset-4">
          {<ExampleText>What's new? </ExampleText>}</HoverCardTrigger>
        <HoverCardContent className="w-72 space-y-1 px-3 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{<ExampleText>{release.version}</ExampleText>}</span>
              <Badge variant={release.tagVariant} size="xs">
                {<ExampleText>{release.tag}</ExampleText>}
              </Badge>
            </div>
            <span className="text-muted-foreground">{<ExampleText>{release.date}</ExampleText>}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {<ExampleText>{release.description}</ExampleText>}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {<ExampleText>{releases.map((_, i) => (
                <span
                  key={i}
                  className={`size-1.5 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}</ExampleText>}
            </div>
            <div className="flex gap-0.5">
              <Button
                aria-label={copyExample("Previous release")}
                className="size-6"
                disabled={isFirst}
                onClick={handlePrev}
                size="icon"
                variant="ghost"
              >
                <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
              </Button>
              <Button
                aria-label={copyExample("Next release")}
                className="size-6"
                disabled={isLast}
                onClick={handleNext}
                size="icon"
                variant="ghost"
              >
                <ArrowRightIcon className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
