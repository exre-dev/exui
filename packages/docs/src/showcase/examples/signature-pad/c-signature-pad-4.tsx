"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, EXAMPLE_EPOCH } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, DownloadIcon, ImageIcon, PenToolIcon, PlayIcon } from "lucide-react"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@exre/exui"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadRedo,
  SignaturePadUndo,
  type SignaturePadApi,
  type SignaturePadStroke,
} from "@exre/exui"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Separator } from "@exre/exui"


/* `undefined` follows the theme's text color, so it stays legible in dark mode. */
const INKS = [
  { label: "Default", color: undefined, swatch: "bg-foreground" },
  { label: "Blue", color: "#2563eb", swatch: "bg-blue-600" },
  { label: "Green", color: "#059669", swatch: "bg-emerald-600" },
]

const WEIGHTS = [
  { label: "Fine", min: 0.5, max: 1.8, sample: 1 },
  { label: "Medium", min: 0.8, max: 3.2, sample: 1.75 },
  { label: "Bold", min: 1.6, max: 5.5, sample: 2.75 },
]

function Swatch({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ring-foreground/15 size-3.5 shrink-0 rounded-full ring-1 ring-inset",
        className
      )}
    />
  )
}

function Stroke({ width }: { width: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 12"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={width}
      className="w-5 shrink-0"
    >
      <path d="M2 8c3-5 6-5 9-1s7 4 11-3" />
    </svg>
  )
}

function download(href: string, name: string) {
  const link = document.createElement("a")
  link.href = href
  link.download = name
  link.click()
}

function DownloadMenuIcon({ format }: { format: "png" | "svg" }) {
  return format === "png" ? (
    <ImageIcon aria-hidden="true" />
  ) : (
    <PenToolIcon aria-hidden="true" />
  )
}

const DOWNLOADS = [
  { format: "png", label: "PNG image" },
  { format: "svg", label: "SVG vector" },
] as const

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample, language } = useExampleRuntime()

  const [ink, setInk] = useState(INKS[0])
  const [weight, setWeight] = useState(WEIGHTS[1])
  const [strokes, setStrokes] = useState<SignaturePadStroke[]>([])
  /* While set, the pad shows this partial copy instead of the real value. */
  const [replay, setReplay] = useState<SignaturePadStroke[] | null>(null)
  const [signedAt, setSignedAt] = useState<number | null>(null)
  const signedAtLabel = signedAt === null ? null : new Intl.DateTimeFormat(language === "zh-CN" ? "zh-CN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(signedAt)
  const frame = useRef(0)
  const padRef = useRef<SignaturePadApi>(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const playBack = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const total = strokes.reduce((sum, stroke) => sum + stroke.points.length, 0)
    const perFrame = Math.max(2, Math.ceil(total / 80))
    let shown = 0
    const step = () => {
      shown += perFrame
      let left = shown
      const partial: SignaturePadStroke[] = []
      for (const stroke of strokes) {
        if (left <= 0) break
        partial.push(
          left >= stroke.points.length
            ? stroke
            : { ...stroke, points: stroke.points.slice(0, left) }
        )
        left -= stroke.points.length
      }
      if (shown < total) {
        setReplay(partial)
        frame.current = requestAnimationFrame(step)
      } else {
        setReplay(null)
      }
    }
    frame.current = requestAnimationFrame(step)
  }

  const locked = signedAt !== null || replay !== null

  /* Through apiRef, so a menu item outside the pad's parts can export it.
     Paper-white PNG, so the file reads the same on any page. */
  const save = (format: "png" | "svg") => {
    const value = padRef.current?.serialize(
      format,
      format === "png" ? { background: "#ffffff" } : undefined
    )
    if (value) download(value, `signature.${format}`)
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{<ExampleText>Statement of work</ExampleText>}</CardTitle>
        <CardDescription>
          <span className="flex items-center gap-2">
            {<ExampleText>Harbor &amp; Pine Design </ExampleText>}<span
              aria-hidden="true"
              className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
            />
            {<ExampleText>SOW-2041 </ExampleText>}</span>
        </CardDescription>
        <CardAction>
          {/* Up here, away from Sign statement, so a double click on it
              cannot land on Edit and reopen what was just signed. */}
          <div className="flex items-center gap-2">
            {<ExampleText>{signedAt && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSignedAt(null)
                  requestAnimationFrame(() => padRef.current?.focus())
                }}
              >
                {<ExampleText>Edit </ExampleText>}</Button>
            )}</ExampleText>}
            <Badge variant={signedAt ? "success-light" : "secondary"}>
              {<ExampleText>{signedAt ? "Signed" : "Draft"}</ExampleText>}
            </Badge>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SignaturePad
          apiRef={padRef}
          /* Replay swaps in a partial copy; readOnly keeps a stray stroke
             from landing in it and being committed as the real value. */
          value={replay ?? strokes}
          onValueChange={setStrokes}
          color={ink.color}
          minWidth={weight.min}
          maxWidth={weight.max}
          readOnly={locked}
        >
          <SignaturePadArea aria-label={copyExample("Client signature")} className="h-44">
            {/* Raised off the edge so the name below the line has room. */}
            <SignaturePadGuide className="bottom-11" />
            <SignaturePadPlaceholder />
            <p
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute start-6 bottom-4 text-xs"
            >
              {<ExampleText>Daniel Reyes, Client </ExampleText>}</p>
          </SignaturePadArea>
          {/* One ghost row: each trigger shows its current choice and names
              it in the label, so the menus need no visible caption. */}
          <div className="flex items-center gap-1 pt-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={(formatExample("Ink color, {color}", { color: copyExample(ink.label) }))}
                  disabled={locked}
                >
                  <Swatch className={ink.swatch} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{<ExampleText>Ink color</ExampleText>}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={ink.label}
                    onValueChange={(value) => {
                      const option = INKS.find((item) => item.label === value)
                      if (option) setInk(option)
                    }}
                  >
                    {<ExampleText>{INKS.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.label}
                        value={option.label}
                      >
                        <Swatch className={option.swatch} />
                        {<ExampleText>{option.label}</ExampleText>}
                      </DropdownMenuRadioItem>
                    ))}</ExampleText>}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={(formatExample("Line weight, {weight}", { weight: copyExample(weight.label) }))}
                  disabled={locked}
                >
                  <Stroke width={weight.sample} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{<ExampleText>Line weight</ExampleText>}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={weight.label}
                    onValueChange={(value) => {
                      const option = WEIGHTS.find(
                        (item) => item.label === value
                      )
                      if (option) setWeight(option)
                    }}
                  >
                    {<ExampleText>{WEIGHTS.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.label}
                        value={option.label}
                      >
                        <Stroke width={option.sample} />
                        {<ExampleText>{option.label}</ExampleText>}
                      </DropdownMenuRadioItem>
                    ))}</ExampleText>}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" className="mx-1 my-auto h-4" />
            <SignaturePadUndo variant="ghost" />
            <SignaturePadRedo variant="ghost" />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={copyExample("Replay signature")}
              disabled={strokes.length === 0 || locked}
              onClick={playBack}
            >
              <PlayIcon aria-hidden="true" />
            </Button>
            <SignaturePadClear variant="ghost" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={copyExample("Download signature")}
                  className="ms-auto"
                  disabled={strokes.length === 0 || replay !== null}
                >
                  <DownloadIcon aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{<ExampleText>Download as</ExampleText>}</DropdownMenuLabel>
                  {<ExampleText>{DOWNLOADS.map((option) => (
                    <DropdownMenuItem
                      key={option.format}
                      onClick={() => save(option.format)}
                    >
                      <DownloadMenuIcon format={option.format} />
                      {<ExampleText>{option.label}</ExampleText>}
                    </DropdownMenuItem>
                  ))}</ExampleText>}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SignaturePad>
      </CardContent>
      <CardFooter>
        {<ExampleText>{signedAt ? (
          <p
            ref={(node) => node?.focus()}
            tabIndex={-1}
            role="status"
            className="text-muted-foreground ms-auto flex items-center gap-1.5 text-sm outline-none"
          >
            <CircleCheckIcon aria-hidden="true" className="text-success size-4" />
            {<ExampleText>Signed </ExampleText>}{<ExampleText>{signedAtLabel}</ExampleText>}
          </p>
        ) : (
          <Button
            className="ms-auto"
            disabled={strokes.length === 0 || replay !== null}
            onClick={() => setSignedAt(EXAMPLE_EPOCH)}
          >
            {<ExampleText>Sign statement </ExampleText>}</Button>
        )}</ExampleText>}
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
