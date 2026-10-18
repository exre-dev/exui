
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@exre/exui"
import {
  NativeSelect,
  NativeSelectOption,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={exampleId("verification-method")}>
            {<ExampleText>Verification Method </ExampleText>}</FieldLabel>
          <NativeSelect id={exampleId("verification-method")} defaultValue="email">
            <NativeSelectOption value="email">{<ExampleText>Email Address</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="sms">
              {<ExampleText>SMS Text Message </ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="app">
              {<ExampleText>Authenticator App </ExampleText>}</NativeSelectOption>
          </NativeSelect>
          <FieldDescription>
            {<ExampleText>Choose how you want to receive your security code. </ExampleText>}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor={exampleId("otp-code")}>{<ExampleText>Security Code</ExampleText>}</FieldLabel>
          <InputOTP id={exampleId("otp-code")} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            {<ExampleText>Enter the 6-digit code to verify your identity. </ExampleText>}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
