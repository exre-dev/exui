"use client"


import { ExampleRuntimeProvider, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useMemo } from "react"
import { Gantt } from "@exre/exui"
import { GanttNav } from "@exre/exui"
import type {
  GanttEvent,
  GanttResource,
} from "@exre/exui"
import { GanttView } from "@exre/exui"
import { addDays, startOfDay, startOfWeek } from "date-fns"

import { Card, CardContent } from "@exre/exui"

/** Two-level white-label delivery tree; bars attach to leaf rows by id. A
 * NODE can carry its own plan too: the Implementation group ghosts a band
 * for the window the whole phase was booked into. */
function buildResources(anchor: Date): GanttResource[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const day = (dayOffset: number) => addDays(week, dayOffset)
  return [
    {
      id: "discovery",
      title: "Discovery",
      children: [
        { id: "kickoff", title: "Kickoff workshop" },
        { id: "requirements", title: "Requirements" },
      ],
    },
    {
      id: "implementation",
      title: "Implementation",
      baselineStart: day(-3),
      baselineEnd: day(6),
      children: [
        { id: "integration", title: "API integration" },
        { id: "migration", title: "Data migration" },
        { id: "hardening", title: "Security hardening" },
      ],
    },
    {
      id: "launch",
      title: "Launch",
      children: [{ id: "handover", title: "Handover" }],
    },
  ]
}

/** Leaf titles for bar labels, resolved from the tree by id. */
function leafTitles(resources: GanttResource[]): Map<string, string> {
  return new Map(
    resources
      .flatMap((group) => group.children ?? [])
      .map((leaf) => [leaf.id, leaf.title])
  )
}

/** As-built fixture around the current week: frozen plan vs actual dates. */
function buildBars(anchor: Date, titles: Map<string, string>): GanttEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const day = (dayOffset: number) => addDays(week, dayOffset)
  // The baseline pair is the plan as it was frozen; start/end is what really
  // happened. Equal baseline instants (plannedDays 0) mark a planned
  // milestone, drawn as a diamond instead of a ghost bar.
  const bar = (
    resourceId: string,
    startOffset: number,
    days: number,
    plannedOffset: number,
    plannedDays: number,
    color: string,
    progress?: number
  ): GanttEvent => ({
    id: `bar-${resourceId}`,
    title: titles.get(resourceId) ?? resourceId,
    start: day(startOffset),
    end: day(startOffset + days),
    baselineStart: day(plannedOffset),
    baselineEnd: day(plannedOffset + plannedDays),
    allDay: true,
    color,
    resourceId,
    progress,
  })

  return [
    // delivered exactly to plan
    bar("kickoff", -9, 2, -9, 2, "var(--color-blue-500, oklch(62.3% 0.214 259.815))", 100),
    // ran a day over its planned window
    bar("requirements", -7, 4, -7, 3, "var(--color-sky-500, oklch(68.5% 0.169 237.323))", 100),
    // started a day late and carried the slip through
    bar("integration", -2, 5, -3, 5, "var(--color-violet-500, oklch(60.6% 0.25 292.717))", 60),
    // tracking a day ahead of plan
    bar("migration", 1, 3, 1, 4, "var(--color-emerald-500, oklch(69.6% 0.17 162.48))", 30),
    // slipped on both ends
    bar("hardening", 4, 4, 3, 3, "var(--color-teal-500, oklch(70.4% 0.14 182.503))", 0),
    // planned milestone (diamond) vs the day the handover actually took
    bar("handover", 9, 1, 8, 0, "var(--color-amber-500, oklch(76.9% 0.188 70.08))"),
  ]
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const resources = useMemo(() => buildResources(new Date(EXAMPLE_EPOCH)), [])
  const bars = useMemo(
    () => buildBars(new Date(EXAMPLE_EPOCH), leafTitles(resources)),
    [resources]
  )

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          {/* baselineBars is on by default: any event carrying baselineStart
              and baselineEnd ghosts its planned window behind the bar, and
              dragging a bar re-times the actual dates while the plan holds
              still. Bars expose data-baseline-variance="early|late|on-time"
              for consumer styling, and the tooltip names the planned range. */}
          <Gantt i18n={exampleLocales.gantt.i18n} locale={exampleLocales.gantt.locale} defaultDate={new Date(EXAMPLE_EPOCH)}
            defaultEvents={bars}
            resources={resources}
            defaultScale="month"
            scheduleMode="single"
            treePanel={{ width: 240 }}
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
