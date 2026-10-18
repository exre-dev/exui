"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
type CaptionLabelProps = React.ComponentProps<NonNullable<NonNullable<React.ComponentProps<typeof Calendar>["components"]>["CaptionLabel"]>>
type MonthGridProps = React.ComponentProps<NonNullable<NonNullable<React.ComponentProps<typeof Calendar>["components"]>["MonthGrid"]>>
import {
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfYear,
} from "date-fns"


import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { Calendar } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"
import { ScrollArea } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, locale: exampleLocale, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const today = new Date(EXAMPLE_EPOCH)
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<Date | undefined>(today)
  const [isYearView, setIsYearView] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const startYear = today.getFullYear() - 10
  const endYear = today.getFullYear() + 10
  const startDate = startOfYear(new Date(startYear, 0))
  const endDate = endOfYear(new Date(endYear, 11))

  const years = eachYearOfInterval({
    end: endOfYear(endDate),
    start: startOfYear(startDate),
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group/pick-date w-60 justify-between"
          id={exampleId(id)}
          variant={"outline"}
        >
          <span className={cn("truncate", date && "text-muted-foreground")}>
            {<ExampleText>{date ? format(date, "LLL dd, y", { locale: exampleLocale }) : "Pick a date"}</ExampleText>}
          </span>
          <CalendarIcon aria-hidden="true" className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <Calendar labels={exampleLocales.calendarLabels} locale={exampleLocale}
              classNames={{
                month_caption: "justify-start",
                nav: "flex items-center w-full absolute inset-x-0 justify-end pointer-events-none [&>button]:pointer-events-auto",
              }}
              components={{
                CaptionLabel: (props: CaptionLabelProps) => (
                  <CaptionLabel
                    isYearView={isYearView}
                    setIsYearView={(val) => {
                      setIsYearView(val)
                      if (!val) setSelectedYear(null)
                    }}
                    {...props}
                  />
                ),
                MonthGrid: (props: MonthGridProps) => {
                  return (
                    <MonthGrid
                      className={props.className}
                      currentMonth={month.getMonth()}
                      currentYear={month.getFullYear()}
                      endDate={endDate}
                      isYearView={isYearView}
                      onMonthSelect={(selectedMonth: Date) => {
                        setMonth(selectedMonth)
                        setIsYearView(false)
                        setSelectedYear(null)
                      }}
                      setIsYearView={setIsYearView}
                      startDate={startDate}
                      years={years}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                    >
                      {<ExampleText>{props.children}</ExampleText>}
                    </MonthGrid>
                  )
                },
              }}
              defaultMonth={new Date(EXAMPLE_EPOCH)}
              endMonth={endDate}
              mode="single"
              month={month}
              onMonthChange={setMonth}
              onSelect={setDate}
              selected={date}
              startMonth={startDate}
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

function MonthGrid({
  className,
  children,
  isYearView,
  years,
  currentYear,
  currentMonth,
  onMonthSelect,
  selectedYear,
  setSelectedYear,
  startDate,
  endDate,
}: {
  className?: string
  children: ReactNode
  isYearView: boolean
  setIsYearView: Dispatch<SetStateAction<boolean>>
  startDate: Date
  endDate: Date
  years: Date[]
  currentYear: number
  currentMonth: number
  onMonthSelect: (date: Date) => void
  selectedYear: number | null
  setSelectedYear: Dispatch<SetStateAction<number | null>>
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isYearView && scrollAreaRef.current) {
      const activeElement = scrollAreaRef.current.querySelector(
        "[data-active='true']"
      ) as HTMLElement | null

      if (activeElement) {
        activeElement.scrollIntoView({ block: "center" })
      }
    }
  }, [isYearView, selectedYear])

  return (
    <div className="relative">
      <table className={className}>{<ExampleText>{children}</ExampleText>}</table>
      {<ExampleText>{isYearView && (
        <div className="bg-background absolute inset-0 z-20 -m-2">
          <div className="h-full" ref={scrollAreaRef}>
            <ScrollArea className="h-full">
              <div className="px-3 pt-1 pb-3">
                {<ExampleText>{selectedYear === null ? (
                  <div className="grid grid-cols-4 gap-2">
                    {<ExampleText>{years.map((year) => {
                      const y = year.getFullYear()
                      const isCurrent = y === currentYear
                      return (
                        <Button
                          key={y}
                          variant={isCurrent ? "default" : "outline"}
                          size="sm"
                          className="h-8"
                          data-active={isCurrent}
                          onClick={() => setSelectedYear(y)}
                        >
                          {<ExampleText>{y}</ExampleText>}
                        </Button>
                      )
                    })}</ExampleText>}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        onClick={() => setSelectedYear(null)}
                      >
                        <ChevronDownIcon className="mr-1 size-4 rotate-90" />
                        {<ExampleText>{selectedYear}</ExampleText>}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {<ExampleText>{eachMonthOfInterval({
                        start: startOfYear(new Date(selectedYear, 0)),
                        end: endOfYear(new Date(selectedYear, 0)),
                      }).map((month) => {
                        const isCurrent =
                          month.getMonth() === currentMonth &&
                          selectedYear === currentYear

                        const isDisabled =
                          isBefore(month, startOfYear(startDate)) ||
                          isAfter(month, endOfYear(endDate))

                        return (
                          <ExampleRuntimeConsumer key={month.getTime()} render={({locale: exampleLocale}) => (<Button
                            key={month.getTime()}
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            className="h-8"
                            data-active={isCurrent}
                            disabled={isDisabled}
                            onClick={() => onMonthSelect(month)}
                          >
                            {<ExampleText>{format(month, "MMM", { locale: exampleLocale })}</ExampleText>}
                          </Button>)} />
                        )
                      })}</ExampleText>}
                    </div>
                  </div>
                )}</ExampleText>}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}</ExampleText>}
    </div>
  )
}

function CaptionLabel({
  children,
  isYearView,
  setIsYearView,
}: {
  isYearView: boolean
  setIsYearView: Dispatch<SetStateAction<boolean>>
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <Button
      className="data-[state=open]:text-muted-foreground/80 -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
      data-state={isYearView ? "open" : "closed"}
      onClick={() => setIsYearView((prev) => !prev)}
      size="sm"
      variant="ghost"
    >
      {<ExampleText>{children}</ExampleText>}
      <ChevronDownIcon aria-hidden="true" className="text-muted-foreground/80 shrink-0 transition-transform duration-200" />
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
