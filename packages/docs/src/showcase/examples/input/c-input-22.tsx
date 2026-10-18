"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlertTriangleIcon, CircleCheckIcon, InfoIcon } from "lucide-react"

import { useId, useState } from "react"

import { cn } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const id = useId()
  const [password, setPassword] = useState("")

  const getStrength = (pass: string) => {
    const requirements = [
      { met: pass.length >= 8, text: "8+ characters" },
      { met: /[0-9]/.test(pass), text: "a number" },
      { met: /[!@#$%^&*]/.test(pass), text: "a special character" },
    ]
    const metCount = requirements.filter((r) => r.met).length
    return { requirements, metCount }
  }

  const { metCount } = getStrength(password)

  const getHint = () => {
    if (!password) {
      return "Use 8+ characters with a number and a special character."
    }
    if (metCount === 3) {
      return "Strong password. You're all set!"
    }
    if (metCount === 2) {
      return "Almost there! Add the missing requirement."
    }
    return "Weak password. Include 8+ characters, a number, and a special character."
  }

  const getStatus = () => {
    if (!password)
      return {
        color: "text-muted-foreground",
        icon: (
          <InfoIcon className="size-3.5 shrink-0" />
        ),
      }
    if (metCount === 3)
      return {
        color: "text-emerald-500",
        icon: (
          <CircleCheckIcon className="size-3.5 shrink-0" />
        ),
      }
    if (metCount === 2)
      return {
        color: "text-amber-500",
        icon: (
          <AlertTriangleIcon className="size-3.5 shrink-0" />
        ),
      }
    return {
      color: "text-destructive",
      icon: (
        <AlertTriangleIcon className="size-3.5 shrink-0" />
      ),
    }
  }

  const { color, icon: StatusIcon } = getStatus()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId(id)}>{<ExampleText>Password</ExampleText>}</FieldLabel>
      <Input
        id={exampleId(id)}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={copyExample("Enter password")}
      />
      <div
        className={cn(
          "flex items-center gap-2 text-xs transition-colors duration-200",
          color
        )}
      >
        {<ExampleText>{StatusIcon}</ExampleText>}
        <p>{<ExampleText>{getHint()}</ExampleText>}</p>
      </div>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
