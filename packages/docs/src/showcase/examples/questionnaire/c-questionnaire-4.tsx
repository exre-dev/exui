"use client"


import { useExampleRuntime, ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon } from "lucide-react"

import { useState, type FormEvent } from "react"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exre/exui"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@exre/exui"


type Question = {
  name: string
  step: string
  title: string
  choices: { value: string; label: string }[]
}

// Four questions of three choices each, none of them carrying a description,
// so every step is the same height. Inactive fieldsets are hidden and have no
// box at all, so uneven steps would make the card jump on each Next.
const QUESTIONS: Question[] = [
  {
    name: "source",
    step: "Source",
    title: "Where does the data come from?",
    choices: [
      { value: "warehouse", label: "A warehouse table" },
      { value: "stream", label: "An event stream" },
      { value: "uploads", label: "Files uploaded by hand" },
    ],
  },
  {
    name: "volume",
    step: "Volume",
    title: "How much arrives in a day?",
    choices: [
      { value: "small", label: "Under 1M rows" },
      { value: "medium", label: "1M to 50M rows" },
      { value: "large", label: "More than 50M rows" },
    ],
  },
  {
    name: "alerting",
    step: "Alerting",
    title: "Who should be alerted when it stalls?",
    choices: [
      { value: "oncall", label: "The on-call rota" },
      { value: "data", label: "The data team channel" },
      { value: "none", label: "Nobody yet" },
    ],
  },
  {
    name: "owner",
    step: "Owner",
    title: "Who owns the pipeline?",
    choices: [
      { value: "me", label: "Me" },
      { value: "teammate", label: "A teammate" },
      { value: "undecided", label: "Still deciding" },
    ],
  },
]

const ITEMS = QUESTIONS.map((question) => ({
  name: question.name,
  required: true,
}))

  function OriginalPattern() {
  const { format: formatExample, copy: copyExample } = useExampleRuntime()

  const [created, setCreated] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const source = QUESTIONS[0].choices.find(
      (choice) => choice.value === formData.get("source")
    )

    setCreated(source?.value ?? "unknown")
  }

  if (created) {
    return (
      // Empty, not a Card, for the ending. The flow itself runs bare, so a
      // panel appearing only at the finish would introduce a frame the visitor
      // had not been looking at for the previous four steps.
      <Empty className="mx-auto w-full max-w-md">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleCheckIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>Pipeline queued</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText><>{formatExample("We are provisioning a pipeline from {source}. The first run starts as soon as the connection is verified.", { source: copyExample(QUESTIONS[0].choices.find((choice) => choice.value === created)?.label ?? "the chosen source") })}</></ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" variant="outline" onClick={() => setCreated(null)}>
            {<ExampleText>Set up another </ExampleText>}</Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Questionnaire
      className="mx-auto w-full max-w-md"
      defaultItem="source"
      items={ITEMS}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress
        className="w-full"
        render={(props, state) => {
          // w-full above is not optional: the primitive ships w-fit with a
          // min-width sized for the default "Question N of M" string, and a
          // custom bar left inside that box stops well short of the questions.
          //
          // One string for both readings. aria-valuetext goes on after the
          // spread because the props carry the primitive's own "Question N of
          // M", and for a progressbar that value text is what gets announced.
          const step = QUESTIONS[state.current - 1]?.step
          const label = formatExample("Step {current} of {total} - {step}", { current: state.current, total: state.total, step: copyExample(step ?? "") })

          return (
            <div {...props} aria-valuetext={label}>
              <div aria-hidden="true" className="mb-2 flex gap-1.5">
                {<ExampleText>{Array.from({ length: state.total }, (_, index) => (
                  // Hidden from assistive tech because the wrapper already
                  // carries role="progressbar" with aria-valuenow, so exposing
                  // the segments would announce the position a second time.
                  //
                  // state.current is 1-based, hence the strict less-than, and
                  // state.total counts the enabled items rather than the
                  // rendered ones, so disabling a question drops a segment.
                  <span
                    key={index}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      index < state.current ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}</ExampleText>}
              </div>
              <span>{<ExampleText><>{label}</></ExampleText>}</span>
            </div>
          )
        }}
      />

      {<ExampleText>{QUESTIONS.map((question) => (
        // The title renders as the fieldset's own legend with nothing between
        // the two, so the group is named without any aria-labelledby pairing.
        // A card header in between would break that and need one.
        <QuestionnaireItem key={question.name} name={question.name} required>
          <QuestionnaireTitle>{<ExampleText>{question.title}</ExampleText>}</QuestionnaireTitle>
          <QuestionnaireChoices>
            {<ExampleText>{question.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                {<ExampleText>{choice.label}</ExampleText>}
              </QuestionnaireChoice>
            ))}</ExampleText>}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}</ExampleText>}

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>{<ExampleText>Next</ExampleText>}</QuestionnaireNext>
        <QuestionnaireSubmit>{<ExampleText>Create the pipeline</ExampleText>}</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
