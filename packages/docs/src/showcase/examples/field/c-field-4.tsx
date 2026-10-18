
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">{<ExampleText>Email Notifications</ExampleText>}</FieldLegend>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <Checkbox id={exampleId("notify-updates")} defaultChecked />
              <FieldContent>
                <FieldTitle>{<ExampleText>Product updates</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Receive emails about new features and improvements. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={exampleId("notify-security")} defaultChecked disabled />
              <FieldContent>
                <FieldTitle>{<ExampleText>Security alerts</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Critical security notifications cannot be disabled. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">{<ExampleText>Profile Privacy</ExampleText>}</FieldLegend>
          <RadioGroup defaultValue="public">
            <FieldGroup className="gap-2">
              <Field orientation="horizontal">
                <RadioGroupItem value="public" id={exampleId("privacy-public")} />
                <FieldLabel htmlFor={exampleId("privacy-public")} className="font-normal">
                  {<ExampleText>Public - visible to everyone </ExampleText>}</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="private" id={exampleId("privacy-private")} />
                <FieldLabel htmlFor={exampleId("privacy-private")} className="font-normal">
                  {<ExampleText>Private - only visible to you </ExampleText>}</FieldLabel>
              </Field>
            </FieldGroup>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
