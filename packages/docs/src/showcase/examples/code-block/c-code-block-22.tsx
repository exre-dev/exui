"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent, CardFooter } from "@exre/exui"

const patch = `export async function retryPayment(orderId: string) {
  const order = await orders.find(orderId)
  await payments.charge(order)
  const receipt = await payments.charge(order, { idempotencyKey: orderId })
  await notify.customer(order, receipt)
  return receipt
}`

/*
 * `variant="ghost"` drops the block's own border and background so the Card
 * supplies the chrome exactly once; the zeroed Card padding is what lets the
 * ghost surface sit flush against the footer.
 */
  function OriginalPattern() {
  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(null)

  return (
    <Card className="w-full max-w-2xl gap-0 py-0">
      <CardContent className="p-0">
        <CodeBlock
          code={patch}
          language="typescript"
          showLineNumbers
          variant="ghost"
          diff={{ added: [4, 5, 6], removed: [3] }}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>{<ExampleText>billing/retry-payment.ts</ExampleText>}</CodeBlockTitle>
            <div className="ml-auto flex items-center gap-1.5">
              <Badge variant="success-light">+3</Badge>
              <Badge variant="destructive-light">-1</Badge>
            </div>
          </CodeBlockHeader>
        </CodeBlock>
      </CardContent>

      <CardFooter className="border-border bg-muted/40 border-t px-3 py-2!">
        <span className="text-muted-foreground text-xs">
          {<ExampleText>{decision === null && "Agent proposed this change"}</ExampleText>}
          {<ExampleText>{decision === "accepted" && "Change applied to the branch"}</ExampleText>}
          {<ExampleText>{decision === "rejected" && "Change discarded"}</ExampleText>}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {<ExampleText>{decision === null ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDecision("rejected")}
              >
                {<ExampleText>Reject </ExampleText>}</Button>
              <Button size="sm" onClick={() => setDecision("accepted")}>
                {<ExampleText>Accept </ExampleText>}</Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setDecision(null)}>
              {<ExampleText>Undo </ExampleText>}</Button>
          )}</ExampleText>}
        </div>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "20rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
