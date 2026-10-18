"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useCallback, useRef, useState } from "react"

import { Field, FieldLabel } from "@exre/exui"
import { Textarea } from "@exre/exui"

const MAX_CHARS = 280

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (newValue.length <= MAX_CHARS) {
        setValue(newValue)
      }

      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    },
    []
  )

  const remaining = MAX_CHARS - value.length
  const isNearLimit = remaining <= 20
  const isAtLimit = remaining === 0

  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={exampleId("auto-resize-textarea")}>{<ExampleText>Bio</ExampleText>}</FieldLabel>
          <span
            className={`text-xs tabular-nums ${
              isAtLimit
                ? "text-destructive font-semibold"
                : isNearLimit
                  ? "text-warning"
                  : "text-muted-foreground"
            }`}
          >
            {<ExampleText>{value.length}</ExampleText>}/{<ExampleText>{MAX_CHARS}</ExampleText>}
          </span>
        </div>
        <Textarea
          ref={textareaRef}
          id={exampleId("auto-resize-textarea")}
          value={value}
          onChange={handleChange}
          placeholder={copyExample("Tell us about yourself...")}
          rows={2}
          className="resize-none overflow-hidden"
        />
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
