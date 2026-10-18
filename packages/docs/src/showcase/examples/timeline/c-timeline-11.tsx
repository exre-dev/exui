
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
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

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

const activities = [
  {
    id: 1,
    user: "Alex Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    action: "pushed 3 commits to",
    target: "main",
    date: "5 minutes ago",
  },
  {
    id: 2,
    user: "Sarah Chen",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    action: "opened pull request",
    target: "#284 — Add dark mode",
    date: "20 minutes ago",
  },
  {
    id: 3,
    user: "David Kim",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    action: "commented on",
    target: "Issue #142",
    date: "1 hour ago",
  },
  {
    id: 4,
    user: "Emma Wilson",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    action: "deployed to",
    target: "production",
    date: "2 hours ago",
  },
  {
    id: 5,
    user: "Michael Rodriguez",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    action: "merged branch",
    target: "feat/notifications",
    date: "3 hours ago",
  },
]

  function OriginalPattern() {
  return (
    <div className="w-full max-w-md">
      <Timeline defaultValue={5}>
        {<ExampleText>{activities.map((activity) => (
          <ExampleRuntimeConsumer key={activity.id} render={({copy: copyExample}) => (<TimelineItem
            key={activity.id}
            step={activity.id}
            className="group-data-[orientation=vertical]/timeline:ms-10"
          >
            <TimelineHeader>
              <TimelineSeparator className="bg-input! group-data-[orientation=vertical]/timeline:top-2 group-data-[orientation=vertical]/timeline:-left-8 group-data-[orientation=vertical]/timeline:h-[calc(100%-2.5rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
              <TimelineIndicator className="size-8 overflow-hidden rounded-full border-none group-data-[orientation=vertical]/timeline:-left-8">
                <Avatar className="size-8">
                  <AvatarImage src={activity.avatar} alt={copyExample(activity.user)} />
                  <AvatarFallback className="text-[10px]">
                    {<ExampleText>{activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}</ExampleText>}
                  </AvatarFallback>
                </Avatar>
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent>
              <p className="text-sm">
                <span className="font-medium">{<ExampleText>{activity.user}</ExampleText>}</span>{<ExampleText>{" "}</ExampleText>}
                <span className="text-muted-foreground">{<ExampleText>{activity.action}</ExampleText>}</span>{<ExampleText>{" "}</ExampleText>}
                <span className="font-medium">{<ExampleText>{activity.target}</ExampleText>}</span>
              </p>
              <TimelineDate className="mt-0.5 mb-0">
                {<ExampleText>{activity.date}</ExampleText>}
              </TimelineDate>
            </TimelineContent>
          </TimelineItem>)} />
        ))}</ExampleText>}
      </Timeline>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
