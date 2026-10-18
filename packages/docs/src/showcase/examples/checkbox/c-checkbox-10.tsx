
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Frame className="w-full max-w-xs" spacing="sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Notification Settings</ExampleText>}</FrameTitle>
      </FrameHeader>
      <FramePanel className="overflow-hidden p-0!">
        <FieldGroup className="gap-0">
          <Field>
            <FieldLabel className="p-3">
              <Checkbox defaultChecked />
              <FieldTitle>{<ExampleText>Push notifications</ExampleText>}</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="p-3">
              <Checkbox />
              <FieldTitle>{<ExampleText>Email notifications</ExampleText>}</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="p-3">
              <Checkbox />
              <FieldTitle>{<ExampleText>SMS notifications</ExampleText>}</FieldTitle>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
