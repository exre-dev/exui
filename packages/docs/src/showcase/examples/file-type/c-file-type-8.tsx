"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { RotateCwIcon, XIcon } from "lucide-react"

import { useRef, useState } from "react"
import {
  FileType,
  getFileType,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"
import { Progress } from "@exre/exui"


/**
 * The same name, type and size a browser File carries, plus the upload
 * state. `type` is the MIME type, which a Blob or a pasted image has even
 * when its name says nothing useful.
 */
type QueuedFile = {
  id: string
  name: string
  type: string
  size: number
  progress: number
  status: "uploading" | "done" | "failed"
}

const QUEUE: QueuedFile[] = [
  {
    id: "contract",
    name: "vendor-contract-2027.pdf",
    type: "application/pdf",
    size: 2_140_000,
    progress: 100,
    status: "done",
  },
  {
    id: "forecast",
    name: "q4-forecast.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 1_460_000,
    progress: 72,
    status: "uploading",
  },
  {
    id: "walkthrough",
    name: "onboarding-walkthrough.mov",
    type: "video/quicktime",
    size: 48_600_000,
    progress: 18,
    status: "uploading",
  },
  {
    id: "assets",
    name: "brand-assets.zip",
    type: "application/zip",
    size: 12_400_000,
    progress: 38,
    status: "failed",
  },
]

// Decimal units (1 MB is 1,000,000 bytes), as macOS Finder shows them, so a
// size here matches the one the user saw when picking the file.
function formatSize(bytes: number) {
  return bytes < 1_000_000
    ? `${Math.round(bytes / 1_000)} KB`
    : `${(bytes / 1_000_000).toFixed(1)} MB`
}

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample } = useExampleRuntime()

  const [files, setFiles] = useState<QueuedFile[]>(QUEUE)
  const statusRef = useRef<HTMLParagraphElement>(null)

  // Counted during render, so the summary can never disagree with the rows.
  const done = files.filter((file) => file.status === "done").length
  const failed = files.filter((file) => file.status === "failed").length

  // The button that was clicked unmounts with its row (or its retry slot),
  // so focus moves to the summary first and the new count is read out.
  const remove = (id: string) => {
    statusRef.current?.focus()
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  // A real retry restarts the transfer. The demo resolves it at once rather
  // than faking progress with a timer.
  const retry = (id: string) => {
    statusRef.current?.focus()
    setFiles((current) =>
      current.map((file) =>
        file.id === id ? { ...file, progress: 100, status: "done" } : file
      )
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <p
        ref={statusRef}
        role="status"
        tabIndex={-1}
        className="text-muted-foreground text-xs outline-none"
      >
        {<ExampleText>{files.length === 0
          ? "No files in the queue."
          : <>{failed
            ? formatExample("{done} of {total} uploaded, {failed} failed", { done, total: files.length, failed })
            : formatExample("{done} of {total} uploaded", { done, total: files.length })}</>}</ExampleText>}
      </p>
      {<ExampleText>{files.length > 0 ? (
        <ItemGroup aria-label={copyExample("Upload queue")}>
          {<ExampleText>{files.map((file) => (
            <ExampleRuntimeConsumer key={file.id} render={({format: formatExample, copy: copyExample}) => (<Item key={file.id} role="listitem" variant="outline" size="sm">
              <ItemMedia>
                {/* Hidden from assistive tech: the name below ends in its extension. */}
                <FileType
                  type={getFileType(file.type)}
                  size="sm"
                  aria-hidden="true"
                />
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="max-w-full">
                  <span className="truncate" title={copyExample(file.name)}>
                    {<ExampleText>{file.name}</ExampleText>}
                  </span>
                </ItemTitle>
                {/*
                 * One line in every state, so rows keep the same height as
                 * they move from a bar to a result.
                 */}
                {<ExampleText>{file.status === "uploading" ? (
                  <div className="flex h-4 items-center gap-2">
                    {/*
                     * Named per file: unnamed, every bar in the list is
                     * announced as the same bare percentage.
                     */}
                    <Progress
                      value={file.progress}
                      aria-label={(formatExample("Uploading {name}", { name: file.name }))}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground w-8 text-right text-xs tabular-nums">
                      {<ExampleText>{file.progress}</ExampleText>}%
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs leading-4">
                    {<ExampleText>{formatSize(file.size)}</ExampleText>}
                    <span
                      aria-hidden="true"
                      className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
                    />
                    {<ExampleText>{file.status === "done" ? (
                      "Uploaded"
                    ) : (
                      <span className="text-destructive">
                        {<ExampleText>Failed at </ExampleText>}{<ExampleText>{file.progress}</ExampleText>}%
                      </span>
                    )}</ExampleText>}
                  </p>
                )}</ExampleText>}
              </ItemContent>
              <ItemActions>
                {<ExampleText>{file.status === "failed" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={(formatExample("Retry upload of {name}", { name: file.name }))}
                    onClick={() => retry(file.id)}
                  >
                    <RotateCwIcon aria-hidden="true" />
                  </Button>
                ) : null}</ExampleText>}
                {/* Cancelling a transfer and removing a result are different promises. */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={
                    (file.status === "uploading"
                      ? formatExample("Cancel upload of {name}", { name: file.name })
                      : formatExample("Remove {name}", { name: file.name }))
                  }
                  onClick={() => remove(file.id)}
                >
                  <XIcon aria-hidden="true" />
                </Button>
              </ItemActions>
            </Item>)} />
          ))}</ExampleText>}
        </ItemGroup>
      ) : null}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
