
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MailIcon } from "lucide-react"

import {
  TimePicker,
  TimePickerContent,
  TimePickerTrigger,
} from "@exre/exui"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  return (
    <div className="w-full max-w-sm">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <MailIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle id={exampleId("digest-time-title")}>{<ExampleText>Daily digest</ExampleText>}</ItemTitle>
          <ItemDescription id={exampleId("digest-time-description")}>
            {<ExampleText>Mentions, replies and new tasks, once a day. </ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          {/* Hour granularity leaves 2 columns, hour and AM/PM, and every
              value lands on the hour ("09:00", "21:00"). The row title names
              the trigger, which adds its value: "Daily digest 09:00 AM". */}
          <TimePicker i18n={exampleLocales.timePicker}
            granularity="hour"
            hourCycle={12}
            defaultValue="09:00"
            aria-labelledby={exampleId("digest-time-title")}
            aria-describedby={exampleId("digest-time-description")}
          >
            <TimePickerTrigger size="sm" className="w-32" />
            {/* The trigger sits at the row's end, so `align="end"` keeps the
                popover under the row instead of hanging past its edge. */}
            <TimePickerContent align="end" />
          </TimePicker>
        </ItemActions>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
