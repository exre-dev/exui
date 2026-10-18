
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CodeIcon, FileJsonIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@exre/exui"


const ICON_REPORT = (
  <FileTextIcon aria-hidden="true" />
)

const ICON_SHEET = (
  <FileSpreadsheetIcon aria-hidden="true" />
)

const ICON_JSON = (
  <FileJsonIcon aria-hidden="true" />
)

const ICON_CODE = (
  <CodeIcon aria-hidden="true" />
)

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  // Size is hierarchy here, not decoration: default is the one thing the
  // reader is meant to open, sm is the working set behind it, and xs is the
  // evidence the answer cites. Three rungs, three jobs, no controls.
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        {/*
         * Each band still says in text what its size is already saying. Size
         * alone is a weak signal on screen and no signal at all in a reader.
         */}
        <p className="text-muted-foreground text-xs font-medium">{<ExampleText>Deliverable</ExampleText>}</p>
        <Attachment className="w-full">
          <AttachmentMedia>{<ExampleText>{ICON_REPORT}</ExampleText>}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{<ExampleText>billing-incident-report.pdf</ExampleText>}</AttachmentTitle>
            <AttachmentDescription>
              {<ExampleText>PDF </ExampleText>}<span
                aria-hidden="true"
                className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
              />
              {<ExampleText>2.3 MB </ExampleText>}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium">
          {<ExampleText>Working files </ExampleText>}</p>
        {/*
         * The first two bands stretch. The xs chips below keep their natural
         * width instead, so the group can scroll them rather than squeeze them.
         */}
        <Attachment size="sm" className="w-full">
          <AttachmentMedia>{<ExampleText>{ICON_SHEET}</ExampleText>}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{<ExampleText>refund-queue.csv</ExampleText>}</AttachmentTitle>
            <AttachmentDescription>
              {<ExampleText>CSV </ExampleText>}<span
                aria-hidden="true"
                className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
              />
              {<ExampleText>96 KB </ExampleText>}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment size="sm" className="w-full">
          <AttachmentMedia>{<ExampleText>{ICON_JSON}</ExampleText>}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{<ExampleText>webhook-replays.json</ExampleText>}</AttachmentTitle>
            <AttachmentDescription>
              {<ExampleText>JSON </ExampleText>}<span
                aria-hidden="true"
                className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
              />
              {<ExampleText>41 KB </ExampleText>}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium">
          {<ExampleText>Cited snippets </ExampleText>}</p>
        {/*
         * Only this band takes tabIndex: its chips carry no buttons, so the
         * ones scrolled off the end would be unreachable by keyboard without
         * a tab stop on the group itself.
         */}
        <AttachmentGroup tabIndex={0} role="group" aria-label={copyExample("Cited snippets")}>
          {/*
           * Dropping AttachmentDescription is also what tightens the padding
           * here: the per-style rule keys off whether a content slot exists.
           */}
          <Attachment size="xs">
            <AttachmentMedia>{<ExampleText>{ICON_CODE}</ExampleText>}</AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{<ExampleText>dunning.ts</ExampleText>}</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
          <Attachment size="xs">
            <AttachmentMedia>{<ExampleText>{ICON_CODE}</ExampleText>}</AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{<ExampleText>webhook-router.ts</ExampleText>}</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
          <Attachment size="xs">
            <AttachmentMedia>{<ExampleText>{ICON_REPORT}</ExampleText>}</AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{<ExampleText>retry-policy.md</ExampleText>}</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
