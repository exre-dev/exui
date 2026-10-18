
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import { type SVGProps } from "react"

import { Field, FieldLabel, FieldTitle } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"


const VisaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M9.5 8L7 16H5L3 8H5L6.25 13.5L8 8H9.5ZM11 8H12.5V16H11V8ZM16.5 10.5C16.5 9.7 15.8 9.2 14.8 9.2C14 9.2 13.3 9.5 12.8 10L12 9C12.8 8.3 13.8 8 15 8C16.8 8 18 9 18 10.5C18 13.5 14 12.5 14 14.2C14 14.8 14.5 15 15.2 15C16 15 16.7 14.7 17.2 14.2L18 15.2C17.2 15.9 16.2 16.2 15 16.2C13.5 16.2 12.5 15.3 12.5 14C12.5 11.2 16.5 12 16.5 10.5ZM21 16H19.5L22 8H23.5L21 16Z"
      fill="#1A1F71"
    />
  </svg>
)

const MastercardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="9" cy="12" r="5" fill="#EB001B" />
    <circle cx="15" cy="12" r="5" fill="#F79E1B" />
    <path
      d="M12 15.5C13.2 14.5 14 13.3 14 12C14 10.7 13.2 9.5 12 8.5C10.8 9.5 10 10.7 10 12C10 13.3 10.8 14.5 12 15.5Z"
      fill="#FF5F00"
    />
  </svg>
)

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <RadioGroup defaultValue="visa" className="flex flex-col gap-3">
        <FieldLabel htmlFor={exampleId("pay-visa")} className="relative p-0!">
          <Field orientation="horizontal">
            <div className="absolute top-3 right-3">
              <RadioGroupItem value="visa" id={exampleId("pay-visa")} />
            </div>
            <FieldTitle className="flex flex-col items-start gap-4!">
              <div className="bg-background border-border flex size-10 items-center justify-center rounded-lg border p-1.5 shadow-xs shadow-black/5">
                <VisaIcon className="size-full" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{<ExampleText>Visa ending in 4242</ExampleText>}</span>
                <span className="text-muted-foreground text-xs">
                  {<ExampleText>Expires 12/26 </ExampleText>}</span>
              </div>
            </FieldTitle>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor={exampleId("pay-mc")} className="relative p-0!">
          <Field orientation="horizontal">
            <div className="absolute top-3 right-3">
              <RadioGroupItem value="mastercard" id={exampleId("pay-mc")} />
            </div>
            <FieldTitle className="flex flex-col items-start gap-4!">
              <div className="bg-background border-border rounded-2xl flex size-10 items-center justify-center border p-1.5 shadow-xs shadow-black/5">
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
        <FieldLabel htmlFor={exampleId("pay-new")} className="relative p-0!">
          <Field orientation="horizontal" className="justify-center">
            <RadioGroupItem
              value="new"
              id={exampleId("pay-new")}
              className="absolute top-3 right-3"
            />
            <FieldTitle className="flex items-center gap-2">
              <PlusIcon aria-hidden="true" className="size-4 opacity-60" />
              {<ExampleText>Add new payment method </ExampleText>}</FieldTitle>
          </Field>
        </FieldLabel>
      </RadioGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
