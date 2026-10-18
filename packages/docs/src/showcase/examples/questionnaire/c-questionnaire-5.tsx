"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type QuestionnaireItemStatus = Parameters<NonNullable<React.ComponentProps<typeof QuestionnaireItem>["onStatusChange"]>>[0]
import { useId, useState, type FormEvent } from "react"
import { Badge } from "@exre/exui"


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
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@exre/exui"

type Option = { value: string; label: string }

const CURRENT: Option[] = [
  { value: "sheets", label: "Spreadsheets on a shared drive" },
  { value: "legacy", label: "An in-house tool" },
  { value: "vendor", label: "Another vendor" },
]

const WATCH: Option[] = [
  { value: "fields", label: "Custom fields we cannot lose" },
  { value: "exports", label: "Historical exports" },
  { value: "sso", label: "Single sign-on" },
]

const WINDOWS: Option[] = [
  { value: "weekend", label: "A weekend" },
  { value: "evening", label: "A weekday evening" },
  { value: "anytime", label: "Any time, we can take downtime" },
]

// Omitting required from this one entry is the whole switch. Skip renders only
// while the active item is optional, so it appears on the middle question and
// on neither of its neighbours.
//
// Optional does not mean passable. An item counts as satisfied when it is
// answered, skipped or disabled, so the visitor still has to declare one way
// or the other before Next will move off the middle question.
const ITEMS = [
  { name: "from", required: true },
  { name: "watch" },
  { name: "window", required: true },
]

const WATCH_BADGE = {
  answered: { label: "Optional - answered", variant: "primary-light" },
  skipped: { label: "Optional - skipped", variant: "outline" },
  unanswered: { label: "Optional - not answered", variant: "secondary" },
} as const

type Summary = { from: string; watch: string; window: string }

// The optional question takes a written note as well as three choices, and
// either of them marks it answered. An entry matching no choice is that note,
// so it comes back as typed rather than mapped.
function answerLabel(options: Option[], value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return "Not answered"
  }

  return options.find((option) => option.value === value)?.label ?? value
}

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  // CardHeader sits between each fieldset and its legend, which stops the
  // legend naming the group. Pairing these ids with aria-labelledby on each
  // item puts that name back.
  const titleId = useId()

  // Skip clears whatever was ticked before it marks the item skipped, so a
  // half-answer can never ride along with a declined question. Answering
  // afterwards flips the status back, which is why the two cannot both hold.
  const [watchStatus, setWatchStatus] =
    useState<QuestionnaireItemStatus>("unanswered")
  const [summary, setSummary] = useState<Summary | null>(null)

  // Skipping is not the same as leaving a question blank, and FormData cannot
  // tell them apart: both arrive as nothing. onStatusChange is the only place
  // that distinction survives, which is what the middle row below reports.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setSummary({
      from: answerLabel(CURRENT, formData.get("from")),
      watch:
        watchStatus === "skipped"
          ? "Skipped"
          : answerLabel(WATCH, formData.get("watch")),
      window: answerLabel(WINDOWS, formData.get("window")),
    })
  }

  // The flow unmounts while the summary is on screen, so the mirrored status
  // has to be cleared alongside it. Leaving it would reopen an untouched
  // question under a badge still reporting it as skipped.
  function startOver() {
    setSummary(null)
    setWatchStatus("unanswered")
  }

  if (summary) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Migration booked</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>An engineer will confirm the window by email within one working day. </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3">
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Moving off</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.from}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Watch out for</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.watch}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Window</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.window}</ExampleText>}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" onClick={startOver}>
            {<ExampleText>Start over </ExampleText>}</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    // The header row below lives outside the card on purpose. Only the active
    // fieldset has a layout box, so anything inside the card moves with the
    // question, while the progress and the badge should stay put across all
    // three.
    <Questionnaire
      className="mx-auto w-full max-w-md"
      defaultItem="from"
      items={ITEMS}
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between gap-2">
        <QuestionnaireProgress />
        <Badge variant={WATCH_BADGE[watchStatus].variant}>
          {<ExampleText>{WATCH_BADGE[watchStatus].label}</ExampleText>}
        </Badge>
      </div>

      <Card>
        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-from`)}
          name="from"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-from`)} render={<CardTitle />}>
              {<ExampleText>What are you moving off? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>We have an importer for each of these. </ExampleText>}</QuestionnaireDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{CURRENT.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {<ExampleText>{option.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-watch`)}
          name="watch"
          onStatusChange={setWatchStatus}
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-watch`)} render={<CardTitle />}>
              {<ExampleText>Anything we should watch out for? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>Skip this if nothing comes to mind. It changes the plan, not the price. </ExampleText>}</QuestionnaireDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{WATCH.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {<ExampleText>{option.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
              <QuestionnaireInput
                aria-label={copyExample("Something else to watch out for")}
                placeholder={copyExample("Something else")}
              />
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-window`)}
          name="window"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-window`)} render={<CardTitle />}>
              {<ExampleText>When is your migration window? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>Expect roughly two hours of read-only access. </ExampleText>}</QuestionnaireDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{WINDOWS.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {<ExampleText>{option.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions
            // Nothing extra goes in this grid. Its three columns are assigned
            // to Previous, Skip and Next or Submit, so a fourth child lands in
            // column one and jumps to a second row once Previous appears.
            //
            // The buttons hide with the hidden attribute over an inline-flex
            // base class, which only wins because preflight marks [hidden] as
            // display:none with !important. Without it, all four show at once.
            className="w-full"
          >
            <QuestionnairePrevious />
            <QuestionnaireSkip>{<ExampleText>Skip for now</ExampleText>}</QuestionnaireSkip>
            <QuestionnaireNext>{<ExampleText>Next</ExampleText>}</QuestionnaireNext>
            <QuestionnaireSubmit>{<ExampleText>Book the migration</ExampleText>}</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
