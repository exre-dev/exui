
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, XIcon } from "lucide-react"

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


const deployments = [
  {
    id: 1,
    title: "Production Deploy",
    date: "2 minutes ago",
    commit: "a1b2c3d",
    branch: "main",
    status: "success",
    duration: "42s",
  },
  {
    id: 2,
    title: "Staging Deploy",
    date: "15 minutes ago",
    commit: "e4f5g6h",
    branch: "staging",
    status: "success",
    duration: "38s",
  },
  {
    id: 3,
    title: "Preview Deploy",
    date: "1 hour ago",
    commit: "i7j8k9l",
    branch: "feat/auth",
    status: "failed",
    duration: "1m 12s",
  },
  {
    id: 4,
    title: "Production Deploy",
    date: "3 hours ago",
    commit: "m0n1o2p",
    branch: "main",
    status: "success",
    duration: "45s",
  },
]

  function OriginalPattern() {
  return (
    <div className="w-full max-w-xs">
      <Timeline defaultValue={4}>
        {<ExampleText>{deployments.map((deploy) => (
          <TimelineItem
            key={deploy.id}
            step={deploy.id}
            className="group-data-[orientation=vertical]/timeline:ms-10"
          >
            <TimelineHeader>
              <TimelineSeparator className="bg-input! group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
              <div className="flex items-center gap-2">
                <TimelineTitle className="text-sm">
                  {<ExampleText>{deploy.title}</ExampleText>}
                </TimelineTitle>
                <Badge
                  variant={
                    deploy.status === "success"
                      ? "success-light"
                      : "destructive-light"
                  }
                  size="sm"
                >
                  {<ExampleText>{deploy.status}</ExampleText>}
                </Badge>
              </div>
              <TimelineIndicator
                className={cn(
                  "flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7",
                  deploy.status === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-destructive text-white"
                )}
              >
                {<ExampleText>{deploy.status === "success" ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <XIcon className="size-3.5" />
                )}</ExampleText>}
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent>
              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                <span className="font-mono">{<ExampleText>{deploy.commit}</ExampleText>}</span>
                <span>&middot;</span>
                <span>{<ExampleText>{deploy.branch}</ExampleText>}</span>
                <span>&middot;</span>
                <span>{<ExampleText>{deploy.duration}</ExampleText>}</span>
              </div>
              <TimelineDate className="mt-1 mb-0">{<ExampleText>{deploy.date}</ExampleText>}</TimelineDate>
            </TimelineContent>
          </TimelineItem>
        ))}</ExampleText>}
      </Timeline>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
