
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ClockIcon } from "lucide-react"

import {
  TimePicker,
  TimePickerClear,
  TimePickerColumns,
  TimePickerConfirm,
  TimePickerContent,
  TimePickerFooter,
  TimePickerTrigger,
  TimePickerValue,
} from "@exre/exui"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel id={exampleId("doors-open-label")} htmlFor={exampleId("doors-open")}>
          {<ExampleText>Doors open </ExampleText>}</FieldLabel>
        {/* The zone is a fixed label, not a conversion: the value is the
            venue's wall-clock time. The label and the value name the trigger,
            so the zone joins them as its description. */}
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId("doors-open")}
          defaultValue="19:30"
          aria-labelledby={exampleId("doors-open-label")}
          aria-describedby={exampleId("doors-open-zone doors-open-description")}
        >
          <TimePickerTrigger>
            <TimePickerValue />
            <span
              id={exampleId("doors-open-zone")}
              className="text-muted-foreground ms-auto"
            >
              {<ExampleText>Berlin time </ExampleText>}</span>
            {/* Children replace the default value and clock, so the clock is
                added back; `data-icon` keeps the button's end padding. */}
            <span
              data-icon="inline-end"
              aria-hidden="true"
              className="text-muted-foreground flex"
            >
              <ClockIcon aria-hidden="true" />
            </span>
          </TimePickerTrigger>
          <TimePickerContent>
            <TimePickerColumns />
            {/* No Now: it would read the viewer's clock, not the venue's. */}
            <TimePickerFooter>
              <TimePickerClear />
              <TimePickerConfirm />
            </TimePickerFooter>
          </TimePickerContent>
        </TimePicker>
        <FieldDescription id={exampleId("doors-open-description")}>
          {<ExampleText>Shown on every ticket in venue time, wherever the buyer is. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
