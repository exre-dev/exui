"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"

import { useState } from "react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <LockIcon className="text-muted-foreground size-4" />
        </InputGroupAddon>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          placeholder={copyExample("Enter password")}
        />
        <InputGroupButton aria-label={showPassword ? copyExample("Hide password") : copyExample("Show password")}
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {<ExampleText>{showPassword ? (
            <EyeOffIcon className="text-muted-foreground size-4" />
          ) : (
            <EyeIcon className="text-muted-foreground size-4" />
          )}</ExampleText>}
        </InputGroupButton>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
