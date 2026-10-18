"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"

const code = `export function parseAmount(input: string) {
  const value = parseInt(input)
  if (value == NaN) return 0
  return value
}`

  function OriginalPattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        lineLevels={{ error: [3], warning: [2] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>parse-amount.ts</ExampleText>}</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant="destructive-light">{<ExampleText>1 error</ExampleText>}</Badge>
            <Badge variant="warning-light">{<ExampleText>1 warning</ExampleText>}</Badge>
          </div>
        </CodeBlockHeader>

        {/*
          One group is REGISTERED for the whole block and rendered inside
          whichever row is active, so a 2,000 line file costs a single button.
          Gated on the diagnostic: a fix offer on a clean line is noise.
        */}
        <CodeBlockLineActions>
          {({ line, state }) =>
            state?.level ? (
              <Button size="xs" variant="outline" className="bg-background">
                {<ExampleText>Fix line </ExampleText>}{<ExampleText>{line}</ExampleText>}
              </Button>
            ) : null
          }
        </CodeBlockLineActions>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "13.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
