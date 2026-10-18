"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@exre/exui"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@exre/exui"

const samples = [
  {
    file: "greeting.tsx",
    language: "tsx",
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello {name}</p>
}`,
  },
  {
    file: "greeting.py",
    language: "python",
    code: `def greeting(name: str) -> str:
    return f"Hello {name}"`,
  },
  {
    file: "greeting.sql",
    language: "sql",
    code: `select id, email
from users
where created_at > now() - interval '7 days';`,
  },
  {
    file: "greeting.sh",
    language: "bash",
    code: `curl -s https://api.example.com/v1/users \\
  -H "Authorization: Bearer $TOKEN"`,
  },
]

/*
 * One grammar chunk loads per selected language, so switching files is also a
 * lazy-loading demo.
 *
 * A dense frame is what makes this read as one editor: the panel meets the
 * header with no gap or inset, and the ghost block inside contributes no
 * second border. The tabs live in the header, so the blocks stay headerless
 * and the copy button pins itself over the code.
 */
  function OriginalPattern() {
  return (
    <Tabs defaultValue={samples[0].file} className="w-full max-w-2xl">
      <Frame dense spacing="sm">
        <FrameHeader className="flex-row items-center gap-2">
          <FrameTitle>{<ExampleText>Examples</ExampleText>}</FrameTitle>
          <TabsList className="ml-auto bg-transparent">
            {<ExampleText>{samples.map((sample) => (
              <TabsTrigger key={sample.file} value={sample.file}>
                {<ExampleText>{sample.file}</ExampleText>}
              </TabsTrigger>
            ))}</ExampleText>}
          </TabsList>
        </FrameHeader>

        <FramePanel className="p-0!">
          {<ExampleText>{samples.map((sample) => (
            <TabsContent key={sample.file} value={sample.file}>
              <CodeBlock
                code={sample.code}
                language={sample.language}
                variant="ghost"
                showLineNumbers
              >
                <CodeBlockCopyButton
                  variant="outline"
                  size="icon-xs"
                  className="bg-card hover:bg-muted"
                />
              </CodeBlock>
            </TabsContent>
          ))}</ExampleText>}
        </FramePanel>
      </Frame>
    </Tabs>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "11.25rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
