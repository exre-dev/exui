
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { Badge } from "@exre/exui"
import {
  Frame,
  FrameHeader,
  FramePanel,
} from "@exre/exui"
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@exre/exui"

import { cn } from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import { Spinner } from "@exre/exui"


const pipelineSteps = [
  {
    id: 1,
    title: "Source Code Checkout",
    duration: "12s",
    status: "completed",
    description: "Successfully fetched latest changes from the main branch.",
    user: {
      name: "Alex Johnson",
      avatar:
        "/examples/reui/photos/e93553df2422635515.jpg",
    },
  },
  {
    id: 2,
    title: "Dependency Installation",
    duration: "1m 45s",
    status: "completed",
    description: "All npm packages installed and cached for future builds.",
    user: {
      name: "Sarah Chen",
      avatar:
        "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    },
  },
  {
    id: 3,
    title: "Unit & Integration Tests",
    duration: "Running",
    status: "active",
    description: "Running 142 test suites across the entire codebase...",
    user: {
      name: "Michael Rodriguez",
      avatar:
        "/examples/reui/photos/4349381d8a8476edbc.jpg",
    },
  },
  {
    id: 4,
    title: "Production Build",
    duration: "Pending",
    status: "pending",
    description: "Optimizing assets and generating static site pages.",
    user: {
      name: "Emma Wilson",
      avatar:
        "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    },
  },
]

function StatusIcon({ status }: { status: string }) {
  if (status === "completed")
    return (
      <CheckIcon className="size-3.5" />
    )
  if (status === "active") return <Spinner className="size-3.5" />
  return (
    <CircleIcon className="size-3.5" />
  )
}

function StatusBadge({
  status,
  duration,
}: {
  status: string
  duration: string
}) {
  const variant =
    status === "completed"
      ? "success-light"
      : status === "active"
        ? "info-light"
        : "warning-light"

  return (
    <Badge variant={variant} size="sm">
      {<ExampleText>{duration}</ExampleText>}
    </Badge>
  )
}

  function OriginalPattern() {
  return (
    <div className="w-full max-w-lg">
      <Timeline defaultValue={3}>
        {<ExampleText>{pipelineSteps.map((step) => (
          <ExampleRuntimeConsumer key={step.id} render={({copy: copyExample}) => (<TimelineItem key={step.id} step={step.id} className="ms-10 pb-10">
            <TimelineHeader>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
              <div className="flex items-center gap-2">
                <TimelineTitle className="text-sm font-semibold">
                  {<ExampleText>{step.title}</ExampleText>}
                </TimelineTitle>
                <StatusBadge status={step.status} duration={step.duration} />
              </div>
              <TimelineIndicator
                className={cn(
                  "bg-muted text-muted-foreground group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7",
                  step.status === "active" && "ring-primary/20 ring-2"
                )}
              >
                <StatusIcon status={step.status} />
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent className="mt-2">
              <Frame stacked dense spacing="sm">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex w-full">
                    <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarImage
                            src={step.user.avatar}
                            alt={copyExample(step.user.name)}
                          />
                          <AvatarFallback>
                            {<ExampleText>{step.user.name.charAt(0)}</ExampleText>}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-xs font-medium">
                          {<ExampleText>{step.user.name}</ExampleText>}
                        </span>
                      </div>
                      <ChevronRightIcon className="text-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </FrameHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <FramePanel>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {<ExampleText>{step.description}</ExampleText>}
                      </p>
                    </FramePanel>
                  </CollapsibleContent>
                </Collapsible>
              </Frame>
            </TimelineContent>
          </TimelineItem>)} />
        ))}</ExampleText>}
      </Timeline>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
