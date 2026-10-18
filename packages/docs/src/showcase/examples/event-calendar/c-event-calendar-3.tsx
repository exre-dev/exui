"use client"

// Calendar preset title ownership: display-only adaptation.
import { createExampleTitleOwnership, ExampleCalendarTitleContent, type ExampleTitleSource } from "../_shared/example-titles"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import { useMemo, useRef, useState } from "react"
import {
  EventCalendar,
  type EventCalendarApi,
} from "@exre/exui"
import { EventCalendarContent } from "@exre/exui"
import {
  EventCalendarNav,
  EventCalendarToolbar,
} from "@exre/exui"
import type {
  CalendarEvent,
  EventCalendarOccurrence,
  EventCalendarSlotInfo,
} from "@exre/exui"
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  setHours,
  startOfDay,
  startOfWeek,
} from "date-fns"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"
import { Switch } from "@exre/exui"


const COLORS = [
  { value: "var(--color-blue-500, oklch(62.3% 0.214 259.815))", label: "Blue" },
  { value: "var(--color-violet-500, oklch(60.6% 0.25 292.717))", label: "Violet" },
  { value: "var(--color-emerald-500, oklch(69.6% 0.17 162.48))", label: "Emerald" },
  { value: "var(--color-amber-500, oklch(76.9% 0.188 70.08))", label: "Amber" },
  { value: "var(--color-rose-500, oklch(64.5% 0.246 16.439))", label: "Rose" },
]

const START_HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7:00 - 19:00
const DURATIONS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
]

/** The one dialog is a create form when `id` is null and an edit form
 *  otherwise - a single working copy the calendar clicks seed. */
interface EventDraft {
  id: string | null
  title: string
  date: Date
  startHour: number
  duration: number
  allDay: boolean
  color: string
}

function buildEvents(anchor: Date): CalendarEvent[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 })
  const at = (dayOffset: number, hour: number) =>
    setHours(addDays(week, dayOffset), hour)
  return [
    {
      id: "kickoff",
      title: "Project kickoff",
      start: at(1, 10),
      end: at(1, 11),
      color: COLORS[0].value,
    },
    {
      id: "1on1",
      title: "1:1 with Mia",
      start: at(2, 14),
      end: at(2, 15),
      color: COLORS[1].value,
    },
    {
      id: "review",
      title: "Design review",
      start: at(4, 11),
      end: at(4, 12),
      color: COLORS[2].value,
    },
    {
      id: "standup",
      title: "Team standup",
      start: at(3, 9),
      end: addMinutes(at(3, 9), 30),
      color: COLORS[3].value,
    },
    {
      id: "interview",
      title: "Candidate interview",
      start: at(5, 13),
      end: at(5, 14),
      color: COLORS[4].value,
    },
    {
      id: "retro",
      title: "Sprint retro",
      start: at(5, 16),
      end: at(5, 17),
      color: COLORS[1].value,
    },
  ]
}

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const events = useMemo(() => buildEvents(new Date(EXAMPLE_EPOCH)), [])
  const titles = useMemo(() => createExampleTitleOwnership(events), [events])
  const titleDraftSource = useRef<ExampleTitleSource | null>(null)
  const titleEdited = useRef(false)

  const apiRef = useRef<EventCalendarApi | null>(null)
  const counter = useRef(0)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EventDraft | null>(null)

  // Seed a blank create draft for a given day - shared by the empty-slot click
  // and the header "Add event" button.
  const seedCreate = (date: Date) => {
    titleDraftSource.current = null
    titleEdited.current = false

    setDraft({
      id: null,
      title: "",
      date: startOfDay(date),
      startHour: 9,
      duration: 60,
      allDay: false,
      color: COLORS[0].value,
    })
    setOpen(true)
  }

  // Empty slot → create draft. Month cells report allDay with no `end`, so the
  // form starts as a sensible timed event the user can adjust.
  const openCreate = (slot: EventCalendarSlotInfo) => seedCreate(slot.date)

  // Event click → seed an edit draft from the event itself (source of truth).
  const openEdit = (occurrence: EventCalendarOccurrence) => {
    const event = occurrence.event
    titleDraftSource.current = event
    titleEdited.current = false

    setDraft({
      id: event.id,
      title: titles.display(event, copyExample),
      date: startOfDay(event.start),
      startHour: event.start.getHours(),
      duration: Math.max(30, differenceInMinutes(event.end, event.start)),
      allDay: event.allDay ?? false,
      color: event.color ?? COLORS[0].value,
    })
    setOpen(true)
  }

  const save = () => {
    const api = apiRef.current
    if (!api || !draft || !draft.title.trim()) return
    const start = draft.allDay
      ? draft.date
      : setHours(draft.date, draft.startHour)
    const end = draft.allDay
      ? addDays(draft.date, 1)
      : addMinutes(start, draft.duration)
    const patch = {
      title: titles.save(titleDraftSource.current, draft.title, titleEdited.current),
      start,
      end,
      allDay: draft.allDay,
      color: draft.color,
    }
    if (draft.id === null) {
      api.addEvent({ id: `evt-${counter.current++}`, ...patch })
    } else {
      api.updateEvent(draft.id, patch)
    }
    setOpen(false)
  }

  const remove = () => {
    const api = apiRef.current
    if (!api || !draft?.id) return
    api.removeEvent(draft.id)
    setOpen(false)
  }

  const isEdit = draft?.id != null

  return (
    <div className="w-full p-4">
      <Card className="w-full py-0">
        <CardContent className="p-0">
          <EventCalendar renderEvent={(props) => <ExampleCalendarTitleContent {...props} title={titles.display(props.occurrence.event, copyExample)} />} renderAgendaEvent={(props) => <ExampleCalendarTitleContent {...props} title={titles.display(props.occurrence.event, copyExample)} />} i18n={exampleLocales.eventCalendar.i18n} locale={exampleLocales.eventCalendar.locale} defaultDate={new Date(EXAMPLE_EPOCH)}
            defaultEvents={events}
            defaultView="month"
            apiRef={apiRef}
            onSlotClick={openCreate}
            onEventClick={(occurrence, e) => {
              // open the editor instead of the built-in selection tint
              e.preventDefault()
              openEdit(occurrence)
            }}
            // the dialog owns creation; drag/resize reschedules and persists
            interactions={{ drag: true, resize: true, selectSlot: false }}
            className="h-[640px] w-full"
          >
            <div className="flex flex-wrap items-center gap-2 pe-2">
              <EventCalendarNav className="min-w-0 flex-1" />
              <EventCalendarToolbar>
                <Button size="sm" onClick={() => seedCreate(new Date(EXAMPLE_EPOCH))}>
                  <PlusIcon className="size-4" aria-hidden="true" />
                  {<ExampleText>Add event </ExampleText>}</Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        {<ExampleText>{draft && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{<ExampleText>{isEdit ? "Edit event" : "New event"}</ExampleText>}</DialogTitle>
              <DialogDescription>
                {<ExampleText>{format(draft.date, "EEEE, MMMM d, yyyy", { locale: exampleLocale })}</ExampleText>}
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={exampleId("ec-crud-title")}>{<ExampleText>Title</ExampleText>}</FieldLabel>
                <Input
                  id={exampleId("ec-crud-title")}
                  placeholder={copyExample("Add a title")}
                  value={draft.title}
                  autoFocus
                  onChange={(e) =>
                    { titleEdited.current = true; setDraft({ ...draft, title: e.target.value }) }
                  }
                />
              </Field>

              <Field>
                <FieldLabel>{<ExampleText>Color</ExampleText>}</FieldLabel>
                <div className="flex gap-2">
                  {<ExampleText>{COLORS.map((color) => (
                    <ExampleRuntimeConsumer key={color.value} render={({copy: copyExample}) => (<button
                      key={color.value}
                      type="button"
                      aria-label={copyExample(color.label)}
                      aria-pressed={draft.color === color.value}
                      onClick={() => setDraft({ ...draft, color: color.value })}
                      style={{ backgroundColor: color.value }}
                      className={cn(
                        "ring-offset-background size-6 rounded-full transition",
                        draft.color === color.value &&
                          "ring-ring ring-2 ring-offset-2"
                      )}
                    />)} />
                  ))}</ExampleText>}
                </div>
              </Field>

              {<ExampleText>{!draft.allDay && (
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor={exampleId("ec-crud-start")}>{<ExampleText>Start</ExampleText>}</FieldLabel>
                    <Select
                      value={String(draft.startHour)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, startHour: Number(value) })
                      }
                    >
                      <SelectTrigger id={exampleId("ec-crud-start")} size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {<ExampleText>{START_HOURS.map((hour) => (
                          <SelectItem key={hour} value={String(hour)}>
                            {<ExampleText>{`${String(hour).padStart(2, "0")}:00`}</ExampleText>}
                          </SelectItem>
                        ))}</ExampleText>}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={exampleId("ec-crud-duration")}>{<ExampleText>Duration</ExampleText>}</FieldLabel>
                    <Select
                      value={String(draft.duration)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, duration: Number(value) })
                      }
                    >
                      <SelectTrigger id={exampleId("ec-crud-duration")} size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {<ExampleText>{DURATIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                          >
                            {<ExampleText>{option.label}</ExampleText>}
                          </SelectItem>
                        ))}</ExampleText>}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}</ExampleText>}

              <Field orientation="horizontal">
                <FieldLabel htmlFor={exampleId("ec-crud-allday")} className="font-normal">
                  {<ExampleText>All day </ExampleText>}</FieldLabel>
                <Switch
                  id={exampleId("ec-crud-allday")}
                  checked={draft.allDay}
                  onCheckedChange={(allDay) => setDraft({ ...draft, allDay })}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="sm:justify-between">
              {<ExampleText>{isEdit ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={remove}
                >
                  {<ExampleText>Delete </ExampleText>}</Button>
              ) : (
                <span />
              )}</ExampleText>}
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    {<ExampleText>Cancel </ExampleText>}</Button>
                </DialogClose>
                <Button size="sm" onClick={save} disabled={!draft.title.trim()}>
                  {<ExampleText>{isEdit ? "Save changes" : "Create event"}</ExampleText>}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}</ExampleText>}
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
