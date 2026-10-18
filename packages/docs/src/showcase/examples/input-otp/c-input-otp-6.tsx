
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
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
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Verify your login</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>Enter the verification code we sent to your email address:</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <span className="text-foreground font-medium">{<ExampleText>m@example.com</ExampleText>}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={exampleId("otp-verification")}>
                  {<ExampleText>Verification code </ExampleText>}</FieldLabel>
                <Button variant="outline" size="xs">
                  <RefreshCwIcon data-icon="inline-start" />
                  {<ExampleText>Resend Code </ExampleText>}</Button>
              </div>
              <InputOTP maxLength={6} id={exampleId("otp-verification")} required>
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-9 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-9 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            {<ExampleText>Verify </ExampleText>}</Button>
          <div className="text-muted-foreground">
            {<ExampleText>Having trouble signing in?</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <a onClick={(event) => event.preventDefault()}
              href="#"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              {<ExampleText>Contact support </ExampleText>}</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
