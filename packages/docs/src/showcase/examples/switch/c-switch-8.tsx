
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
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
import { Separator } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Frame className="w-full max-w-xs" spacing="sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Privacy Settings</ExampleText>}</FrameTitle>
      </FrameHeader>
      <FramePanel className="overflow-hidden p-0!">
        <FieldGroup className="gap-0">
          <Field>
            <FieldLabel className="justify-between p-3">
              <FieldTitle>{<ExampleText>Profile visibility</ExampleText>}</FieldTitle>
              <Switch defaultChecked />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="justify-between p-3">
              <FieldTitle>{<ExampleText>Show online status</ExampleText>}</FieldTitle>
              <Switch defaultChecked />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="justify-between p-3">
              <FieldTitle>{<ExampleText>Allow data collection</ExampleText>}</FieldTitle>
              <Switch />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
