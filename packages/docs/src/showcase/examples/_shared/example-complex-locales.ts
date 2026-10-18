import {
  DEFAULT_EVENT_CALENDAR_I18N,
  DEFAULT_GANTT_I18N,
  type EventCalendarI18nConfig,
  type GanttI18nConfig,
} from "@exre/exui"
import { format, subMilliseconds, type Locale } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"

// Presentation only: event dates, resource IDs, view values and edit drafts stay
// in the example's own state. date-fns keeps zoned Date subclasses when adjusting
// the exclusive end of a range.
function lastVisibleInstant(start: Date, end: Date) {
  return end.getTime() > start.getTime() ? subMilliseconds(end, 1) : start
}

function chineseDateSpan(start: Date, end: Date, locale: Locale = zhCN) {
  const options = { locale }
  const from = format(start, "yyyy年M月d日", options)
  const to = format(lastVisibleInstant(start, end), "yyyy年M月d日", options)
  return from === to ? from : `${from} — ${to}`
}

function chineseTimeSpan(start: Date, end: Date, locale: Locale = zhCN) {
  const options = { locale }
  const sameDay =
    format(start, "yyyy-MM-dd") ===
    format(lastVisibleInstant(start, end), "yyyy-MM-dd")
  const pattern = sameDay ? "HH:mm" : "yyyy年M月d日 HH:mm"
  return `${format(start, pattern, options)} — ${format(end, pattern, options)}`
}

const eventCalendarEn: EventCalendarI18nConfig = {
  ...DEFAULT_EVENT_CALENDAR_I18N,
  functions: {
    ...DEFAULT_EVENT_CALENDAR_I18N.functions,
    formatEventLabel: (title, timeLabel) => `${title}, ${timeLabel}`,
    formatEventAriaLabel: (title, timeLabel, continues) =>
      `${title}, ${timeLabel}${continues ? ", continues" : ""}`,
  },
}

const eventCalendarZh: EventCalendarI18nConfig = {
  labels: {
    today: "今天",
    previous: "上一个",
    next: "下一个",
    addEvent: "添加日程",
    allDay: "全天",
    more: (count) => `另有 ${count} 项`,
    noEvents: "暂无日程",
    loading: "正在加载日程",
    event: "日程",
    events: (count) => `${count} 项日程`,
    selectView: "选择视图",
    week: (weekNumber) => `第 ${weekNumber} 周`,
    resources: "资源",
    goToDate: "跳转到日期",
    dropNotAllowed: "无法放置在此处",
    continues: "跨时段继续",
    timeFrom: (time) => `${time} 起`,
    timeUntil: (time) => `截至 ${time}`,
    // These are keyboard shortcuts, not translated view values.
    viewShortcuts: {
      month: "M",
      week: "W",
      day: "D",
      days: "5",
      agenda: "A",
      resource: "G",
    },
    toggleDayEvents: (count, expanded) =>
      `${expanded ? "收起" : "展开"} ${count} 项日程`,
    eventDetails: (title) => `查看“${title}”的详情`,
    moreCompact: (count) => `+${count}`,
    timeRange: (from, to) => `${from} — ${to}`,
  },
  viewNames: {
    month: "月",
    week: "周",
    day: "日",
    days: (count) => `${count} 天`,
    agenda: "日程列表",
    resource: "时间网格",
  },
  formats: {
    monthTitle: "yyyy年M月",
    weekTitle: undefined,
    dayTitle: "yyyy年M月d日 EEEE",
    agendaTitle: undefined,
    monthDayHeader: "EEE",
    monthDayHeaderNarrow: "EEEEE",
    timeGridDayHeader: "M月d日 EEE",
    agendaDayHeader: "M月d日 EEEE",
    agendaDayNumber: "d",
    agendaWeekday: "EEE",
    moreDayHeader: "M月d日 EEEE",
    monthCellAriaLabel: "yyyy年M月d日 EEEE",
    dayAria: "yyyy年M月d日 EEEE",
    resourceTitle: "yyyy年M月d日 EEEE",
    timeGutter: "HH:mm",
    timeGutterMinute: "HH:mm",
    eventTime: "HH:mm",
    monthCellDay: "d",
  },
  functions: {
    formatTitle: (view, { date, activeRange, locale = zhCN }) => {
      if (view === "month") return format(date, "yyyy年M月", { locale })
      if (view === "day" || view === "resource") {
        return format(date, "yyyy年M月d日 EEEE", { locale })
      }
      return chineseDateSpan(activeRange.start, activeRange.end, locale)
    },
    formatEventTime: (start, end, allDay, options) =>
      allDay ? "全天" : chineseTimeSpan(start, end, options?.locale),
    formatDayRange: (range, options) =>
      chineseDateSpan(range.start, range.end, options?.locale),
    formatEventLabel: (title, timeLabel) => `${title}，${timeLabel}`,
    formatEventAriaLabel: (title, timeLabel, continues) =>
      `${title}，${timeLabel}${continues ? "，跨时段继续" : ""}`,
  },
}

const ganttZh: GanttI18nConfig = {
  labels: {
    today: "今天",
    previous: "上一个",
    next: "下一个",
    addEvent: "添加日程",
    addTask: "添加任务",
    allDay: "全天",
    loading: "正在加载日程",
    event: "日程",
    events: (count) => `${count} 项日程`,
    week: (weekNumber) => `第 ${weekNumber} 周`,
    resources: "资源",
    goToDate: "跳转到日期",
    scheduleHint: "点击添加安排",
    scheduleHintDrag: "点击或拖动以添加安排",
    reorder: "调整顺序",
    selectView: "选择视图",
    zoomIn: "放大",
    zoomOut: "缩小",
    resizePanel: "调整面板大小",
    jumpToBar: (title) => `滚动到“${title}”`,
    progress: (percent) => `已完成 ${percent}%`,
    durationDays: (days) => `${days} 天`,
    continues: "跨时段继续",
    planned: (rangeLabel) => `计划：${rangeLabel}`,
    milestone: "里程碑",
    scales: {
      day: "日",
      week: "周",
      month: "月",
      quarter: "季度",
      year: "年",
    },
  },
  formats: {
    monthTitle: "yyyy年M月",
    dayTitle: "yyyy年M月d日 EEEE",
    timeGutter: "HH:mm",
    eventTime: "HH:mm",
  },
  functions: {
    formatTitle: (scale, { date, activeRange, locale = zhCN }) => {
      if (scale === "week") {
        return chineseDateSpan(activeRange.start, activeRange.end, locale)
      }
      const patterns = {
        day: "yyyy年M月d日 EEEE",
        month: "yyyy年M月",
        quarter: "yyyy年QQQQ",
        year: "yyyy年",
      }
      return format(date, patterns[scale], { locale })
    },
    formatEventTime: (start, end, allDay, locale = zhCN) => {
      if (start.getTime() === end.getTime()) {
        return format(start, allDay ? "yyyy年M月d日" : "yyyy年M月d日 HH:mm", {
          locale,
        })
      }
      return allDay
        ? chineseDateSpan(start, end, locale)
        : chineseTimeSpan(start, end, locale)
    },
    formatDayRange: (range, locale) =>
      chineseDateSpan(range.start, range.end, locale),
    formatEventAriaLabel: ({
      title,
      timeLabel,
      milestoneLabel,
      rowTitle,
      progressLabel,
      plannedLabel,
      continues,
    }) =>
      [
        title,
        timeLabel,
        milestoneLabel,
        rowTitle,
        progressLabel,
        plannedLabel,
        continues ? "跨时段继续" : undefined,
      ]
        .filter(Boolean)
        .join("，"),
  },
}

// Both properties are accepted directly by their corresponding public roots.
// Editor dialogs are composed by individual examples rather than by these APIs;
// their labels and placeholders go through the example copy dictionary.
export const exampleComplexLocales = {
  en: {
    eventCalendar: { locale: enUS, i18n: eventCalendarEn },
    gantt: { locale: enUS, i18n: DEFAULT_GANTT_I18N },
  },
  "zh-CN": {
    eventCalendar: { locale: zhCN, i18n: eventCalendarZh },
    gantt: { locale: zhCN, i18n: ganttZh },
  },
}
