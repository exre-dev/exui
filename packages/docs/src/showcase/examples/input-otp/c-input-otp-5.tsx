
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
const REGEXP_ONLY_DIGITS = "^\\d+$"


import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Field>
        <FieldLabel htmlFor={exampleId("four-digits")}>{<ExampleText>4-Digit PIN</ExampleText>}</FieldLabel>
        <FieldDescription>{<ExampleText>Common pattern for PIN codes.</ExampleText>}</FieldDescription>
        <InputOTP id={exampleId("four-digits")} maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
