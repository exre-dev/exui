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
  type SignaturePadStroke,
} from "@exre/exui"

import { Button } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const id = useId()
  const [mode, setMode] = useState<"draw" | "type">("draw")
  const [strokes, setStrokes] = useState<SignaturePadStroke[]>([])
  const [typed, setTyped] = useState("")
  const [adopted, setAdopted] = useState<"draw" | "type" | null>(null)

  /* Typing is the keyboard and screen reader route to the same outcome. */
  const ready = mode === "draw" ? strokes.length > 0 : typed.trim().length > 1

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value === "type" ? "type" : "draw")}
      >
        <TabsList>
          <TabsTrigger value="draw">{<ExampleText>Draw</ExampleText>}</TabsTrigger>
          <TabsTrigger value="type">{<ExampleText>Type</ExampleText>}</TabsTrigger>
        </TabsList>
        <TabsContent value="draw">
          <SignaturePad
            value={strokes}
            onValueChange={(next) => {
              setStrokes(next)
              setAdopted(null)
            }}
          >
            <SignaturePadArea className="h-40">
              <SignaturePadGuide />
              <SignaturePadPlaceholder />
              <SignaturePadControls position="top-end">
                <SignaturePadClear variant="ghost" />
              </SignaturePadControls>
            </SignaturePadArea>
          </SignaturePad>
        </TabsContent>
        <TabsContent value="type">
          <div className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor={exampleId(`${id}-typed`)}>{<ExampleText>Full name</ExampleText>}</FieldLabel>
              <Input
                id={exampleId(`${id}-typed`)}
                value={typed}
                onChange={(event) => {
                  setTyped(event.target.value)
                  setAdopted(null)
                }}
                autoComplete="name"
                placeholder={copyExample("Maya Chen")}
              />
            </Field>
            {/* A visual echo of the input, so it stays out of the reading order. */}
            <p
              aria-hidden="true"
              className="flex h-20 items-center justify-center border-b border-dashed px-4"
            >
              {<ExampleText>{typed.trim() ? (
                <span className="truncate font-serif text-3xl italic">
                  {<ExampleText>{typed.trim()}</ExampleText>}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">
                  {<ExampleText>Your typed signature appears here </ExampleText>}</span>
              )}</ExampleText>}
            </p>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex items-center gap-3">
        <Button disabled={!ready} onClick={() => setAdopted(mode)}>
          {<ExampleText>Adopt and sign </ExampleText>}</Button>
        <div role="status">
          {<ExampleText>{adopted && (
            <Badge variant="success-light">
              {<ExampleText>{adopted === "draw" ? "Drawn" : "Typed"}</ExampleText>} {<ExampleText> signature adopted </ExampleText>}</Badge>
          )}</ExampleText>}
        </div>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
