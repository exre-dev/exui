"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useRef, useState } from "react"
import { Badge } from "@exre/exui"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadControls,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  type SignaturePadApi,
  type SignaturePadStroke,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample, language } = useExampleRuntime()

  const id = useId()
  const [strokes, setStrokes] = useState<SignaturePadStroke[]>([])
  const [agreed, setAgreed] = useState(false)
  const [signedAt, setSignedAt] = useState<number | null>(null)
  const signedAtLabel = signedAt === null ? null : new Intl.DateTimeFormat(language === "zh-CN" ? "zh-CN" : "en-US", {
    dateStyle: "medium",
  }).format(signedAt)
  const padRef = useRef<SignaturePadApi>(null)

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{<ExampleText>Service agreement</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Northwind Studio, 12-month retainer</ExampleText>}</CardDescription>
        <CardAction>
          {/* Up here, away from Sign agreement, so a double click on it
              cannot land on Start over and wipe what was just signed. */}
          <div className="flex items-center gap-2">
            {<ExampleText>{signedAt && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSignedAt(null)
                  setStrokes([])
                  setAgreed(false)
                  requestAnimationFrame(() => padRef.current?.focus())
                }}
              >
                {<ExampleText>Start over </ExampleText>}</Button>
            )}</ExampleText>}
            <Badge variant={signedAt ? "success-light" : "warning-light"}>
              {<ExampleText>{signedAt ? "Signed" : "Awaiting signature"}</ExampleText>}
            </Badge>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            {<ExampleText>By signing you accept the scope, the payment schedule and the 30-day notice period in sections 2 to 5. </ExampleText>}</p>
          <SignaturePad
            apiRef={padRef}
            value={strokes}
            onValueChange={setStrokes}
            readOnly={signedAt !== null}
          >
            <SignaturePadArea aria-label={copyExample("Client signature")} className="h-36">
              <SignaturePadGuide />
              <SignaturePadPlaceholder />
              {<ExampleText>{signedAt === null && (
                <SignaturePadControls position="top-end">
                  <SignaturePadClear variant="ghost" />
                </SignaturePadControls>
              )}</ExampleText>}
            </SignaturePadArea>
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>{<ExampleText>Maya Chen, Client</ExampleText>}</span>
              <span>{<ExampleText>{signedAtLabel ?? "Dated on signing"}</ExampleText>}</span>
            </div>
          </SignaturePad>
          <Field orientation="horizontal">
            <Checkbox
              id={exampleId(`${id}-agree`)}
              checked={agreed}
              disabled={signedAt !== null}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <FieldLabel htmlFor={exampleId(`${id}-agree`)}>
              {<ExampleText>I have read and agree to the agreement </ExampleText>}</FieldLabel>
          </Field>
        </div>
      </CardContent>
      <CardFooter>
        {<ExampleText>{signedAt ? (
          <p
            ref={(node) => node?.focus()}
            tabIndex={-1}
            role="status"
            className="w-full text-center text-sm font-medium outline-none"
          >
            {<ExampleText>Agreement signed </ExampleText>}</p>
        ) : (
          <Button
            className="w-full"
            disabled={!agreed || strokes.length === 0}
            onClick={() => setSignedAt(EXAMPLE_EPOCH)}
          >
            {<ExampleText>Sign agreement </ExampleText>}</Button>
        )}</ExampleText>}
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
