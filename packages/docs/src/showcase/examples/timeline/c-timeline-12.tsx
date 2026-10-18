
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CircleIcon, PlayIcon } from "lucide-react"

import { Badge } from "@exre/exui"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@exre/exui"

import { cn } from "@exre/exui"


const releases = [
  {
    id: 1,
    version: "v1.0",
    date: "Jan 2025",
    title: "Initial Release",
    status: "released",
  },
  {
    id: 2,
    version: "v1.1",
    date: "Mar 2025",
    title: "Bug Fixes",
    status: "released",
  },
  {
    id: 3,
    version: "v2.0",
    date: "Jun 2025",
    title: "Major Update",
    status: "current",
  },
  {
    id: 4,
    version: "v2.1",
    date: "Sep 2025",
    title: "Improvements",
    status: "upcoming",
  },
]

  function OriginalPattern() {
  return (
    <Timeline
      defaultValue={3}
      orientation="horizontal"
      className="w-full max-w-xl"
    >
      {<ExampleText>{releases.map((release) => (
        <TimelineItem key={release.id} step={release.id}>
          <TimelineHeader>
            <TimelineSeparator className="bg-input! group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-2.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-2.25rem)]" />
            <TimelineDate>{<ExampleText>{release.date}</ExampleText>}</TimelineDate>
            <TimelineTitle className="flex items-center gap-2">
              {<ExampleText>{release.version}</ExampleText>}
              {<ExampleText>{release.status === "current" && (
                <Badge variant="primary-light" size="sm">
                  {<ExampleText>Current </ExampleText>}</Badge>
              )}</ExampleText>}
            </TimelineTitle>
            <TimelineIndicator
              className={cn(
                "flex size-6 items-center justify-center border-none",
                release.status === "released" && "bg-emerald-500 text-white",
                release.status === "current" &&
                  "bg-primary text-primary-foreground",
                release.status === "upcoming" &&
                  "bg-muted text-muted-foreground"
              )}
            >
              {<ExampleText>{release.status === "released" ? (
                <CheckIcon className="size-3.5" />
              ) : release.status === "current" ? (
                <PlayIcon className="size-3" />
              ) : (
                <CircleIcon className="size-3" />
              )}</ExampleText>}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent className="text-xs">{<ExampleText>{release.title}</ExampleText>}</TimelineContent>
        </TimelineItem>
      ))}</ExampleText>}
    </Timeline>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
