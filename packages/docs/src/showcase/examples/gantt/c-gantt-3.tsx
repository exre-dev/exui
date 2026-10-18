"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import { useMemo, useRef, useState } from "react"
import {
  Gantt,
  type GanttApi,
} from "@exre/exui"
import {
  GanttNav,
  GanttToolbar,
} from "@exre/exui"
import type {
  GanttEvent,
  GanttResource,
} from "@exre/exui"
import { GanttView } from "@exre/exui"
import { addDays, startOfDay, startOfWeek } from "date-fns"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


/**
 * Yearly roadmap: each workstream is a swimlane group and its multi-month
 * initiatives are the bars. The Backlog group ships with empty rows - the
 * toolbar button schedules the next one onto the timeline.
 */
const RESOURCES: GanttResource[] = [
  {
    id: "platform",
    title: "Platform",
    children: [
      { id: "auth-revamp", title: "Auth Revamp" },
      { id: "api-v2", title: "API v2" },
    ],
  },
  {
    id: "growth",
    title: "Growth",
    children: [
      { id: "onboarding", title: "Onboarding Flow" },
      { id: "referrals", title: "Referral Program" },
    ],
  },
  {
    id: "design-system",
    title: "Design System",
    children: [
      { id: "tokens", title: "Design Tokens" },
      { id: "components", title: "Component Library" },
    ],
  },
  {
    id: "backlog",
    title: "Backlog",
    children: [
      { id: "search", title: "Search Revamp" },
      { id: "billing", title: "Billing v2" },
      { id: "mobile", title: "Mobile App" },
    ],
  },
]

/** Backlog initiatives, scheduled one per click in this order. */
const BACKLOG: Array<{ id: string; title: string; color: string }> = [
  { id: "search", title: "Search Revamp", color: "var(--color-rose-500, oklch(64.5% 0.246 16.439))" },
  { id: "billing", title: "Billing v2", color: "var(--color-amber-500, oklch(76.9% 0.188 70.08))" },
  { id: "mobile", title: "Mobile App", color: "var(--color-cyan-500, oklch(71.5% 0.143 215.221))" },
]

/** Roadmap fixture - initiatives span months so the quarter axis has something
 *  to show, and offsets straddle today so both past and future are visible. */
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
    bar("auth-revamp", "Auth Revamp", -30, 60, "var(--color-blue-500, oklch(62.3% 0.214 259.815))", 100),
    bar("api-v2", "API v2", 20, 90, "var(--color-sky-500, oklch(68.5% 0.169 237.323))", 30),
    bar(
      "onboarding",
      "Onboarding Flow",
      -20,
      60,
      "var(--color-emerald-500, oklch(69.6% 0.17 162.48))",
      80
    ),
    bar("referrals", "Referral Program", 50, 90, "var(--color-teal-500, oklch(70.4% 0.14 182.503))", 0),
    bar("tokens", "Design Tokens", -60, 70, "var(--color-violet-500, oklch(60.6% 0.25 292.717))", 100),
    bar(
      "components",
      "Component Library",
      0,
      120,
      "var(--color-purple-500, oklch(62.7% 0.265 303.9))",
      45
    ),
  ]
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const bars = useMemo(() => buildBars(new Date(EXAMPLE_EPOCH)), [])
  const apiRef = useRef<GanttApi | null>(null)
  // How many backlog initiatives have been scheduled so far.
  const [scheduled, setScheduled] = useState(0)

  // Schedule the next unscheduled backlog initiative onto its (empty) row.
  // The "next" one is derived from the live events, not a captured counter,
  // so it stays correct even if the button is clicked in quick succession.
  const addInitiative = () => {
    const api = apiRef.current
    if (!api) return
    const scheduledIds = new Set(api.getEvents().map((event) => event.id))
    const index = BACKLOG.findIndex(
      (item) => !scheduledIds.has(`bar-${item.id}`)
    )
    if (index === -1) return
    const item = BACKLOG[index]
    const week = startOfWeek(startOfDay(new Date(EXAMPLE_EPOCH)), { weekStartsOn: 0 })
    // Land the scheduled bars in the near-future part of the current quarter so
    // each one is visible the moment it drops onto its row.
    const start = addDays(week, 12 + index * 20)
    api.addEvent({
      id: `bar-${item.id}`,
      title: item.title,
      start,
      end: addDays(start, 24),
      allDay: true,
      color: item.color,
      resourceId: item.id,
    })
    setScheduled((count) => count + 1)
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <Gantt i18n={exampleLocales.gantt.i18n} locale={exampleLocales.gantt.locale} defaultDate={new Date(EXAMPLE_EPOCH)}
            defaultEvents={bars}
            resources={RESOURCES}
            defaultScale="quarter"
            apiRef={apiRef}
            treePanel={{ width: 200 }}
            className="h-[480px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 border-b pe-3">
              <GanttNav className="min-w-0 flex-1 border-b-0" />
              <GanttToolbar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addInitiative}
                  disabled={scheduled >= BACKLOG.length}
                >
                  <PlusIcon className="size-4" aria-hidden="true" />
                  {<ExampleText>Add to roadmap </ExampleText>}</Button>
              </GanttToolbar>
            </div>
            {/* Parent workstream rows carry no bars - summaryBars rolls up the
                child initiatives into one envelope on the group row. */}
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
