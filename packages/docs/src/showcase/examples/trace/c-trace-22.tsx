"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CloudUploadIcon, GlobeIcon, ImageIcon, VideoIcon } from "lucide-react"
import * as React from "react"

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

const RENDITIONS = [
  { label: "2160p HEVC", speed: 4, size: "1.4 GB" },
  { label: "1080p H.264", speed: 7, size: "612 MB" },
  { label: "720p H.264", speed: 11, size: "318 MB" },
]

const AFTER_ENCODE = ["thumbnails", "publish", "done"] as const

type Stage = "encode" | (typeof AFTER_ENCODE)[number]

const STATUS = ["pending", "running", undefined] as const

const LABELS = {
  thumbnails: [
    "Generate thumbnails",
    "Generating 24 thumbnails",
    "Generated 24 thumbnails",
  ],
  publish: [
    "Publish to the CDN",
    "Publishing to the CDN",
    "Published to the CDN",
  ],
} as const

// Renditions encode in parallel under one row that stays open while any of
// them runs.
function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()
  const [progress, setProgress] = React.useState(() => RENDITIONS.map(() => 0))
  // Steps finished after encoding: 0 while thumbnails run, 2 when published.
  const [after, setAfter] = React.useState(0)
  const [encodeOpen, setEncodeOpen] = React.useState<boolean>()

  // The stage is derived, never stored, so it cannot lag behind the numbers.
  const finished = progress.filter((p) => p >= 100).length
  const encoding = finished < RENDITIONS.length
  const stage: Stage = encoding ? "encode" : AFTER_ENCODE[after]

  React.useEffect(() => {
    if (stage === "done") return
    const timer = window.setTimeout(
      () =>
        encoding
          ? setProgress((current) =>
              current.map((p, i) => Math.min(100, p + RENDITIONS[i].speed))
            )
          : setAfter((n) => n + 1),
      encoding ? 160 : 1200
    )
    return () => window.clearTimeout(timer)
  }, [stage, encoding, progress])

  // 0 pending, 1 running, 2 done: the index into that step's LABELS.
  const stepState = (step: keyof typeof LABELS) => {
    const index = AFTER_ENCODE.indexOf(step)
    if (encoding || after < index) return 0
    return after === index ? 1 : 2
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CloudUploadIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Uploaded launch-keynote.mov</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>1.8 GB</ExampleText></TraceDescription>
        </TraceLine>
        <TraceCollapsible
          open={encodeOpen ?? encoding}
          onOpenChange={setEncodeOpen}
        >
          <TraceCollapsibleTrigger>
            <TraceLine status={encoding ? "running" : undefined}>
              <TraceIcon>
                <VideoIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>
                {encoding
                  ? formatExample("Encoding {count} renditions", { count: RENDITIONS.length })
                  : formatExample("Encoded {count} renditions", { count: RENDITIONS.length })}
              </ExampleText></TraceTitle>
              <TraceDescription><ExampleText>
                {finished} of {RENDITIONS.length}
              </ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {RENDITIONS.map((rendition, index) => {
                const done = progress[index] >= 100
                return (
                  <TraceLine
                    key={rendition.label}
                    status={done ? undefined : "running"}
                  >
                    <TraceTitle><ExampleText>
                      {done ? "Encoded" : "Encoding"} {rendition.label}
                    </ExampleText></TraceTitle>
                    {/* Percentages tick several times a second, so they
                          are hidden from screen readers; the done line is not. */}
                    <TraceDescription aria-hidden={!done}><ExampleText>
                      {done ? rendition.size : `${progress[index]}%`}
                    </ExampleText></TraceDescription>
                  </TraceLine>
                )
              })}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status={STATUS[stepState("thumbnails")]}>
          <TraceIcon>
            <ImageIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>{LABELS.thumbnails[stepState("thumbnails")]}</ExampleText></TraceTitle>
        </TraceLine>
        <TraceLine status={STATUS[stepState("publish")]}>
          <TraceIcon>
            <GlobeIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>{LABELS.publish[stepState("publish")]}</ExampleText></TraceTitle>
        </TraceLine>
      </Trace>
      <p role="status" className="sr-only"><ExampleText>
        {stage === "done" ? "Video ready, 4 renditions published" : ""}
      </ExampleText></p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
