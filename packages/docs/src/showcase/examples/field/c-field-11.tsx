
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LockIcon, MailIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field data-invalid>
          <FieldLabel htmlFor={exampleId("val-email")}>
            {<ExampleText>Email </ExampleText>}<span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={exampleId("val-email")}
              type="email"
              defaultValue="invalid-email"
              placeholder={copyExample("you@example.com")}
            />
          </InputGroup>
          <FieldError>{<ExampleText>Please enter a valid email address.</ExampleText>}</FieldError>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor={exampleId("val-password")}>
            {<ExampleText>Password </ExampleText>}<span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={exampleId("val-password")}
              type="password"
              defaultValue="short"
              placeholder={copyExample("Enter password")}
            />
          </InputGroup>
          <FieldError
            errors={[
              { message: "Must be at least 8 characters." },
              { message: "Must contain at least one number." },
            ]}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={exampleId("val-confirm")}>{<ExampleText>Confirm Password</ExampleText>}</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={exampleId("val-confirm")}
              type="password"
              placeholder={copyExample("Repeat password")}
            />
          </InputGroup>
          <FieldDescription>
            {<ExampleText>Re-enter your password to confirm. </ExampleText>}</FieldDescription>
        </Field>
        <Button className="w-full">{<ExampleText>Create Account</ExampleText>}</Button>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
