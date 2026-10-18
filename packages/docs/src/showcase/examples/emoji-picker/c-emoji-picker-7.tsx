"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon } from "lucide-react"

import { useRef, useState } from "react"
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerTrigger,
  type EmojiPickerEmoji,
} from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"
import { Textarea } from "@exre/exui"


/* The tabs a kudos note needs. Nature, food, travel and flags leave the
   browse view only: search still reaches every emoji the filter keeps.
   Recent shares its stored list with every picker in the app but resolves
   through the same filter, so a blocked emoji picked elsewhere never
   resurfaces here. */
const CATEGORIES = [
  "recent",
  "smileys",
  "people",
  "activities",
  "objects",
  "symbols",
]

/* Hexcodes kept out of a workplace recognition tool. */
const BLOCKED = new Set(["1F346", "1F351", "1F4A9", "1F595", "1F52B", "1F92C"])

/* Module scope, so the filter keeps one identity across renders. */
const workplaceSafe = (emoji: EmojiPickerEmoji) => !BLOCKED.has(emoji.id)

/* A space goes after a word or a sentence mark, never after a space, an
   opening bracket or another emoji, so two picks in a row sit flush. */
const SPACE_AFTER =
  /[^\s\p{Ps}\p{Pi}\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\u{FE0F}\u{20E3}\u{E007F}]$/u

/* And before a word, never before the comma or stop that follows it. */
const SPACE_BEFORE = /^[\p{L}\p{N}]/u

  function OriginalPattern() {
  const { copy: copyExample, language: exampleLanguage, locales: exampleLocales } = useExampleRuntime()

  const [note, setNote] = useState("")
  const [sent, setSent] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const confirmationRef = useRef<HTMLParagraphElement>(null)

  /* A blurred textarea keeps its selection, so the pick lands at the caret,
     spaced off the words beside it, and the caret stays right after it. */
  const insert = (emoji: string) => {
    const field = noteRef.current
    if (!field) return
    const { value, selectionStart, selectionEnd } = field
    const before = value.slice(0, selectionStart)
    const after = value.slice(selectionEnd)
    const lead = SPACE_AFTER.test(before) ? " " : ""
    const trail = SPACE_BEFORE.test(after) ? " " : ""
    const caret = before.length + lead.length + emoji.length
    field.value = before + lead + emoji + trail + after
    field.setSelectionRange(caret, caret)
    setNote(field.value)
  }

  /* Send unmounts with the composer, so focus moves to the confirmation
     instead of falling back to the page body. The frame waits for the
     commit that mounts it. */
  const send = () => {
    setSent(true)
    requestAnimationFrame(() => confirmationRef.current?.focus())
  }

  /* Undo brings the draft back untouched, caret at the end. */
  const undo = () => {
    setSent(false)
    requestAnimationFrame(() => {
      const field = noteRef.current
      field?.focus()
      field?.setSelectionRange(field.value.length, field.value.length)
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        {/* CardHeader is a grid that adds a second row once it holds a
            description, so the wrapper spans both or the gap doubles. */}
        <div className="row-span-2 flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage
              src="/examples/reui/photos/e93553df2422635515.jpg"
              alt={copyExample("")}
            />
            <AvatarFallback>{<ExampleText>DK</ExampleText>}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle>{<ExampleText>Kudos for Daniel Kim</ExampleText>}</CardTitle>
            <CardDescription>{<ExampleText>Staff engineer, Platform</ExampleText>}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {<ExampleText>{sent ? (
          /* The kudos renders as the feed entry it became. A plain paragraph,
             not ItemDescription, which clamps to two lines: this is where the
             sender reads back the whole note. */
          <Item variant="muted">
            <ItemMedia className="self-start">
              <Avatar>
                <AvatarImage
                  src="/examples/reui/photos/c6e9e0d487c842b94f.jpg"
                  alt={copyExample("")}
                />
                <AvatarFallback>{<ExampleText>MS</ExampleText>}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                {<ExampleText>Mira Stone </ExampleText>}<span
                  aria-hidden="true"
                  className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
                />
                <span className="text-muted-foreground font-normal">
                  {<ExampleText>Just now </ExampleText>}</span>
              </ItemTitle>
              <p className="wrap-break-word whitespace-pre-wrap">
                {<ExampleText>{note.trim()}</ExampleText>}
              </p>
            </ItemContent>
          </Item>
        ) : (
          <Textarea
            ref={noteRef}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={copyExample("Write a note for Daniel")}
            aria-label={copyExample("Kudos for Daniel Kim")}
          />
        )}</ExampleText>}
      </CardContent>
      <CardFooter>
        {<ExampleText>{sent ? (
          /* Undo sits at the start, away from where Send was, so a double
             click cannot send and take it back. No gap: the link's own
             padding spaces it, so it reads as part of the sentence. */
          <div className="flex items-center">
            {/* A focus target, not a live region: the announcement lives in
                the always-mounted status below, so it is read once. */}
            <p
              ref={confirmationRef}
              tabIndex={-1}
              className="text-muted-foreground flex items-center gap-2 outline-none"
            >
              <CircleCheckIcon aria-hidden="true" className="size-4" />
              {<ExampleText>Posted in #platform </ExampleText>}</p>
            {/* Default size like Send, so the footer keeps its height. */}
            <Button variant="link" onClick={undo}>
              {<ExampleText>Undo </ExampleText>}</Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-2">
            <p className="text-muted-foreground">{<ExampleText>Posts to #platform</ExampleText>}</p>
            <div className="flex items-center gap-2">
              {/* Emoji 14 and older, so every laptop in the company draws
                  them, minus the blocklist. Controlled to null so the
                  trigger keeps its smiley: it inserts, it holds no value. */}
              <EmojiPicker i18n={exampleLocales.emojiPicker} locale={exampleLanguage === "zh-CN" ? "zh" : "en"} dataUrl="/examples/reui/emoji/emojibase-data-17.0.0"
                value={null}
                aria-label={copyExample("Add emoji")}
                categories={CATEGORIES}
                emojiVersion={14}
                filter={workplaceSafe}
                onEmojiSelect={({ value }) => insert(value)}
              >
                {/* Icon at Send's height, so the pair shares one baseline. */}
                <EmojiPickerTrigger variant="ghost" size="icon" />
                {/* Below the card, ending at the trigger: the note, the
                    channel and Send all stay in view while picking. */}
                <EmojiPickerContent
                  side="bottom"
                  align="end"
                  returnFocus={noteRef}
                />
              </EmojiPicker>
              <Button disabled={!note.trim()} onClick={send}>
                {<ExampleText>Send kudos </ExampleText>}</Button>
            </div>
          </div>
        )}</ExampleText>}
      </CardFooter>
      {/* Mounted from the start, so a screen reader is already watching it
          when the text arrives; a region inserted with its content is read
          unreliably. */}
      <p role="status" className="sr-only">
        {<ExampleText>{sent ? "Kudos for Daniel Kim posted in #platform" : ""}</ExampleText>}
      </p>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
