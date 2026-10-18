"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CopyIcon, RefreshCwIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { useEffect, useState } from "react"

import { Bubble, BubbleContent } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@exre/exui"


/*
 * Two drafts, because Regenerate has to return a visibly different answer to
 * teach anything. One draft and a spinner reads as a button that is broken.
 */
const DRAFTS = [
  [
    "4.2 moves invoicing onto the new tax service, so EU orders now carry a VAT line on the PDF, the hosted receipt and the CSV export.",
    "Two smaller changes ride along: the billing portal keeps the filters you left it on, and a failed payment retries twice before it is marked overdue.",
  ],
  [
    "The headline in 4.2 is EU VAT. It is calculated per order rather than per account, and it shows up everywhere an amount does.",
    "We also cleared a long-standing annoyance in the billing portal: filters survive a reload, and overdue is only set after two failed retries.",
  ],
]

/*
 * A rating belongs to the answer that earned it, so regenerating clears it.
 * A thumb left lit reads as feedback on a draft nobody rated.
 */
  function OriginalPattern() {
  const { copy: copyExample, timers: exampleTimers } = useExampleRuntime()

  const [draftIndex, setDraftIndex] = useState(0)
  const [vote, setVote] = useState<"up" | "down" | null>(null)
  const [copied, setCopied] = useState(false)

  const draft = DRAFTS[draftIndex]

  /*
   * What goes to the clipboard is derived from draft during render, so this
   * timed label is the only thing the effect has to unwind.
   */
  useEffect(() => {
    if (!copied) return
    const id = exampleTimers.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(id)
  }, [copied, exampleTimers])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>Summarise what changed in 4.2 for the customer note. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          {/*
            A ghost variant anywhere in the row drops the padding the footer
            would otherwise inherit, which sits the toolbar flush with the
            prose. aria-live carries a swapped draft to a screen reader.
          */}
          <Bubble variant="ghost" aria-live="polite">
            <BubbleContent>
              <div className="space-y-3">
                {<ExampleText>{draft.map((paragraph) => (
                  <p key={paragraph}>{<ExampleText>{paragraph}</ExampleText>}</p>
                ))}</ExampleText>}
              </div>
            </BubbleContent>
          </Bubble>
          <MessageFooter className="gap-0.5">
            <span className="pe-1 tabular-nums">09:41</span>
            {/*
              Copy is a one-shot, so it carries no aria-pressed. A pressed
              rating swaps variant, because no style tunes a colour override.
            */}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={copyExample(copied ? "Reply copied" : "Copy reply")}
              title={copyExample(copied ? "Copied" : "Copy")}
              onClick={() => {
                /*
                 * Optional-chained twice: a page served over plain http has no
                 * navigator.clipboard at all. The label flips either way.
                 */
                void navigator.clipboard?.writeText?.(draft.join("\n\n"))
                setCopied(true)
              }}
            >
              {<ExampleText>{copied ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <CopyIcon aria-hidden="true" />
              )}</ExampleText>}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={copyExample("Regenerate reply")}
              title={copyExample("Regenerate")}
              onClick={() => {
                setDraftIndex((index) => (index + 1) % DRAFTS.length)
                setVote(null)
              }}
            >
              <RefreshCwIcon aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant={vote === "up" ? "secondary" : "ghost"}
              size="icon-xs"
              aria-label={copyExample("Good reply")}
              title={copyExample("Good reply")}
              aria-pressed={vote === "up"}
              onClick={() => setVote(vote === "up" ? null : "up")}
            >
              <ThumbsUpIcon aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant={vote === "down" ? "secondary" : "ghost"}
              size="icon-xs"
              aria-label={copyExample("Bad reply")}
              title={copyExample("Bad reply")}
              aria-pressed={vote === "down"}
              onClick={() => setVote(vote === "down" ? null : "down")}
            >
              <ThumbsDownIcon aria-hidden="true" />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
