"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import { Badge } from "@exre/exui"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadControls,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadUndo,
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
import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const id = useId()
  const [recipient, setRecipient] = useState("")
  const [strokes, setStrokes] = useState<SignaturePadStroke[]>([])
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{<ExampleText>Proof of delivery</ExampleText>}</CardTitle>
        <CardDescription>
          <span className="flex items-center gap-2">
            {<ExampleText>Order #48213 </ExampleText>}<span
              aria-hidden="true"
              className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
            />
            {<ExampleText>3 parcels </ExampleText>}</span>
        </CardDescription>
        {<ExampleText>{confirmed && (
          <CardAction>
            <Badge variant="success-light">{<ExampleText>Delivered</ExampleText>}</Badge>
          </CardAction>
        )}</ExampleText>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor={exampleId(`${id}-recipient`)}>{<ExampleText>Received by</ExampleText>}</FieldLabel>
            <Input
              id={exampleId(`${id}-recipient`)}
              value={recipient}
              disabled={confirmed}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder={copyExample("Recipient name")}
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel id={exampleId(`${id}-signature`)}>{<ExampleText>Recipient signature</ExampleText>}</FieldLabel>
            {/* The area blocks page scroll under a finger, so the recipient can sign on a phone. */}
            <SignaturePad
              value={strokes}
              onValueChange={setStrokes}
              readOnly={confirmed}
            >
              <SignaturePadArea
                aria-labelledby={exampleId(`${id}-signature`)}
                className="h-44"
              >
                <SignaturePadGuide />
                <SignaturePadPlaceholder>
                  {<ExampleText>Hand the device to the recipient </ExampleText>}</SignaturePadPlaceholder>
                {<ExampleText>{!confirmed && (
                  <SignaturePadControls position="top-end">
                    <SignaturePadUndo variant="ghost" />
                    <SignaturePadClear variant="ghost" />
                  </SignaturePadControls>
                )}</ExampleText>}
              </SignaturePadArea>
            </SignaturePad>
          </Field>
        </div>
      </CardContent>
      <CardFooter>
        {<ExampleText>{confirmed ? (
          <p
            ref={(node) => node?.focus()}
            tabIndex={-1}
            role="status"
            className="w-full text-center text-sm font-medium outline-none"
          >
            {<ExampleText>Delivered to </ExampleText>}{<ExampleText>{recipient.trim()}</ExampleText>}
          </p>
        ) : (
          <Button
            size="lg"
            className="w-full"
            disabled={!recipient.trim() || strokes.length === 0}
            onClick={() => setConfirmed(true)}
          >
            {<ExampleText>Confirm delivery </ExampleText>}</Button>
        )}</ExampleText>}
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
