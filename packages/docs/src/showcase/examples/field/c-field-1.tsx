
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"
import { Input } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={exampleId("profile-name")}>
            {<ExampleText>Full Name </ExampleText>}<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id={exampleId("profile-name")}
            placeholder={copyExample("Enter your full name")}
            required
          />
          <FieldDescription>
            {<ExampleText>This name will be displayed on your public profile. </ExampleText>}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor={exampleId("profile-username")}>{<ExampleText>Username</ExampleText>}</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id={exampleId("profile-username")} placeholder={copyExample("username")} />
          </InputGroup>
          <FieldDescription className="text-success">
            {<ExampleText>Username is available. </ExampleText>}</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor={exampleId("profile-email")}>{<ExampleText>Email Address</ExampleText>}</FieldLabel>
          <InputGroup>
            <InputGroupInput id={exampleId("profile-email")} placeholder={copyExample("email")} />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{<ExampleText>@gmail.com</ExampleText>}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            {<ExampleText>Please enter a valid email address. </ExampleText>}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
