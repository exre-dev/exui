"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import { useMemo, useRef } from "react"
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

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


/**
 * People-centric capacity board: rows are teammates grouped by squad, and
 * each teammate's bars are the week's assignments. The toolbar drops a fresh
 * assignment onto the next teammate, so a person can hold several at once.
 */
const RESOURCES: GanttResource[] = [
  {
    id: "product-squad",
    title: "Product Squad",
    children: [
      { id: "ada", title: "Ada Lovelace" },
      { id: "alan", title: "Alan Turing" },
    ],
  },
  {
    id: "design-squad",
    title: "Design Squad",
    children: [
      { id: "grace", title: "Grace Hopper" },
      { id: "linus", title: "Linus Torvalds" },
    ],
  },
]

/** Avatar photo + initials keyed by person id - GanttResource carries no
 *  custom fields, so per-row presentation data lives in a lookup of your own.
 *  The initials show while the image loads or if it fails. */
const resourceMeta: Record<string, { initials: string; avatar: string }> = {
  ada: {
    initials: "AL",
    avatar: "/examples/reui/photos/3bef38aa2e5895dfa7.jpg",
  },
  alan: {
    initials: "AT",
    avatar: "/examples/reui/photos/a9d5f6142755293a01.jpg",
  },
  grace: {
    initials: "GH",
    avatar: "/examples/reui/photos/328edaea61508e7470.jpg",
  },
  linus: {
    initials: "LT",
    avatar: "/examples/reui/photos/a8b0e2d047ab1351e0.jpg",
  },
}

/** Teammates the new assignments cycle through, and a small pool to name and
 *  color them from. */
const PEOPLE = ["ada", "alan", "grace", "linus"]
const TASK_POOL = [
  { title: "Bug triage", color: "var(--color-amber-500, oklch(76.9% 0.188 70.08))" },
  { title: "Code review", color: "var(--color-rose-500, oklch(64.5% 0.246 16.439))" },
  { title: "Spec draft", color: "var(--color-teal-500, oklch(70.4% 0.14 182.503))" },
  { title: "Pairing", color: "var(--color-indigo-500, oklch(58.5% 0.233 277.117))" },
]

/** This-week assignments per teammate - day-precise bars for a capacity read
 *  (progress omitted; occupancy, not percent-done, is the point here). */
function buildBars(anchor: Date): GanttEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const day = (dayOffset: number) => addDays(week, dayOffset)
  const bar = (
    resourceId: string,
    title: string,
    startOffset: number,
    days: number,
    color: string
  ): GanttEvent => ({
    id: `bar-${resourceId}`,
    title,
    start: day(startOffset),
    end: day(startOffset + days),
    allDay: true,
    color,
    resourceId,
  })

  return [
    bar("ada", "Checkout API", -1, 3, "var(--color-blue-500, oklch(62.3% 0.214 259.815))"),
    bar("alan", "Search Indexing", 0, 3, "var(--color-sky-500, oklch(68.5% 0.169 237.323))"),
    bar("grace", "Dashboard Redesign", 1, 3, "var(--color-violet-500, oklch(60.6% 0.25 292.717))"),
    bar("linus", "Infra Migration", -2, 3, "var(--color-purple-500, oklch(62.7% 0.265 303.9))"),
  ]
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const bars = useMemo(() => buildBars(new Date(EXAMPLE_EPOCH)), [])
  const apiRef = useRef<GanttApi | null>(null)
  // A ref (not state) counts the adds, so it advances synchronously and stays
  // correct even when the button is clicked several times in a row.
  const addedRef = useRef(0)

  // Add a 2-day assignment to the next teammate in rotation. Successive adds
  // to the same person overlap and stack into extra lanes on that row.
  const addAssignment = () => {
    const api = apiRef.current
    if (!api) return
    const n = addedRef.current++
    const person = PEOPLE[n % PEOPLE.length]
    const task = TASK_POOL[n % TASK_POOL.length]
    const week = startOfWeek(startOfDay(new Date(EXAMPLE_EPOCH)), { weekStartsOn: 0 })
    const start = addDays(week, (n % 5) + 1)
    api.addEvent({
      id: `bar-extra-${n}`,
      title: task.title,
      start,
      end: addDays(start, 2),
      allDay: true,
      color: task.color,
      resourceId: person,
    })
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <Gantt i18n={exampleLocales.gantt.i18n} locale={exampleLocales.gantt.locale} defaultDate={new Date(EXAMPLE_EPOCH)}
            defaultEvents={bars}
            resources={RESOURCES}
            defaultScale="week"
            apiRef={apiRef}
            // Weekends shaded so booked working-day capacity is obvious.
            offDays={true}
            treePanel={{ width: 220 }}
            // People rows get an avatar label; group (squad) rows return
            // undefined to keep the default plain-title label.
            renderResourceLabel={({ resource, isGroup }) => {
              if (isGroup) return undefined
              const person = resourceMeta[resource.id]
              return (
                <ExampleRuntimeConsumer render={({copy: copyExample}) => (<span className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarImage src={person?.avatar} alt={copyExample(resource.title)} />
                    <AvatarFallback className="text-[10px]">
                      {<ExampleText>{person?.initials ?? resource.title.charAt(0)}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{<ExampleText>{resource.title}</ExampleText>}</span>
                </span>)} />
              )
            }}
            className="h-[440px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 border-b pe-3">
              <GanttNav className="min-w-0 flex-1 border-b-0" />
              <GanttToolbar>
                <Button variant="outline" size="sm" onClick={addAssignment}>
                  <PlusIcon className="size-4" aria-hidden="true" />
                  {<ExampleText>Add assignment </ExampleText>}</Button>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
