"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ListIcon, PlusIcon } from "lucide-react"

import { useMemo, useRef } from "react"
import {
  EventCalendar,
  type EventCalendarApi,
  type EventCalendarRenderEventProps,
} from "@exre/exui"
import { EventCalendarContent } from "@exre/exui"
import {
  EventCalendarNav,
  EventCalendarToolbar,
} from "@exre/exui"
import type {
  CalendarEvent,
  EventCalendarSlotDraft,
} from "@exre/exui"
import { addMinutes, setHours, startOfDay } from "date-fns"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


/** Each service type carries its own Tailwind hue, so the day reads as a
 *  color-coded schedule at a glance. */
const SERVICE = {
  consultation: { label: "Consultation", color: "var(--color-violet-500, oklch(60.6% 0.25 292.717))" },
  followup: { label: "Follow-up", color: "var(--color-sky-500, oklch(68.5% 0.169 237.323))" },
  assessment: { label: "Assessment", color: "var(--color-amber-500, oklch(76.9% 0.188 70.08))" },
  therapy: { label: "Therapy", color: "var(--color-rose-500, oklch(64.5% 0.246 16.439))" },
} as const

type Service = keyof typeof SERVICE

const NEW_COLOR = "var(--color-emerald-500, oklch(69.6% 0.17 162.48))"

interface ApptData {
  client: string
  initials: string
  avatar?: string
  service?: Service
}

/** A consultant's day with color-coded appointments and deliberate gaps to
 *  drag into - anchored to today so the day view opens on real appointments. */
function buildAppointments(anchor: Date): CalendarEvent<ApptData>[] {
  const base = startOfDay(anchor)
  const at = (hour: number, minute = 0) =>
    addMinutes(setHours(base, hour), minute)

  const appt = (
    id: string,
    client: string,
    initials: string,
    avatar: string,
    service: Service,
    startHour: number,
    startMinute: number,
    minutes: number
  ): CalendarEvent<ApptData> => {
    const start = at(startHour, startMinute)
    return {
      id,
      title: client,
      start,
      end: addMinutes(start, minutes),
      color: SERVICE[service].color,
      data: { client, initials, avatar, service },
    }
  }

  return [
    appt(
      "a1",
      "Dana Whitfield",
      "DW",
      "/examples/reui/photos/3bef38aa2e5895dfa7.jpg",
      "consultation",
      9,
      0,
      45
    ),
    appt(
      "a2",
      "Marco Reyes",
      "MR",
      "/examples/reui/photos/a9d5f6142755293a01.jpg",
      "followup",
      11,
      0,
      45
    ),
    appt(
      "a3",
      "Priya Nair",
      "PN",
      "/examples/reui/photos/328edaea61508e7470.jpg",
      "assessment",
      14,
      0,
      60
    ),
    appt(
      "a4",
      "Leon Fischer",
      "LF",
      "/examples/reui/photos/3309f5bd4fd60eae11.jpg",
      "therapy",
      16,
      0,
      45
    ),
  ]
}

/** Richer chip via `renderEvent`: an initials badge, the client name, and - when
 *  the block is tall enough - the service type on a second aligned line. */
function renderChip({
  occurrence,
  segment,
}: EventCalendarRenderEventProps<ApptData>) {
  const data = occurrence.event.data
  if (!data) return undefined
  const service = data.service ? SERVICE[data.service] : null
  const minutes = (segment.endMin ?? 0) - (segment.startMin ?? 0)

  return (
    <ExampleRuntimeConsumer render={({copy: copyExample}) => (<span className="flex h-full w-full min-w-0 flex-col justify-start gap-0.5">
      <span className="flex min-w-0 items-center gap-1.5">
        <Avatar className="size-5 shrink-0">
          {<ExampleText>{data.avatar && <AvatarImage src={data.avatar} alt={copyExample(data.client)} />}</ExampleText>}
          <AvatarFallback className="bg-(--ec-event-color)/25 text-[9px] font-semibold text-(--ec-event-color)">
            {<ExampleText>{data.initials}</ExampleText>}
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-medium">{<ExampleText>{data.client}</ExampleText>}</span>
      </span>
      {<ExampleText>{service && minutes >= 45 && (
        <span className="truncate ps-[1.625rem] text-[11px] font-medium text-(--ec-event-color)">
          {<ExampleText>{service.label}</ExampleText>}
        </span>
      )}</ExampleText>}
    </span>)} />
  )
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const events = useMemo(() => buildAppointments(new Date(EXAMPLE_EPOCH)), [])
  const apiRef = useRef<EventCalendarApi<ApptData> | null>(null)
  const counter = useRef(0)

  // Drag across an open span to book it. The calendar reports the drawn slot
  // but does NOT insert anything - `onSelectSlot` is where the appointment is
  // actually created, so real apps can open a form or hit an API here instead.
  const bookSlot = (slot: EventCalendarSlotDraft) => {
    const api = apiRef.current
    if (!api) return
    api.addEvent({
      id: `appt-${counter.current++}`,
      title: "New appointment",
      start: slot.start,
      end: slot.end,
      color: NEW_COLOR,
      data: { client: "New appointment", initials: "+" },
    })
  }

  // Refuse a draw that would overlap an existing appointment - no
  // double-booking. Returning false cancels the create gesture.
  const canBook = (slot: EventCalendarSlotDraft) => {
    const api = apiRef.current
    if (!api) return true
    return (
      api.findOverlapping({ start: slot.start, end: slot.end }).length === 0
    )
  }

  // Book the first open 45-minute slot in business hours and jump to it - the
  // toolbar shortcut for the same thing the drag gesture does.
  const addAppointment = () => {
    const api = apiRef.current
    if (!api) return
    const base = startOfDay(new Date(EXAMPLE_EPOCH))
    for (let minutes = 9 * 60; minutes + 45 <= 18 * 60; minutes += 30) {
      const start = addMinutes(base, minutes)
      const end = addMinutes(start, 45)
      if (api.findOverlapping({ start, end }).length === 0) {
        api.addEvent({
          id: `appt-${counter.current++}`,
          title: "New appointment",
          start,
          end,
          color: NEW_COLOR,
          data: { client: "New appointment", initials: "+" },
        })
        api.goTo(start)
        return
      }
    }
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <EventCalendar i18n={exampleLocales.eventCalendar.i18n} locale={exampleLocales.eventCalendar.locale} defaultDate={new Date(EXAMPLE_EPOCH)}
            defaultEvents={events}
            defaultView="day"
            dayStartHour={9}
            dayEndHour={18}
            interval={30}
            snapDuration={15}
            apiRef={apiRef}
            renderEvent={renderChip}
            onSelectSlot={bookSlot}
            canSelectSlot={canBook}
            // booking is the whole point: drag an empty span to create; moving
            // and resizing existing appointments stays on for rescheduling
            interactions={{ drag: true, resize: true, selectSlot: true }}
            className="h-[600px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 pe-2">
              {/* the switcher is on: booking lives in the day view, but the week
                  and month give the same appointments a wider context */}
              <EventCalendarNav className="min-w-0 flex-1" />
              <EventCalendarToolbar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => apiRef.current?.setView("agenda")}
                >
                  <ListIcon className="size-4" aria-hidden="true" />
                  {<ExampleText>Agenda </ExampleText>}</Button>
                <Button size="sm" onClick={addAppointment}>
                  <PlusIcon className="size-4" aria-hidden="true" />
                  {<ExampleText>New appointment </ExampleText>}</Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
          <p className="text-muted-foreground border-t px-4 py-3 text-xs">
            {<ExampleText>Drag across an open time to book an appointment. Slots that overlap an existing booking are blocked. </ExampleText>}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
