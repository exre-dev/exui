
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GitCompareArrowsIcon, GitForkIcon, GitMergeIcon, GitPullRequestArrowIcon } from "lucide-react"

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



const gitActivity = [
  {
    id: 1,
    date: "15 minutes ago",
    title: "Forked Repository",
    description:
      "Forked the repository to create a new branch for development.",
    icon: (
      <GitForkIcon className="size-4" />
    ),
  },
  {
    id: 2,
    date: "10 minutes ago",
    title: "Pull Request Submitted",
    description:
      "Submitted PR #342 with new feature implementation. Waiting for code review.",
    icon: (
      <GitPullRequestArrowIcon className="size-3.5" />
    ),
  },
  {
    id: 3,
    date: "5 minutes ago",
    title: "Comparing Branches",
    description:
      "Received comments on PR. Minor adjustments needed in error handling.",
    icon: (
      <GitCompareArrowsIcon className="size-3.5" />
    ),
  },
  {
    id: 4,
    date: "Just now",
    title: "Merged Branch",
    description:
      "Merged the feature branch into the main branch. Ready for deployment.",
    icon: (
      <GitMergeIcon className="size-3.5" />
    ),
  },
]

  function OriginalPattern() {
  return (
    <Timeline defaultValue={3} className="w-full max-w-md">
      {<ExampleText>{gitActivity.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle className="mt-0.5">{<ExampleText>{item.title}</ExampleText>}</TimelineTitle>
            <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
              {<ExampleText>{item.icon}</ExampleText>}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>
            {<ExampleText>{item.description}</ExampleText>}
            <TimelineDate className="mt-2 mb-0">{<ExampleText>{item.date}</ExampleText>}</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      ))}</ExampleText>}
    </Timeline>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
