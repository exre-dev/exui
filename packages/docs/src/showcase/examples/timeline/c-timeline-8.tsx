
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

const releaseCycle = [
  {
    id: 1,
    date: "Week 1",
    title: "Planning",
    description: "Scope definition and resource planning.",
  },
  {
    id: 2,
    date: "Week 2",
    title: "Design",
    description: "UI/UX design and prototyping.",
  },
  {
    id: 3,
    date: "Week 4",
    title: "Development",
    description: "Core features implementation.",
  },
]

  function OriginalPattern() {
  return (
    <Timeline
      defaultValue={2}
      orientation="horizontal"
      className="w-full max-w-xl"
    >
      {<ExampleText>{releaseCycle.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate>{<ExampleText>{item.date}</ExampleText>}</TimelineDate>
            <TimelineTitle>{<ExampleText>{item.title}</ExampleText>}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{<ExampleText>{item.description}</ExampleText>}</TimelineContent>
        </TimelineItem>
      ))}</ExampleText>}
    </Timeline>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
