"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { EyeIcon, EyeOffIcon, CodeXml as GithubIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@exre/exui"
import { Input } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [isVisible, setIsVisible] = useState(false)

  return (
    <Card className="mx-auto w-full max-w-xs">
      <CardHeader>
        <CardTitle>{<ExampleText>Sign in</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>Enter your email and password to access your account </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="grid gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={exampleId("email-12")}>{<ExampleText>Email address</ExampleText>}</FieldLabel>
              <Input
                id={exampleId("email-12")}
                type="email"
                placeholder={copyExample("name@example.com")}
                required
              />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={exampleId("password-12")}>{<ExampleText>Password</ExampleText>}</FieldLabel>
                <a onClick={(event) => event.preventDefault()}
                  href="#"
                  className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                >
                  {<ExampleText>Forgot password? </ExampleText>}</a>
              </div>
              <InputGroup>
                <InputGroupInput
                  id={exampleId("password-12")}
                  placeholder={copyExample("Password")}
                  type={isVisible ? "text" : "password"}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    aria-label={copyExample(isVisible ? "Hide password" : "Show password")}
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {<ExampleText>{isVisible ? (
                      <EyeOffIcon aria-hidden="true" />
                    ) : (
                      <EyeIcon aria-hidden="true" />
                    )}</ExampleText>}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <div className="flex flex-col gap-6">
            <Button type="submit" className="w-full">
              {<ExampleText>Sign in </ExampleText>}</Button>
            <FieldSeparator className="text-xs">
              {<ExampleText>Or continue with </ExampleText>}</FieldSeparator>
            <Button variant="outline" className="w-full">
              <GithubIcon aria-hidden="true" />
              {<ExampleText>Github </ExampleText>}</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-xs">
          {<ExampleText>By clicking continue, you agree to our</ExampleText>}{<ExampleText>{" "}</ExampleText>}
          <a onClick={(event) => event.preventDefault()}
            href="#"
            className="hover:text-primary underline underline-offset-4"
          >
            {<ExampleText>Terms of Service </ExampleText>}</a>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
