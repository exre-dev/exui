
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
  TimelineTitle,
} from "@exre/exui"

const roadmap = [
  {
    id: 1,
    date: "Jan 2025",
    title: "AI Engine Integration",
    description:
      "Deep integration of advanced LLMs for real-time code generation and context-aware suggestions.",
  },
  {
    id: 2,
    date: "Feb 2025",
    title: "Collaborative Editing",
    description:
      "Multi-user real-time collaboration with shared cursors and instant synchronization across workspaces.",
  },
  {
    id: 3,
    date: "Mar 2025",
    title: "Visual Theme Builder",
    description:
      "Interactive interface for creating and managing custom design systems with automated CSS variable generation.",
  },
  {
    id: 4,
    date: "Apr 2025",
    title: "Enterprise Security",
    description:
      "Role-based access control, SOC2 compliance audit, and enhanced data encryption protocols.",
  },
]

  function OriginalPattern() {
  return (
    <Timeline defaultValue={2} className="w-full max-w-md">
      {<ExampleText>{roadmap.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="sm:group-data-[orientation=vertical]/timeline:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
              {<ExampleText>{item.date}</ExampleText>}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">{<ExampleText>{item.title}</ExampleText>}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{<ExampleText>{item.description}</ExampleText>}</TimelineContent>
        </TimelineItem>
      ))}</ExampleText>}
    </Timeline>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
