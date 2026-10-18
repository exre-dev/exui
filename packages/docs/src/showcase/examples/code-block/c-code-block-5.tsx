
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

const code = `export function getCacheKey(request: Request) {
  const url = new URL(request.url)
  return url.href
  url.searchParams.delete("utm_source")
  url.searchParams.delete("utm_medium")
  url.searchParams.sort()
  return url.toString()
}`

  function OriginalPattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        diff={{ added: [4, 5, 6, 7], removed: [3] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>lib/cache-key.ts</ExampleText>}</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "18.125rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
