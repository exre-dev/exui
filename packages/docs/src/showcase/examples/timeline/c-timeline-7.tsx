
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@exre/exui"

import { cn } from "@exre/exui"

const roadmapItems = [
  {
    date: "Dec 15, 2025",
    content: (
      <>
        <span className="text-muted-foreground">{<ExampleText>Completed</ExampleText>}</span> {<ExampleText> Beta Program </ExampleText>}</>
    ),
    color: "bg-emerald-500",
  },
  {
    date: "Nov 01, 2025",
    content: (
      <>
        <span className="text-muted-foreground">{<ExampleText>Completed</ExampleText>}</span> {<ExampleText> Usability Testing </ExampleText>}</>
    ),
    color: "bg-violet-500",
  },
  {
    date: "Oct 15, 2025",
    content: (
      <>
        <span className="text-muted-foreground">{<ExampleText>Initiated</ExampleText>}</span> {<ExampleText> Design Phase </ExampleText>}</>
    ),
    color: "bg-fuchsia-500",
  },
  {
    date: "Aug 01, 2024",
    content: (
      <>
        <span className="text-muted-foreground">{<ExampleText>Completed</ExampleText>}</span> {<ExampleText> Requirements Gathering </ExampleText>}</>
    ),
    color: "bg-blue-500",
  },
  {
    date: "Jul 15, 2024",
    content: (
      <>
        <span className="text-muted-foreground">{<ExampleText>Started</ExampleText>}</span> {<ExampleText> Project Kickoff </ExampleText>}</>
    ),
    color: "bg-red-500",
  },
]

  function OriginalPattern() {
  return (
    <div className="w-full max-w-xs">
      <Timeline defaultValue={0} className="gap-2.5">
        {<ExampleText>{roadmapItems.map((item, index) => (
          <TimelineItem
            key={index}
            step={index + 1}
            className="has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-foreground/20 group-data-[orientation=vertical]/timeline:not-last:pb-0"
          >
            <TimelineHeader className="flex items-center gap-2.5">
              <TimelineSeparator className="" />
              <TimelineIndicator
                className={cn("size-2 border-none", item.color)}
              />
              <TimelineDate className="text-muted-foreground/60 mb-0 text-[10px] font-semibold uppercase">
                {<ExampleText>{item.date}</ExampleText>}
              </TimelineDate>
            </TimelineHeader>
            <TimelineContent className="text-foreground text-sm font-medium">
              {<ExampleText>{item.content}</ExampleText>}
            </TimelineContent>
          </TimelineItem>
        ))}</ExampleText>}
      </Timeline>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
