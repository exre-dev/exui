
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

const code = `const client = createClient({
  url: process.env.DATABASE_URL,
  maxConnections: 20,
  idleTimeoutMillis: 30000,
})

await client.connect()`

  function OriginalPattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        highlightedLines="2-4"
        highlightedWords={["createClient", "maxConnections"]}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>db/client.ts</ExampleText>}</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "16.875rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
