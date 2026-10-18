
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DownloadIcon, FileTextIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@exre/exui"


// Icon names are hoisted static literals because the shadcn CLI rewrites them
// to whichever icon library the installer picked, and it can only rewrite a
// literal. A computed or spread prop value installs as a blank square.
const ICON_REPORT = (
  <FileTextIcon aria-hidden="true" />
)

const ICON_DOWNLOAD = (
  <DownloadIcon aria-hidden="true" />
)

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <p className="text-sm">
        {<ExampleText>Here is the cohort breakdown you asked for. Numbers run through 30 September. </ExampleText>}</p>
      {/*
       * The root sizes to its own content, so a chip meant to fill the reply
       * column has to be told to stretch.
       */}
      <Attachment className="w-full">
        <AttachmentMedia>{<ExampleText>{ICON_REPORT}</ExampleText>}</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{<ExampleText>retention-cohorts-q3.pdf</ExampleText>}</AttachmentTitle>
          <AttachmentDescription>
            {<ExampleText>PDF </ExampleText>}<span
              aria-hidden="true"
              className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
            />
            {<ExampleText>1.9 MB </ExampleText>}</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          {/*
           * type="button" is spelled out because a bare <button> inside a form
           * defaults to submit, and this chip is meant to be pasted into one.
           */}
          <AttachmentAction
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label={copyExample("Download retention-cohorts-q3.pdf")}
          >
            {<ExampleText>{ICON_DOWNLOAD}</ExampleText>}
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
