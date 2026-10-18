"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BugIcon, CircleCheckIcon, GitPullRequestArrowIcon, LockIcon, MessageSquareTextIcon } from "lucide-react"
import * as React from "react"
import { CodeBlock } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@exre/exui"
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

type Kind = "bug" | "security"

type Finding = {
  id: string
  kind: Kind
  title: string
  fixed: string
  file: string
  line: number
  explanation: string
  code: string
  // The line within `code` the comment is about, 1-based.
  focus: number
  suggestion: string
  diff: { added: number[]; removed: number[] }
}

const FINDINGS: Finding[] = [
  {
    id: "null-user",
    kind: "bug",
    title: "Null user in getInvoice",
    fixed: "Guarded the null user",
    file: "lib/billing/invoice.ts",
    line: 42,
    explanation:
      "getUser returns null for a deleted account, and the export job runs for those too.",
    code: `const user = await getUser(userId)
return user.invoices.find((i) => i.id === id)`,
    focus: 2,
    suggestion: `const user = await getUser(userId)
if (!user) throw new NotFoundError("user")
return user.invoices.find((i) => i.id === id)`,
    diff: { added: [2], removed: [] },
  },
  {
    id: "password-log",
    kind: "security",
    title: "Password in the error log",
    fixed: "Dropped the password from the log",
    file: "lib/auth/login.ts",
    line: 17,
    explanation: "Log lines are shipped to a third party and kept for 30 days.",
    code: `logger.error("login failed", { email, password })`,
    focus: 1,
    suggestion: `logger.error("login failed", { email, password })
logger.error("login failed", { email })`,
    diff: { added: [2], removed: [1] },
  },
]

type Resolution = "applied" | "dismissed"

// The Sheet returns focus to the row it opened from, which then says what
// happened to the comment.
function OriginalPattern() {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [resolved, setResolved] = React.useState<Record<string, Resolution>>({})

  const remaining = FINDINGS.filter((f) => !resolved[f.id]).length

  function resolve(id: string, resolution: Resolution) {
    setResolved((current) => ({ ...current, [id]: resolution }))
    setOpenId(null)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <GitPullRequestArrowIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Reviewed 6 changed files</ExampleText></TraceTitle>
          <TraceDescription>+214 -38</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <MessageSquareTextIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Left {FINDINGS.length} comments</ExampleText></TraceTitle>
              <TraceDescription><ExampleText>{remaining} open</ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {FINDINGS.map((finding) => {
                const resolution = resolved[finding.id]
                return (
                  <Sheet
                    key={finding.id}
                    open={openId === finding.id}
                    onOpenChange={(open) => setOpenId(open ? finding.id : null)}
                  >
                    <SheetTrigger>
                      <TraceLine>
                        <TraceIcon>
                          {resolution === "applied" ? (
                            <CircleCheckIcon aria-hidden="true"
                            />
                          ) : (
                            <KindGlyph kind={finding.kind} />
                          )}
                        </TraceIcon>
                        <TraceTitle><ExampleText>
                          {resolution === "applied"
                            ? finding.fixed
                            : resolution === "dismissed"
                              ? formatExample("Dismissed: {title}", { title: copyExample(finding.title) })
                              : finding.title}
                        </ExampleText></TraceTitle>
                        <TraceDescription><ExampleText>
                          {finding.file.split("/").pop()}:{finding.line}
                        </ExampleText></TraceDescription>
                      </TraceLine>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>{copyExample(finding.title)}</SheetTitle>
                        <SheetDescription>
                          {copyExample(finding.explanation)}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col gap-3 px-4">
                        <CodeBlock
                          code={finding.code}
                          language="typescript"
                          showLineNumbers
                          startLine={finding.line - finding.focus + 1}
                          highlightedLines={[finding.focus]}
                          label={formatExample("{file} at line {line}", { file: finding.file, line: finding.line })}
                        />
                        <p className="text-muted-foreground text-sm"><ExampleText>
                          Suggested change
                        </ExampleText></p>
                        <CodeBlock
                          code={finding.suggestion}
                          language="typescript"
                          diff={finding.diff}
                          wrap
                          label={copyExample("Suggested change")}
                        />
                      </div>
                      <SheetFooter className="flex-row">
                        <Button onClick={() => resolve(finding.id, "applied")}><ExampleText>
                          Apply suggestion
                        </ExampleText></Button>
                        <Button
                          variant="outline"
                          onClick={() => resolve(finding.id, "dismissed")}
                        ><ExampleText>
                          Dismiss
                        </ExampleText></Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}

function KindGlyph({ kind }: { kind: Kind }) {
  if (kind === "bug") {
    return (
      <BugIcon aria-hidden="true"
      />
    )
  }
  return (
    <LockIcon aria-hidden="true"
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
