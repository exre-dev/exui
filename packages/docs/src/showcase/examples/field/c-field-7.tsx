
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from "@exre/exui"
import { Input } from "@exre/exui"
import { Switch } from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={exampleId("settings-name")}>
            {<ExampleText>Display Name </ExampleText>}<span className="text-destructive">*</span>
          </FieldLabel>
          <Input id={exampleId("settings-name")} defaultValue="Alex Johnson" />
          <FieldDescription>{<ExampleText>This is your public display name.</ExampleText>}</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor={exampleId("settings-slug")}>{<ExampleText>URL Slug</ExampleText>}</FieldLabel>
          <Input id={exampleId("settings-slug")} defaultValue="alex johnson" />
          <FieldError>
            {<ExampleText>Slug can only contain lowercase letters, numbers, and hyphens. </ExampleText>}</FieldError>
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={exampleId("settings-bio")}>{<ExampleText>Bio</ExampleText>}</FieldLabel>
            <span className="text-muted-foreground text-xs">24/160</span>
          </div>
          <Textarea
            id={exampleId("settings-bio")}
            defaultValue="Software engineer & open source contributor."
            className="min-h-[80px]"
          />
          <FieldDescription>
            {<ExampleText>Brief description for your profile. </ExampleText>}</FieldDescription>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{<ExampleText>Email Notifications</ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>Receive emails about account activity. </ExampleText>}</FieldDescription>
          </FieldContent>
          <Switch id={exampleId("settings-email-notif")} defaultChecked />
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{<ExampleText>Marketing Emails</ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>Receive emails about new features and tips. </ExampleText>}</FieldDescription>
          </FieldContent>
          <Switch id={exampleId("settings-marketing")} />
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Checkbox id={exampleId("settings-terms")} />
          <FieldContent>
            <FieldTitle>{<ExampleText>Terms of Service</ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>I agree to the </ExampleText>}<a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Terms of Service</ExampleText>}</a> {<ExampleText> and</ExampleText>}{<ExampleText>{" "}</ExampleText>}
              <a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Privacy Policy</ExampleText>}</a>.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Button className="w-full">{<ExampleText>Save Changes</ExampleText>}</Button>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
