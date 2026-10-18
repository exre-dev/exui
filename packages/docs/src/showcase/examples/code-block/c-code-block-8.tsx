"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"

const code = `export async function checkout(cart: Cart) {
  const totals = computeTotals(cart)

  const session = await payments.createSession({
    amount: totals.total,
    currency: cart.currency,
  })

  await audit.record("checkout.started", session.id)
  return session
}`

const steps = [
  { label: "Totals", lines: "2" },
  { label: "Payment session", lines: "4-7" },
  { label: "Audit", lines: "9-10" },
]

/*
 * `focusedLines` keeps a step sharp and dims the rest - unlike highlighting,
 * which adds emphasis without taking any away. Hovering the block restores
 * everything, so the surrounding code is one glance away.
 */
  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [step, setStep] = useState(0)

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        focusedLines={steps[step].lines}
      >
        <CodeBlockHeader className="gap-1.5">
          <CodeBlockTitle>{<ExampleText>checkout.ts</ExampleText>}</CodeBlockTitle>
          <div
            role="group"
            aria-label={copyExample("Walkthrough step")}
            className="ml-auto flex items-center gap-1"
          >
            {<ExampleText>{steps.map((entry, index) => (
              <Button
                key={entry.label}
                aria-pressed={index === step}
                size="xs"
                variant={index === step ? "secondary" : "ghost"}
                onClick={() => setStep(index)}
              >
                {<ExampleText>{entry.label}</ExampleText>}
              </Button>
            ))}</ExampleText>}
          </div>
          <Badge variant="primary-light">
            {<ExampleText>{step + 1}</ExampleText>}/{<ExampleText>{steps.length}</ExampleText>}
          </Badge>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "22.5rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
