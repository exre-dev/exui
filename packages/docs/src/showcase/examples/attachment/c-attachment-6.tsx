"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"

import {
  formatBytes,
  useFileUpload,
} from "@exre/exui"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@exre/exui"


const ICON_UPLOAD = (
  <UploadIcon aria-hidden="true" />
)

const ICON_FILE = (
  <FileIcon aria-hidden="true" />
)

const ICON_REMOVE = (
  <XIcon aria-hidden="true" />
)

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  // The hook enforces the count and size limits and is what fills the errors
  // array below. Nothing here uploads: no endpoint, no submit button, so the
  // example cannot pretend to send what it has collected.
  const [{ files, errors }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      multiple: true,
      maxFiles: 5,
      maxSize: 10 * 1024 * 1024,
      accept: "image/*,.pdf,.csv",
    })

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
      {/*
       * The picker is an attachment rather than a box around one: state="idle"
       * draws the dashed border and the card's own focus-within ring puts
       * keyboard focus somewhere visible instead of on an invisible overlay.
       */}
      <Attachment state="idle" className="w-full">
        <AttachmentMedia>{<ExampleText>{ICON_UPLOAD}</ExampleText>}</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{<ExampleText>Choose files</ExampleText>}</AttachmentTitle>
          <AttachmentDescription>
            {<ExampleText>Images, PDF or CSV, up to 10 MB each </ExampleText>}</AttachmentDescription>
        </AttachmentContent>
        <AttachmentTrigger
          type="button"
          aria-haspopup="dialog"
          aria-label={copyExample("Choose files to attach")}
          onClick={openFileDialog}
        />
        {/*
         * The input stays in the accessibility tree as sr-only with
         * tabIndex={-1}: a display:none input cannot be opened by the hook,
         * and a second tab stop over the same action would only be noise.
         */}
        <input
          {...getInputProps()}
          className="sr-only"
          tabIndex={-1}
          aria-label={copyExample("Choose files to attach")}
        />
      </Attachment>

      {<ExampleText>{errors.length > 0 ? (
        <p className="text-destructive text-xs" role="alert">
          {<ExampleText>{errors[0]}</ExampleText>}
        </p>
      ) : null}</ExampleText>}

      {<ExampleText>{files.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {<ExampleText>{files.map((entry) => (
            <ExampleRuntimeConsumer key={entry.id} render={({format: formatExample, copy: copyExample}) => (<Attachment
              key={entry.id}
              state="idle"
              size="sm"
              className="w-full"
            >
              {<ExampleText>{entry.file.type.startsWith("image/") && entry.preview ? (
                <AttachmentMedia variant="image">
                  {/*
                   * The preview carries alt="" on purpose: the filename sits
                   * beside it, and a second announcement of the same file is
                   * noise rather than information.
                   */}
                  <img
                    src={entry.preview}
                    alt={copyExample("")}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                  />
                </AttachmentMedia>
              ) : (
                <AttachmentMedia>{<ExampleText>{ICON_FILE}</ExampleText>}</AttachmentMedia>
              )}</ExampleText>}
              <AttachmentContent>
                <AttachmentTitle>{<ExampleText>{entry.file.name}</ExampleText>}</AttachmentTitle>
                <AttachmentDescription>
                  {<ExampleText>{formatBytes(entry.file.size)}</ExampleText>}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                {/*
                 * removeFile is what revokes an image preview's object URL, so
                 * nothing here needs an effect to clean up after itself.
                 */}
                <AttachmentAction
                  type="button"
                  aria-label={(formatExample("Remove {name}", { name: entry.file.name }))}
                  onClick={() => removeFile(entry.id)}
                >
                  {<ExampleText>{ICON_REMOVE}</ExampleText>}
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>)} />
          ))}</ExampleText>}
        </div>
      ) : (
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {<ExampleText>No files chosen yet. </ExampleText>}</p>
      )}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
