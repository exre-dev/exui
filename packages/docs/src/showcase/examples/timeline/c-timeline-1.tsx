
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

  function OriginalPattern() {
  return (
    <Timeline defaultValue={2} className="w-full max-w-md">
      <TimelineItem step={1}>
        <TimelineHeader>
          <TimelineDate>{<ExampleText>March 2024</ExampleText>}</TimelineDate>
          <TimelineTitle>{<ExampleText>Project Initialized</ExampleText>}</TimelineTitle>
        </TimelineHeader>
        <TimelineIndicator />
        <TimelineSeparator />
        <TimelineContent>
          {<ExampleText>Successfully set up the project repository and initial architecture. </ExampleText>}</TimelineContent>
      </TimelineItem>

      <TimelineItem step={2}>
        <TimelineHeader>
          <TimelineDate>{<ExampleText>April 2024</ExampleText>}</TimelineDate>
          <TimelineTitle>{<ExampleText>Beta Release</ExampleText>}</TimelineTitle>
        </TimelineHeader>
        <TimelineIndicator />
        <TimelineSeparator />
        <TimelineContent>
          {<ExampleText>Launched the beta version for early testers and feedback. </ExampleText>}</TimelineContent>
      </TimelineItem>

      <TimelineItem step={3}>
        <TimelineHeader>
          <TimelineDate>{<ExampleText>June 2024</ExampleText>}</TimelineDate>
          <TimelineTitle>{<ExampleText>Official Launch</ExampleText>}</TimelineTitle>
        </TimelineHeader>
        <TimelineIndicator />
        <TimelineSeparator />
        <TimelineContent>
          {<ExampleText>The platform is now live for all users worldwide. </ExampleText>}</TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
