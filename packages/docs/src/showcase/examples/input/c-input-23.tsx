"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"

import { useId, useMemo, useState } from "react"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const id = useId()
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character",
      },
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score <= 3) return "bg-amber-500"
    if (score <= 4) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak security"
    if (score <= 4) return "Medium security"
    return "Strong security"
  }

  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor={exampleId(id)}>{<ExampleText>Secure Password</ExampleText>}</FieldLabel>
        <div className="relative">
          <Input
            aria-describedby={exampleId(`${id}-description`)}
            className="pe-9"
            id={exampleId(id)}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={copyExample("Create a strong password")}
            type={isVisible ? "text" : "password"}
            value={password}
          />
          <button
            aria-controls={exampleId("password")}
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

      {/* Segmented Progress Bar */}
      <div
        aria-label={copyExample("Password strength")}
        aria-valuemax={5}
        aria-valuemin={0}
        aria-valuenow={strengthScore}
        className="mt-3 mb-4 flex gap-1"
        role="progressbar"
      >
        {<ExampleText>{[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i < strengthScore ? getStrengthColor(strengthScore) : "bg-border"
            }`}
          />
        ))}</ExampleText>}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-foreground text-sm font-medium"
          id={exampleId(`${id}-description`)}
        >
          {<ExampleText>{getStrengthText(strengthScore)}</ExampleText>}
        </p>
        <span className="text-muted-foreground text-xs">
          {<ExampleText>{strengthScore}</ExampleText>}{<ExampleText>/5 requirements met </ExampleText>}</span>
      </div>

      <ul aria-label={copyExample("Password requirements")} className="space-y-1.5">
        {<ExampleText>{strength.map((req) => (
          <li className="flex items-center gap-1" key={req.text}>
            {<ExampleText>{req.met ? (
              <CheckIcon className="size-3.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <XIcon className="text-muted-foreground/60 size-3.5" aria-hidden="true" />
            )}</ExampleText>}
            <span
              className={`text-xs transition-colors ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {<ExampleText>{req.text}</ExampleText>}
              <span className="sr-only">
                {<ExampleText>{req.met ? " - Requirement met" : " - Requirement not met"}</ExampleText>}
              </span>
            </span>
          </li>
        ))}</ExampleText>}
      </ul>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
