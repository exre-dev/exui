"use client"


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

const projectJourney = [
  {
    id: 1,
    date: "Oct 2024",
    title: "Kickoff",
    description: "Defining project goals and core team selection.",
  },
  {
    id: 2,
    date: "Nov 2024",
    title: "Discovery",
    description: "User research and requirements gathering phase.",
  },
  {
    id: 3,
    date: "Dec 2024",
    title: "Implementation",
    description: "Core development and sprint execution.",
  },
]

  function OriginalPattern() {
  return (
    <Timeline
      defaultValue={2}
      orientation="horizontal"
      className="w-full max-w-xl"
    >
      {<ExampleText>{projectJourney.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=horizontal]/timeline:mt-0"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=horizontal]/timeline:top-8" />
            <TimelineDate className="mb-10">{<ExampleText>{item.date}</ExampleText>}</TimelineDate>
            <TimelineTitle>{<ExampleText>{item.title}</ExampleText>}</TimelineTitle>
            <TimelineIndicator className="group-data-[orientation=horizontal]/timeline:top-8" />
          </TimelineHeader>
          <TimelineContent>{<ExampleText>{item.description}</ExampleText>}</TimelineContent>
        </TimelineItem>
      ))}</ExampleText>}
    </Timeline>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
