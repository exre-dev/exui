"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { type SVGProps } from "react"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel, FieldTitle } from "@exre/exui"

const MastercardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="7" cy="12" r="7" fill="#EB001B" />
    <circle cx="17" cy="12" r="7" fill="#F79E1B" />
    <path
      d="M12 17.5C13.5 16.2 14.5 14.2 14.5 12C14.5 9.8 13.5 7.8 12 6.5C10.5 7.8 9.5 9.8 9.5 12C9.5 14.2 10.5 16.2 12 17.5Z"
      fill="#FF5F00"
    />
  </svg>
)

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("mastercard")} className="relative p-0!">
        <Field orientation="horizontal">
          <Checkbox
            id={exampleId("mastercard")}
            defaultChecked
            className="absolute top-3 right-3 size-5 rounded-full"
          />
          <FieldTitle className="flex flex-col items-start gap-4!">
            <div className="bg-background border-border rounded-lg flex size-10 items-center justify-center border p-1.5 shadow-xs shadow-black/5">
              <MastercardIcon className="size-full" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">
                {<ExampleText>Mastercard ending in 8888 </ExampleText>}</span>
              <span className="text-muted-foreground text-xs">
                {<ExampleText>Expires 09/25 </ExampleText>}</span>
            </div>
          </FieldTitle>
        </Field>
      </FieldLabel>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
