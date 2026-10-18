
import { useExampleRuntime, ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockDownloadButton,
  CodeBlockHeader,
  CodeBlockTitle,
  parseUnifiedDiff,
} from "@exre/exui"

const patch = `diff --git a/lib/seats.ts b/lib/seats.ts
--- a/lib/seats.ts
+++ b/lib/seats.ts
@@ -12,7 +12,8 @@ export async function countBillableSeats(workspaceId: string) {
   const members = await db.member.findMany({ where: { workspaceId } })
-  const used = members.length
+  const used = members.filter((member) => !member.isGuest).length
+  if (used < 0) throw new SeatCountError(workspaceId)
   return { used, total: await seatAllowance(workspaceId) }
 }
diff --git a/app/api/invites/route.ts b/app/api/invites/route.ts
--- a/app/api/invites/route.ts
+++ b/app/api/invites/route.ts
@@ -3,6 +3,7 @@ export async function POST(request: Request) {
   const { email } = await request.json()
+  if (!email) return new Response("email required", { status: 422 })
   const invite = await createInvite(session.workspaceId, email)
   return Response.json(invite, { status: 201 })
 }`

/*
 * The whole review renders from ONE `parseUnifiedDiff` call: tints, +/-
 * glyphs and the dual old/new gutter numbers all come out of the parse, so
 * nothing here counts lines against a hand-concatenated string. The parsed
 * lines go in through the `lines` prop, which also means no highlighter runs.
 */
const files = parseUnifiedDiff(patch)

  function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      {<ExampleText>{files.map((file) => (
        <CodeBlock
          key={file.file}
          lines={file.lines}
          showLineNumbers
          label={formatExample("Patch for {file}", { file: file.file })}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>{file.file}</CodeBlockTitle>
            <div className="ml-auto flex items-center gap-1.5">
              <Badge variant="success-light">+{<ExampleText>{file.added}</ExampleText>}</Badge>
              <Badge variant="destructive-light">-{<ExampleText>{file.removed}</ExampleText>}</Badge>
              <CodeBlockDownloadButton
                filename={`${file.file.split("/").pop()}.patch`}
              />
            </div>
          </CodeBlockHeader>
        </CodeBlock>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "31.875rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
