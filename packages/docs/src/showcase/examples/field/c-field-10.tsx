
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">{<ExampleText>Notification Channels</ExampleText>}</FieldLegend>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{<ExampleText>Push Notifications</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Alerts sent to your device in real time. </ExampleText>}</FieldDescription>
              </FieldContent>
              <Switch id={exampleId("notif-push")} defaultChecked />
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{<ExampleText>Email Digest</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>A daily summary of activity sent to your inbox. </ExampleText>}</FieldDescription>
              </FieldContent>
              <Switch id={exampleId("notif-email")} defaultChecked />
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{<ExampleText>SMS Alerts</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Text messages for critical notifications only. </ExampleText>}</FieldDescription>
              </FieldContent>
              <Switch id={exampleId("notif-sms")} />
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend variant="label">{<ExampleText>Notify me about</ExampleText>}</FieldLegend>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <Checkbox id={exampleId("notif-comments")} defaultChecked />
              <FieldContent>
                <FieldTitle>{<ExampleText>Comments</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>When someone comments on your posts. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={exampleId("notif-mentions")} defaultChecked />
              <FieldContent>
                <FieldTitle>{<ExampleText>Mentions</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>When someone mentions you in a conversation. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={exampleId("notif-updates")} />
              <FieldContent>
                <FieldTitle>{<ExampleText>Product Updates</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>News about new features and improvements. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
