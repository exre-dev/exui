import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PencilIcon, SearchIcon, TerminalIcon } from "lucide-react"
import { CodeBlock } from "@exre/exui"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@exre/exui"

const patch = `export const csp = {
  frameSrc: ["'self'"],
  frameSrc: ["'self'", "*.stripe.com"],
  connectSrc: ["'self'", "*.stripe.com"],
}`

const testOutput = `✓ middleware/csp.test.ts (12 tests)
Tests  12 passed`

const lintOutput = `middleware/csp.ts
  14:7  error  'nonce' is unused`

// Each title says what happened, because TraceIcon is hidden from assistive
// tech and the title is all a screen reader gets.
function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    // Trace sizes its rows; the root sets the size of what they expand to.
    <div className="w-full max-w-md text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <SearchIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Searched the codebase for frameSrc</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>3 results</ExampleText></TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <PencilIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Edited middleware/csp.ts</ExampleText></TraceTitle>
              <TraceDescription>+2 -1</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={patch}
              language="typescript"
              diff={{ added: [3, 4], removed: [2] }}
              label={copyExample("Patch for middleware/csp.ts")}
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <TerminalIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Ran pnpm vitest run csp</ExampleText></TraceTitle>
              <TraceDescription><ExampleText>12 passed</ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={testOutput}
              language="bash"
              highlight={false}
              label={copyExample("Test output")}
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <TerminalIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>pnpm lint failed with 1 error</ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={lintOutput}
              language="bash"
              lineLevels={{ error: [2] }}
              label={copyExample("Lint output")}
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="running">
          <TraceIcon>
            <PencilIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Removing the unused nonce</ExampleText></TraceTitle>
        </TraceLine>
      </Trace>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
