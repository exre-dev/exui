"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import { Slider } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const [cpuLimit, setCpuLimit] = useState([75])

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{<ExampleText>High Performance Mode</ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>Prioritize speed over battery life for intensive tasks. </ExampleText>}</FieldDescription>
          </FieldContent>
          <Switch id={exampleId("high-performance")} defaultChecked />
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel id={exampleId("cpu-allocation-label")}>{<ExampleText>CPU Allocation</ExampleText>}</FieldLabel>
            <span className="text-muted-foreground text-xs font-medium">
              {<ExampleText>{cpuLimit[0]}</ExampleText>}%
            </span>
          </div>
          <Slider
            id={exampleId("cpu-allocation")}
            role="group"
            aria-labelledby={exampleId("cpu-allocation-label")}
            value={cpuLimit}
            onValueChange={(value) => setCpuLimit(value as number[])}
            max={100}
            step={5}
          />
          <FieldDescription>
            {<ExampleText>Limit the maximum CPU resources used by the application. </ExampleText>}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
