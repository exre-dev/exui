"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { useState } from "react"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <Field className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={exampleId("password-link")}>{<ExampleText>Password</ExampleText>}</FieldLabel>
        <a onClick={(event) => event.preventDefault()}
          href="#"
          className="text-primary text-xs font-medium hover:underline"
        >
          {<ExampleText>Forgot password? </ExampleText>}</a>
      </div>
      <div className="relative">
        <Input
          id={exampleId("password-link")}
          type={isVisible ? "text" : "password"}
          className="pe-9"
        />
        <button
          aria-label={copyExample(isVisible ? "Hide password" : "Show password")}
          aria-pressed={isVisible}
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={toggleVisibility}
          type="button"
        >
          {<ExampleText>{isVisible ? (
            <EyeOffIcon aria-hidden="true" />
          ) : (
            <EyeIcon aria-hidden="true" />
          )}</ExampleText>}
        </button>
      </div>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
