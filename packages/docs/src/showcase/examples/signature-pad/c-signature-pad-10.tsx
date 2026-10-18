"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, CircleDashedIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadControls,
  SignaturePadPlaceholder,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


const CLAUSES = [
  {
    id: "scope",
    number: 2,
    title: "Scope of work",
    description: "Design and build of the marketing site, 6 templates.",
  },
  {
    id: "payment",
    number: 3,
    title: "Payment terms",
    description: "Invoiced monthly in arrears, due within 30 days.",
  },
  {
    id: "ownership",
    number: 4,
    title: "Ownership",
    description: "Source files transfer to the client on final payment.",
  },
  {
    id: "termination",
    number: 5,
    title: "Termination",
    description: "Either party, with 30 days written notice.",
  },
]

  function OriginalPattern() {
  const [initialed, setInitialed] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const count = CLAUSES.filter((clause) => initialed[clause.id]).length
  const complete = count === CLAUSES.length

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{<ExampleText>Initial each clause</ExampleText>}</p>
          <p className="text-muted-foreground text-xs">
            {<ExampleText>Your initials confirm you have read the section. </ExampleText>}</p>
        </div>
        <Badge variant={complete ? "success-light" : "secondary"}>
          {<ExampleText>{count}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{CLAUSES.length}</ExampleText>} {<ExampleText> initialed </ExampleText>}</Badge>
      </div>
      <ItemGroup>
        {<ExampleText>{CLAUSES.map((clause) => {
          const done = initialed[clause.id] === true
          return (
            <ExampleRuntimeConsumer key={clause.id} render={({format: formatExample, copy: copyExample}) => (<Item key={clause.id} variant="outline" size="sm">
              <ItemMedia variant="icon" aria-hidden="true">
                {<ExampleText>{done ? (
                  <CircleCheckIcon className="text-success" />
                ) : (
                  <CircleDashedIcon className="text-muted-foreground" />
                )}</ExampleText>}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {<ExampleText>{clause.number}</ExampleText>}. {<ExampleText>{clause.title}</ExampleText>}
                  {<ExampleText>{done && <span className="sr-only">{<ExampleText>, initialed</ExampleText>}</span>}</ExampleText>}
                </ItemTitle>
                <ItemDescription>{<ExampleText>{clause.description}</ExampleText>}</ItemDescription>
              </ItemContent>
              <ItemActions>
                {/* Initials are small, so the line range is narrower too. */}
                <SignaturePad
                  minWidth={0.6}
                  maxWidth={2.4}
                  readOnly={submitted}
                  className="w-28"
                  onValueChange={(strokes) =>
                    setInitialed((current) => ({
                      ...current,
                      [clause.id]: strokes.length > 0,
                    }))
                  }
                >
                  <SignaturePadArea
                    variant="muted"
                    aria-label={(formatExample("Initials for {title}", { title: copyExample(clause.title) }))}
                    className="h-14"
                  >
                    <SignaturePadPlaceholder>{<ExampleText>Initials</ExampleText>}</SignaturePadPlaceholder>
                    {<ExampleText>{done && !submitted && (
                      <SignaturePadControls className="end-1 top-1">
                        <SignaturePadClear variant="ghost" size="icon-xs" />
                      </SignaturePadControls>
                    )}</ExampleText>}
                  </SignaturePadArea>
                </SignaturePad>
              </ItemActions>
            </Item>)} />
          )
        })}</ExampleText>}
      </ItemGroup>
      {<ExampleText>{submitted ? (
        <p
          ref={(node) => node?.focus()}
          tabIndex={-1}
          role="status"
          className="self-end text-sm font-medium outline-none"
        >
          {<ExampleText>Initials submitted </ExampleText>}</p>
      ) : (
        <Button
          disabled={!complete}
          onClick={() => setSubmitted(true)}
          className="self-end"
        >
          {<ExampleText>Submit initials </ExampleText>}</Button>
      )}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
