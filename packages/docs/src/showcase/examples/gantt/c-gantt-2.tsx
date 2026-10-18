"use client"


import { ExampleRuntimeProvider, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useMemo, useState } from "react"
import { Gantt } from "@exre/exui"
import { GanttNav } from "@exre/exui"
import type {
  GanttEvent,
  GanttResource,
} from "@exre/exui"
import { GanttView } from "@exre/exui"
import { addDays, startOfDay, startOfWeek } from "date-fns"

import { Card, CardContent } from "@exre/exui"

/** Two-level white-label task tree; bars attach to leaf rows by id. */
const INITIAL_RESOURCES: GanttResource[] = [
  {
    id: "planning",
    title: "Planning",
    children: [
      { id: "brief", title: "Project brief" },
      { id: "scope", title: "Scope review" },
    ],
  },
  {
    id: "design",
    title: "Design",
    children: [
      { id: "wireframes", title: "Wireframes" },
      { id: "visual-design", title: "Visual design" },
    ],
  },
  {
    id: "build",
    title: "Build",
    children: [
      { id: "frontend", title: "Frontend" },
      { id: "backend", title: "Backend" },
      { id: "qa", title: "QA pass" },
    ],
  },
]

/** Small white-label fixture built around the current week. */
function buildBars(anchor: Date): GanttEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const day = (dayOffset: number) => addDays(week, dayOffset)
  const bar = (
    resourceId: string,
    title: string,
    startOffset: number,
    days: number,
    color: string,
    progress?: number
  ): GanttEvent => ({
    id: `bar-${resourceId}`,
    title,
    start: day(startOffset),
    end: day(startOffset + days),
    allDay: true,
    color,
    resourceId,
    progress,
  })

  return [
    bar("brief", "Project brief", -9, 3, "var(--color-blue-500, oklch(62.3% 0.214 259.815))", 100),
    bar("scope", "Scope review", -6, 2, "var(--color-sky-500, oklch(68.5% 0.169 237.323))", 100),
    bar("wireframes", "Wireframes", -4, 4, "var(--color-violet-500, oklch(60.6% 0.25 292.717))", 80),
    bar("visual-design", "Visual design", 0, 5, "var(--color-purple-500, oklch(62.7% 0.265 303.9))", 35),
    bar("frontend", "Frontend", 3, 7, "var(--color-emerald-500, oklch(69.6% 0.17 162.48))", 10),
    bar("backend", "Backend", 5, 6, "var(--color-teal-500, oklch(70.4% 0.14 182.503))"),
    bar("qa", "QA pass", 12, 4, "var(--color-amber-500, oklch(76.9% 0.188 70.08))"),
  ]
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const bars = useMemo(() => buildBars(new Date(EXAMPLE_EPOCH)), [])
  // Controlled tree so the rows can be dragged into a new order. Wiring
  // onResourceReorder is all it takes to reveal the drag grip on each row.
  const [resources, setResources] = useState<GanttResource[]>(INITIAL_RESOURCES)

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <Gantt i18n={exampleLocales.gantt.i18n} locale={exampleLocales.gantt.locale} defaultDate={new Date(EXAMPLE_EPOCH)}
            defaultEvents={bars}
            resources={resources}
            defaultScale="month"
            treePanel={{ width: 240 }}
            // The proposal carries the whole tree with the move applied, so a
            // reorder is one setState. Return false from here to reject a drop.
            onResourceReorder={(proposal) => setResources(proposal.resources)}
            className="h-[480px] w-full"
          >
            <GanttNav />
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
