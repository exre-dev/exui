"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SparklesIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"


const broken = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)
  const subtotal = lines.reduce((sum, amount) => sum + amount)
  return subtotal + invoice.tax
}`

const patched = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)
  const subtotal = lines.reduce((sum, amount) => sum + amount, 0)
  return subtotal + invoice.tax
}`

  function OriginalPattern() {
  const [fixed, setFixed] = useState(false)

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={fixed ? patched : broken}
        language="typescript"
        showLineNumbers
        lineLevels={fixed ? undefined : { error: [3] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>invoice.ts</ExampleText>}</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            {<ExampleText>{fixed ? (
              <>
                <Badge variant="success-light">{<ExampleText>Patch applied</ExampleText>}</Badge>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setFixed(false)}
                >
                  {<ExampleText>Undo </ExampleText>}</Button>
              </>
            ) : (
              <Badge variant="destructive-light">
                {<ExampleText>Empty array crashes reduce </ExampleText>}</Badge>
            )}</ExampleText>}
          </div>
        </CodeBlockHeader>

        {/*
          The action is scoped to the line that actually carries the diagnostic:
          the render prop receives that line's state, so one group serves the
          whole block and still only offers the fix where there is something to
          fix.
        */}
        <CodeBlockLineActions>
          {({ state }) =>
            state?.level === "error" ? (
              <Button size="xs" onClick={() => setFixed(true)}>
                <SparklesIcon  />
                {<ExampleText>Fix with AI </ExampleText>}</Button>
            ) : null
          }
        </CodeBlockLineActions>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "13.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
