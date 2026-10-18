"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState, type FormEvent } from "react"

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
import { Label } from "@exre/exui"
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
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@exre/exui"

type Option = { value: string; label: string }

const SOURCES: Option[] = [
  { value: "colleague", label: "A colleague mentioned it" },
  { value: "talk", label: "A conference talk" },
  { value: "search", label: "Search" },
  { value: "newsletter", label: "A newsletter" },
]

const REPLACING: Option[] = [
  { value: "spreadsheet", label: "A spreadsheet and a group chat" },
  { value: "legacy", label: "A tool we have outgrown" },
  { value: "nothing", label: "Nothing, this is new for us" },
]

const TIMELINES: Option[] = [
  { value: "month", label: "Inside a month" },
  { value: "quarter", label: "This quarter" },
  { value: "exploring", label: "Still exploring" },
]

// No choices listed on these entries, because choices in items exist to hand
// out the single-key shortcuts and this flow does not use them. Names and the
// required flags still have to mirror the rendered tree or the root warns.
const ITEMS = [
  { name: "source", required: true },
  { name: "replacing", required: true },
  { name: "timeline", required: true },
]

type Answers = { source: string; replacing: string; timeline: string }

// An unrecognised entry is the typed answer, so it is returned verbatim rather
// than mapped. That is the only place the free-text value can surface, because
// the input and the radios share one field name.
//
// The engine hands that name to whichever control currently holds the answer
// and detaches the other with an empty form attribute, so typing clears the
// selected radio and one question never submits two values.
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

  // The free-text row is a visible Label plus the input rather than a
  // placeholder: a placeholder is not an accessible name and vanishes on the
  // first keystroke. The id passed in wins over the generated one, which is
  // what lets htmlFor find the input at all.
  //
  // It sits inside the choices group for the per-style gap, not for the
  // wiring. Answer controls register against the item, so the input counts as
  // an answer anywhere inside the fieldset.
  const otherId = useId()
  const [answers, setAnswers] = useState<Answers | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setAnswers({
      source: answerLabel(SOURCES, formData.get("source")),
      replacing: answerLabel(REPLACING, formData.get("replacing")),
      timeline: answerLabel(TIMELINES, formData.get("timeline")),
    })
  }

  if (answers) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Thanks, that helps</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>Your answers are attached to the account, so nobody has to ask again on the onboarding call. </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3">
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Heard about us</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{answers.source}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Replacing</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{answers.replacing}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Live by</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{answers.timeline}</ExampleText>}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" onClick={() => setAnswers(null)}>
            {<ExampleText>Answer again </ExampleText>}</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    // shortcuts stays off here on purpose: single-key answer shortcuts and a
    // text field inside the same question would compete for every keystroke.
    //
    // The root ships noValidate on by default, so the browser never takes the
    // question over. What gates Next is the primitive's own rule, which counts
    // an item satisfied only once it is answered and not flagged invalid.
    <Questionnaire
      className="mx-auto w-full max-w-md"
      defaultItem="source"
      items={ITEMS}
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-source`)}
          name="source"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-source`)} render={<CardTitle />}>
              {<ExampleText>How did you first hear about us? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>Pick the closest match, or write in what actually happened. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{SOURCES.map((source) => (
                <QuestionnaireChoice key={source.value} value={source.value}>
                  {<ExampleText>{source.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
              <div className="grid gap-1.5">
                <Label htmlFor={exampleId(otherId)}>{<ExampleText>Somewhere else</ExampleText>}</Label>
                <QuestionnaireInput id={exampleId(otherId)} placeholder={copyExample("Tell us where")} />
              </div>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-replacing`)}
          name="replacing"
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id={exampleId(`${titleId}-replacing`)}
              render={<CardTitle />}
            >
              {<ExampleText>What are you replacing? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>It changes which import we offer you first. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{REPLACING.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {<ExampleText>{option.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-timeline`)}
          name="timeline"
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id={exampleId(`${titleId}-timeline`)}
              render={<CardTitle />}
            >
              {<ExampleText>When do you want to be live? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>An honest answer is more useful than an ambitious one. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{TIMELINES.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {<ExampleText>{option.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions className="w-full">
            <QuestionnairePrevious />
            <QuestionnaireNext>{<ExampleText>Next</ExampleText>}</QuestionnaireNext>
            <QuestionnaireSubmit>{<ExampleText>Send answers</ExampleText>}</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
