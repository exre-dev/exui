"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SmilePlusIcon } from "lucide-react"

import { useId, useRef, useState } from "react"
import {
  DEFAULT_EMOJI_PICKER_I18N,
  EmojiPicker,
  EmojiPickerCategories,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerHeader,
  EmojiPickerList,
  EmojiPickerPreview,
  EmojiPickerSearch,
  EmojiPickerSkinTone,
  EmojiPickerTrigger,
  EmojiPickerValue,
  findEmoji,
  getEmojiValue,
  useEmojiPicker,
  useEmojiPickerData,
  type EmojiPickerSkinTone as SkinTone,
} from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


type Reaction = {
  /** The toned value, so each skin tone gets a pill of its own. */
  emoji: string
  label: string
  baseLabel?: string
  tone?: SkinTone
  /** Everyone else who reacted, in the order they did. */
  people: string[]
  mine: boolean
}

const INITIAL_REACTIONS: Reaction[] = [
  {
    emoji: "🎉",
    label: "party popper",
    people: ["Amara Okafor", "Priya Shah"],
    mine: true,
  },
  {
    emoji: "🚀",
    label: "rocket",
    people: ["Daniel Kim", "Michael Rodriguez", "Priya Shah"],
    mine: false,
  },
  {
    emoji: "👍🏽",
    label: "thumbs up, medium skin tone",
    baseLabel: "thumbs up",
    tone: 3,
    people: ["Michael Rodriguez", "Amara Okafor"],
    mine: false,
  },
  { emoji: "👀", label: "eyes", people: ["Daniel Kim"], mine: false },
]

/* Untoned on purpose: the row draws them in the tone picked in the footer,
   so a toned 👍 joins the matching pill instead of starting a new one. */
const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "🙏", "👀"]

const TONES = DEFAULT_EMOJI_PICKER_I18N.labels.skinTones

const countOf = (reaction: Reaction) =>
  reaction.people.length + (reaction.mine ? 1 : 0)

/* "Amara Okafor, Priya Shah and you": you always come last. */
function namesOf(reaction: Reaction, copyExample: ReturnType<typeof useExampleRuntime>["copy"], formatExample: ReturnType<typeof useExampleRuntime>["format"]) {
  const names = reaction.mine ? [...reaction.people, copyExample("you")] : reaction.people
  if (names.length === 1) return reaction.mine ? copyExample("You") : names[0]
  return formatExample("{names} and {last}", { names: names.slice(0, -1).join(", "), last: names[names.length - 1] })
}

/* A composed first row in the popover, so the common reactions take one
   click. It goes through the picker's own `select`, so the skin tone, the
   recent list and closing on pick behave exactly like a grid pick. Columns
   one cell wide from the grid's gutter put each glyph over a grid column. */
function QuickReactions({ reactions }: { reactions: Reaction[] }) {
  const { copy: copyExample } = useExampleRuntime()

  const { emojis, skinTone, select } = useEmojiPicker()
  return (
    <div
      role="group"
      aria-label={copyExample("Quick reactions")}
      className="grid auto-cols-(--emoji-picker-cell) grid-flow-col justify-start justify-items-center px-(--emoji-picker-gutter) pt-(--emoji-picker-padding)"
    >
      {<ExampleText>{QUICK_REACTIONS.map((glyph) => {
        /* Undefined until the data arrives, which the trigger starts
           fetching on hover, so the row is rarely disabled for long. */
        const emoji = findEmoji(emojis, glyph)
        const value = emoji ? getEmojiValue(emoji, skinTone) : glyph
        const mine = reactions.some(
          (reaction) => reaction.mine && reaction.emoji === value
        )
        return (
          /* Pressed reads as a quiet fill, not a solid primary tile. */
          <ExampleRuntimeConsumer key={glyph} render={({copy: copyExample, format: formatExample}) => (<Button
            key={glyph}
            variant={mine ? "secondary" : "ghost"}
            size="icon-sm"
            aria-pressed={mine}
            aria-label={emoji ? (skinTone > 0 && emoji.skins
              ? formatExample("{emoji}, {tone} skin tone", { emoji: copyExample(emoji.label), tone: copyExample(TONES[skinTone]) })
              : copyExample(emoji.label)) : glyph}
            disabled={!emoji}
            onClick={() => emoji && select(emoji)}
          >
            <span
              aria-hidden="true"
              className="text-(length:--emoji-picker-emoji) leading-none"
            >
              <EmojiPickerValue value={value} />
            </span>
          </Button>)} />
        )
      })}</ExampleText>}
    </div>
  )
}

  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample, language: exampleLanguage, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [reactions, setReactions] = useState(INITIAL_REACTIONS)
  const [announcement, setAnnouncement] = useState<{ emoji: string; label: string; baseLabel?: string; tone?: SkinTone; mine: boolean } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { data: reactionData } = useEmojiPickerData({
    locale: exampleLanguage === "zh-CN" ? "zh" : "en",
    url: "/examples/reui/emoji/emojibase-data-17.0.0",
  })

  /* One path for a pill, a quick reaction and a grid pick: reacting with
     an emoji you already used takes yours back, and a pill nobody is left
     on goes away. */
  const displayLabel = (reaction: Pick<Reaction, "emoji" | "label" | "baseLabel" | "tone">) => {
    const localized = findEmoji(reactionData?.emojis ?? [], reaction.emoji)
    const label = localized?.label ?? copyExample(reaction.label)
    return reaction.tone
      ? formatExample("{emoji}, {tone} skin tone", { emoji: localized?.label ?? copyExample(reaction.baseLabel ?? reaction.emoji), tone: copyExample(TONES[reaction.tone]) })
      : label
  }

  const toggle = (emoji: string, tone: SkinTone = 0) => {
    const existing = reactions.find((reaction) => reaction.emoji === emoji)
    const mine = !existing?.mine
    const next = existing
      ? reactions.map((reaction) =>
          reaction.emoji === emoji ? { ...reaction, mine } : reaction
        )
      : [...reactions, { emoji, label: emoji, people: [], mine, tone }]
    const kept = next.filter((reaction) => countOf(reaction) > 0)
    setReactions(kept)
    setAnnouncement({ emoji, label: existing?.label ?? emoji, baseLabel: existing?.baseLabel, tone: existing?.tone ?? tone, mine })
    /* The pressed pill unmounts with its last reaction, and focus would
       fall to the page; the add button sits beside the row. */
    if (kept.length < next.length) triggerRef.current?.focus()
  }

  return (
    <Item variant="outline" className="max-w-md">
      {/* Top-aligned to the author line; an Item centres its media unless
          the row has an ItemDescription. */}
      <ItemMedia className="self-start">
        <Avatar>
          <AvatarImage
            src="/examples/reui/photos/df73db9a2c25069a42.jpg"
            alt={copyExample("")}
          />
          <AvatarFallback>{<ExampleText>LM</ExampleText>}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {<ExampleText>Lucas Martin </ExampleText>}<span
            aria-hidden="true"
            className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
          />
          <span className="text-muted-foreground font-normal">{<ExampleText>10:42 AM</ExampleText>}</span>
        </ItemTitle>
        <p className="text-pretty">
          {<ExampleText>Dark mode is live for 10% of workspaces. If error rates hold, everyone gets it on Thursday. </ExampleText>}</p>
        <>
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {<ExampleText>{reactions.map((reaction) => {
              const count = countOf(reaction)
              /* Keyed by the emoji, not the index, so a description never
               moves to a neighbour when a pill above it goes away. */
              const descriptionId = `${id}-${reaction.emoji}`
              return (
                <ExampleRuntimeConsumer key={reaction.emoji} render={({id: exampleId, format: formatExample}) => (<Tooltip key={reaction.emoji}>
                  {/* Yours are solid, everyone else's muted. */}
                  <TooltipTrigger asChild>
                    <Button
                      variant={reaction.mine ? "default" : "secondary"}
                      size="sm"
                      aria-pressed={reaction.mine}
                      aria-label={formatExample(count === 1 ? "{emoji}, {count} reaction" : "{emoji}, {count} reactions", { emoji: displayLabel(reaction), count })}
                      aria-describedby={exampleId(descriptionId)}
                      onClick={() => toggle(reaction.emoji, reaction.tone)}
                    >
                      <span aria-hidden="true" className="text-sm leading-none">
                        {<ExampleText>{reaction.emoji}</ExampleText>}
                      </span>
                      <span aria-hidden="true" className="tabular-nums">
                        {<ExampleText>{count}</ExampleText>}
                      </span>
                      {/* Base UI keeps tooltip text from screen readers, so
                      the names reach them through this instead. */}
                      <span id={exampleId(descriptionId)} hidden>
                        {<ExampleText><>{formatExample("{names} reacted with {emoji}", { names: namesOf(reaction, copyExample, formatExample), emoji: displayLabel(reaction) })}</></ExampleText>}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{<ExampleText><>{namesOf(reaction, copyExample, formatExample)}</></ExampleText>}</TooltipContent>
                </Tooltip>)} />
              )
            })}</ExampleText>}
            {/* Controlled to null so the trigger keeps its icon instead of
              showing the last pick as a value. */}
            <EmojiPicker i18n={exampleLocales.emojiPicker} locale={exampleLanguage === "zh-CN" ? "zh" : "en"} dataUrl="/examples/reui/emoji/emojibase-data-17.0.0"
              value={null}
              aria-label={copyExample("Add reaction")}
              onEmojiSelect={({ value, emoji, skinTone }) =>
                toggle(value, emoji.skins ? skinTone : 0)
              }
            >
              <EmojiPickerTrigger
                ref={triggerRef}
                variant="secondary"
                size="icon-sm"
                title={copyExample("Add reaction")}
              >
                <SmilePlusIcon aria-hidden="true" />
              </EmojiPickerTrigger>
              {/* Offset past the card's bottom edge, so the panel reads as
                its own surface instead of clipping the corner. */}
              <EmojiPickerContent side="bottom" align="end" sideOffset={20}>
                <QuickReactions reactions={reactions} />
                <EmojiPickerHeader>
                  <EmojiPickerSearch />
                </EmojiPickerHeader>
                <EmojiPickerCategories />
                <EmojiPickerList />
                <EmojiPickerFooter>
                  <EmojiPickerPreview />
                  <EmojiPickerSkinTone />
                </EmojiPickerFooter>
              </EmojiPickerContent>
            </EmojiPicker>
          </div>
        </>
        <p role="status" className="sr-only">
          {<ExampleText><>{announcement ? formatExample(announcement.mine ? "You reacted with {emoji}" : "Removed your {emoji} reaction", { emoji: displayLabel(announcement) }) : ""}</></ExampleText>}
        </p>
      </ItemContent>
    </Item>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
