"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpIcon, CodeIcon, FileSpreadsheetIcon, FileTextIcon, ImageIcon, PaperclipIcon, XIcon } from "lucide-react"

import { useId, useState, type ReactNode } from "react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@exre/exui"


const ICON_SHEET = (
  <FileSpreadsheetIcon aria-hidden="true" />
)

const ICON_IMAGE = (
  <ImageIcon aria-hidden="true" />
)

const ICON_TEXT = (
  <FileTextIcon aria-hidden="true" />
)

const ICON_CODE = (
  <CodeIcon aria-hidden="true" />
)

const ICON_REMOVE = (
  <XIcon aria-hidden="true" />
)

const ICON_ATTACH = (
  <PaperclipIcon aria-hidden="true" />
)

const ICON_SEND = (
  <ArrowUpIcon aria-hidden="true" />
)

type Source = {
  id: string
  name: string
  icon: ReactNode
}

// Icons ride in the data as ready made nodes rather than component
// references. The shadcn CLI rewrites IconPlaceholder props where it finds
// them, so the five names have to sit in the source as plain literals.
const FILES: Source[] = [
  { id: "churn", name: "churn-drivers.csv", icon: ICON_SHEET },
  { id: "pricing", name: "pricing-tiers-v4.xlsx", icon: ICON_SHEET },
  { id: "latency", name: "checkout-latency.png", icon: ICON_IMAGE },
  { id: "limits", name: "rate-limits.md", icon: ICON_TEXT },
  { id: "trace", name: "stack-trace-2041.log", icon: ICON_CODE },
  { id: "invoice", name: "invoice-3182.pdf", icon: ICON_TEXT },
]

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, copy: copyExample } = useExampleRuntime()

  // useId rather than a fixed string, so the label and the textarea stay
  // paired even when two copies of this composer share one page.
  const id = useId()
  const [attachedIds, setAttachedIds] = useState<string[]>([
    "churn",
    "pricing",
    "latency",
  ])

  // Both lists are derived during render rather than stored. A second piece of
  // state for "the next file" would only have to be kept in step with the
  // first, and the paperclip already knows everything it needs from the ids.
  const attached = FILES.filter((file) => attachedIds.includes(file.id))
  const next = FILES.find((file) => !attachedIds.includes(file.id))

  // The tray renders only when it holds something. An empty block-start addon
  // still draws its own padding, which would leave a dead band above the
  // textarea the moment the last chip is removed.
  const hasTray = attached.length > 0

  // One sentence, rendered twice. The visible copy sits in the composer
  // chrome, which nothing announces, so a live region repeats it below and
  // makes each removal audible.
  const summary = formatExample("{count} of {total} attached", { count: attached.length, total: FILES.length })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      <form onSubmit={(event) => event.preventDefault()}>
        <Field>
          <FieldLabel htmlFor={exampleId(id)} className="sr-only">
            {<ExampleText>Message the assistant </ExampleText>}</FieldLabel>
          <InputGroup>
            {<ExampleText>{hasTray ? (
              <InputGroupAddon align="block-start">
                {/*
                 * AttachmentGroup forces its children to flex-none and scrolls
                 * them, so the fourth and fifth chips slide sideways instead of
                 * adding a second row and shoving the transcript off screen.
                 */}
                <AttachmentGroup role="group" aria-label={copyExample("Attached files")}>
                  {<ExampleText>{attached.map((file) => (
                    <ExampleRuntimeConsumer key={file.id} render={({format: formatExample}) => (<Attachment key={file.id} size="xs" className="max-w-52">
                      <AttachmentMedia>{<ExampleText>{file.icon}</ExampleText>}</AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{<ExampleText>{file.name}</ExampleText>}</AttachmentTitle>
                      </AttachmentContent>
                      <AttachmentActions>
                        {/*
                         * type="button" is spelled out because this composer is
                         * a real form, and a button with no explicit type
                         * submits it.
                         */}
                        <AttachmentAction
                          type="button"
                          aria-label={(formatExample("Remove {name}", { name: file.name }))}
                          onClick={() =>
                            setAttachedIds((current) =>
                              current.filter((value) => value !== file.id)
                            )
                          }
                        >
                          {<ExampleText>{ICON_REMOVE}</ExampleText>}
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>)} />
                  ))}</ExampleText>}
                </AttachmentGroup>
              </InputGroupAddon>
            ) : null}</ExampleText>}

            {/*
             * The textarea grows with the draft and stops at a cap, so a long
             * message scrolls inside the box instead of pushing the tray off
             * the top.
             */}
            <InputGroupTextarea
              id={exampleId(id)}
              placeholder={copyExample("Ask about the billing incident...")}
              className="field-sizing-content max-h-32 min-h-10"
            />

            <InputGroupAddon align="block-end">
              {/*
               * Once the pool runs dry the paperclip is disabled rather than
               * removed: a control that vanishes reflows the row and explains
               * nothing.
               */}
              <InputGroupButton
                type="button"
                size="icon-sm"
                aria-label={copyExample("Attach a file")}
                disabled={!next}
                onClick={() => {
                  if (next) {
                    setAttachedIds((current) => [...current, next.id])
                  }
                }}
              >
                {<ExampleText>{ICON_ATTACH}</ExampleText>}
              </InputGroupButton>
              <InputGroupText>{<ExampleText><>{summary}</></ExampleText>}</InputGroupText>
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="ms-auto"
              >
                {<ExampleText>{ICON_SEND}</ExampleText>}
                <span className="sr-only">{<ExampleText>Send</ExampleText>}</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </form>
      <span className="sr-only" aria-live="polite">
        {<ExampleText><>{summary}</></ExampleText>}
      </span>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
