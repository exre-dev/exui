import {
  EVENT_CALENDAR_FADE_TRUNCATE,
  cn,
  spansMultipleDays,
  toZoned,
  useEventCalendarSettings,
  useEventCalendarViewConfig,
  zonedStartOfDay,
  type EventCalendarRenderEventProps,
} from "@exre/exui"
import { addDays, format } from "date-fns"
import { RepeatIcon } from "lucide-react"

export interface ExampleTitleSource {
  id: string
  title: string
}

/** Preset identity is explicit; a matching string alone never grants it. */
export function createExampleTitleOwnership(presets: readonly ExampleTitleSource[]) {
  const originals = new Map(presets.map(({ id, title }) => [id, title]))
  return {
    display(event: ExampleTitleSource, copy: (text: string) => string) {
      return originals.get(event.id) === event.title ? copy(event.title) : event.title
    },
    save(source: ExampleTitleSource | null, draft: string, edited: boolean) {
      if (source && !edited) return source.title
      if (source) originals.delete(source.id)
      return draft.trim()
    },
  }
}

/** Content for the public renderEvent/renderAgendaEvent slots, not a replacement
 * event primitive. ExUI retains its chip, focus, drag/resize wiring and handles.
 * The example keeps the source scene's dot, title and time in the same order.
 * `title` is already ownership-aware and must never pass through ExampleText.
 */
export function ExampleCalendarTitleContent({
  occurrence,
  segment,
  view,
  title,
}: EventCalendarRenderEventProps & { title: string }) {
  const settings = useEventCalendarSettings()
  const config = useEventCalendarViewConfig()
  const { i18n, locale, timeZone } = settings
  const start = toZoned(occurrence.start, timeZone)
  const end = toZoned(occurrence.end, timeZone)
  const timeRange = i18n.functions.formatEventTime(start, end, occurrence.allDay, { locale })
  const time = (date: Date) => format(date, i18n.formats.eventTime, { locale })
  const recurring = occurrence.isRecurring
    ? <RepeatIcon aria-hidden="true" className="size-2.5 shrink-0 opacity-70" />
    : null

  if (view === "agenda") {
    const day = zonedStartOfDay(segment.day, timeZone)
    const nextDay = addDays(toZoned(day, timeZone), 1)
    const startsBefore = occurrence.start < day
    const endsAfter = occurrence.end > nextDay
    const agendaTime = occurrence.allDay || (startsBefore && endsAfter)
      ? i18n.labels.allDay
      : endsAfter ? i18n.labels.timeFrom(time(start))
        : startsBefore ? i18n.labels.timeUntil(time(end)) : timeRange
    return <>
      <span className="text-muted-foreground w-40 shrink-0 truncate tabular-nums">{agendaTime}</span>
      <span aria-hidden="true" data-slot="example-event-dot" className="size-2 shrink-0 rounded-full bg-(--ec-event-color)" />
      <span className="truncate text-sm">{title}</span>
      {recurring}
    </>
  }

  const timedGrid = ["week", "day", "days", "resource"].includes(view) &&
    !occurrence.allDay && !spansMultipleDays(occurrence, timeZone)
  const stacked = timedGrid &&
    (segment.endMin ?? 0) - (segment.startMin ?? 0) >= config.compactEventMinutes
  return <>
    {!timedGrid && <span aria-hidden="true" data-slot="example-event-dot" className="-me-0.5 size-1.5 shrink-0 rounded-full bg-(--ec-event-color)" />}
    {recurring}
    <span className={cn("font-medium", stacked ? EVENT_CALENDAR_FADE_TRUNCATE : "truncate")}>{title}</span>
    {!occurrence.allDay && segment.isStart && (
      view === "month"
        ? <span className="text-muted-foreground shrink-0">{time(start)}</span>
        : <span className={cn("text-muted-foreground hidden @[8rem]:inline", stacked ? EVENT_CALENDAR_FADE_TRUNCATE : "truncate")}>{timeRange}</span>
    )}
  </>
}
