
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$"


import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Field>
        <FieldLabel htmlFor={exampleId("alphanumeric")}>{<ExampleText>Alphanumeric OTP</ExampleText>}</FieldLabel>
        <FieldDescription>{<ExampleText>Accepts both letters and numbers.</ExampleText>}</FieldDescription>
        <InputOTP
          id={exampleId("alphanumeric")}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
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
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
