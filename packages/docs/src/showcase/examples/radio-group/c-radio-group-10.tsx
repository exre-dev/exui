
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"
import { Separator } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Frame className="w-full max-w-xs" spacing="sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Language</ExampleText>}</FrameTitle>
      </FrameHeader>
      <FramePanel className="overflow-hidden p-0!">
        <RadioGroup defaultValue="en">
          <FieldGroup className="gap-0">
            <Field>
              <FieldLabel className="p-3">
                <RadioGroupItem value="en" id={exampleId("lang-en")} />
                <FieldTitle>{<ExampleText>English</ExampleText>}</FieldTitle>
              </FieldLabel>
            </Field>
            <Separator />
            <Field>
              <FieldLabel className="p-3">
                <RadioGroupItem value="es" id={exampleId("lang-es")} />
                <FieldTitle>{<ExampleText>Spanish</ExampleText>}</FieldTitle>
              </FieldLabel>
            </Field>
            <Separator />
            <Field>
              <FieldLabel className="p-3">
                <RadioGroupItem value="fr" id={exampleId("lang-fr")} />
                <FieldTitle>{<ExampleText>French</ExampleText>}</FieldTitle>
              </FieldLabel>
            </Field>
            <Separator />
            <Field>
              <FieldLabel className="p-3">
                <RadioGroupItem value="de" id={exampleId("lang-de")} />
                <FieldTitle>{<ExampleText>German</ExampleText>}</FieldTitle>
              </FieldLabel>
            </Field>
          </FieldGroup>
        </RadioGroup>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
