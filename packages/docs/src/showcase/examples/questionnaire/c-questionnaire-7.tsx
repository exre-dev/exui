"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { RotateCcwIcon } from "lucide-react"

import { useId, useMemo, useState, type FormEvent } from "react"
import { cn } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
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
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@exre/exui"


type Option = { value: string; label: string }

type Question = {
  name: string
  title: string
  description: string
  choices: Option[]
}

type Person = {
  value: string
  name: string
  role: string
  initials: string
  photo: string
}

const USAGE: Option[] = [
  { value: "solo", label: "Just me" },
  { value: "team", label: "A team inside one company" },
  { value: "agency", label: "Client work across several companies" },
]

// A fixed 96px square at dpr 2 is the crop every avatar in this registry asks
// for, so these four reuse a size the CDN has already cut rather than adding a
// per-example variant of the same four photos.
const OWNERS: Person[] = [
  {
    value: "amara",
    name: "Amara Boateng",
    role: "Operations lead",
    initials: "AB",
    photo:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
  },
  {
    value: "ines",
    name: "Ines Roca",
    role: "Delivery manager",
    initials: "IR",
    photo:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
  },
  {
    value: "theo",
    name: "Theo Lindqvist",
    role: "Engineering manager",
    initials: "TL",
    photo:
      "/examples/reui/photos/e93553df2422635515.jpg",
  },
  {
    value: "daniel",
    name: "Daniel Okafor",
    role: "Finance partner",
    initials: "DO",
    photo:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  },
]

// Both tail questions share one shape, so they come from an array instead of
// being written out twice. The controlled question and the branch stay
// explicit below, because each needs props the other two do not.
const TAIL: Question[] = [
  {
    name: "import",
    title: "What should we import first?",
    description: "The rest follows once the first import has been checked.",
    choices: [
      { value: "projects", label: "Projects and their tasks" },
      { value: "people", label: "People and their roles" },
      { value: "files", label: "Files and attachments" },
    ],
  },
  {
    name: "start",
    title: "When do you want to start?",
    description: "Nothing reaches your team until you say so.",
    choices: [
      { value: "now", label: "Right away" },
      { value: "week", label: "Later this week" },
      { value: "later", label: "After the team is briefed" },
    ],
  },
]

type Summary = {
  usage: string
  owner: string | null
  first: string
  start: string
}

function labelOf(options: Option[], value: FormDataEntryValue | null) {
  return (
    options.find((option) => option.value === value)?.label ?? "Not answered"
  )
}

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  // CardHeader sits between each fieldset and its legend, which stops the
  // legend naming the group. Pairing these ids with aria-labelledby on each
  // item puts that name back.
  const titleId = useId()
  const [usage, setUsage] = useState("")
  const [summary, setSummary] = useState<Summary | null>(null)

  // The root warns in development when items and the rendered tree disagree on
  // a name, a required flag or a disabled flag, so both sides of the branch
  // read from this one derived value and the tail reads from one array.
  //
  // Nothing is preselected, which is also what keeps the branch shut on the
  // first paint: usage is empty until an answer arrives, so needsOwner starts
  // false and the counter starts at three.
  //
  // The counter then reads "Question 1 of 4", because it is computed from the
  // enabled items. That number is the visible proof the branch is in the flow.
  const needsOwner = usage === "team" || usage === "agency"
  const items = useMemo(
    () => [
      { name: "usage", required: true },
      { disabled: !needsOwner, name: "owner", required: true },
      ...TAIL.map((question) => ({ name: question.name, required: true })),
    ],
    [needsOwner]
  )

  // A disabled fieldset drops its controls from the submission, so owner comes
  // back as null rather than an empty string. Keeping that null is what lets
  // the summary print "Not applicable" where a name would otherwise sit.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const owner = OWNERS.find(
      (person) => person.value === formData.get("owner")
    )

    setSummary({
      usage: labelOf(USAGE, formData.get("usage")),
      owner: owner?.name ?? null,
      first: labelOf(TAIL[0].choices, formData.get("import")),
      start: labelOf(TAIL[1].choices, formData.get("start")),
    })
  }

  if (summary) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Workspace created</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>The import runs in the background. You can start using the workspace before it finishes. </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3">
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Used for</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.usage}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Owner</ExampleText>}</dt>
              <dd
                className={cn(
                  "text-sm font-medium",
                  summary.owner === null && "text-muted-foreground"
                )}
              >
                {<ExampleText>{summary.owner ?? "Not applicable"}</ExampleText>}
              </dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Importing</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.first}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Starting</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.start}</ExampleText>}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" onClick={() => setSummary(null)}>
            {<ExampleText>Create another </ExampleText>}</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    // Progress is repeated in every card header rather than written once above
    // the card. Only the active fieldset has a layout box, so a counter placed
    // inside one question would disappear along with it on the next step.
    <Questionnaire
      className="mx-auto w-full max-w-md"
      items={items}
      // A form reset restores the answers but knows nothing about host state,
      // so usage is cleared here too. Without that the branch would stay open
      // over a question whose controlling answer had just been wiped.
      onReset={() => setUsage("")}
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-usage`)}
          name="usage"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-usage`)} render={<CardTitle />}>
              {<ExampleText>How will your team use this? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>Shared workspaces add a question about who owns them. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{USAGE.map((option) => (
                <QuestionnaireChoice
                  key={option.value}
                  // Controlling one question means controlling all of its
                  // choices: each takes checked, not just the selected one. A
                  // mix in one group leaves the engine with two sources of
                  // truth.
                  checked={usage === option.value}
                  value={option.value}
                  onChange={() => setUsage(option.value)}
                >
                  {<ExampleText>{option.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-owner`)}
          // Only an item AFTER the controlling question may be toggled.
          // Disabling the item on screen makes the root fall back to the
          // first enabled one and throws the visitor back to question one.
          disabled={!needsOwner}
          name="owner"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-owner`)} render={<CardTitle />}>
              {<ExampleText>Who should own the workspace? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>The owner manages billing and can invite everyone else. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{OWNERS.map((person) => (
                <ExampleRuntimeConsumer key={person.value} render={({copy: copyExample}) => (<QuestionnaireChoice key={person.value} value={person.value}>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Avatar size="sm">
                      <AvatarImage
                        src={person.photo}
                        // Empty because the owner's name is read out right
                        // beside it. An alt repeating that name would have a
                        // screen reader announce each person twice over.
                        alt={copyExample("")}
                      />
                      <AvatarFallback>{<ExampleText>{person.initials}</ExampleText>}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{<ExampleText>{person.name}</ExampleText>}</span>
                  </span>
                  <QuestionnaireChoiceDescription>
                    {<ExampleText>{person.role}</ExampleText>}
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>)} />
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        {<ExampleText>{TAIL.map((question) => (
          <ExampleRuntimeConsumer key={question.name} render={({id: exampleId}) => (<QuestionnaireItem
            key={question.name}
            aria-labelledby={exampleId(`${titleId}-${question.name}`)}
            name={question.name}
            required
          >
            <CardHeader>
              <QuestionnaireTitle
                id={exampleId(`${titleId}-${question.name}`)}
                render={<CardTitle />}
              >
                {<ExampleText>{question.title}</ExampleText>}
              </QuestionnaireTitle>
              <QuestionnaireDescription render={<CardDescription />}>
                {<ExampleText>{question.description}</ExampleText>}
              </QuestionnaireDescription>
              <CardAction>
                <QuestionnaireProgress />
              </CardAction>
            </CardHeader>
            <CardContent>
              <QuestionnaireChoices>
                {<ExampleText>{question.choices.map((choice) => (
                  <QuestionnaireChoice key={choice.value} value={choice.value}>
                    {<ExampleText>{choice.label}</ExampleText>}
                  </QuestionnaireChoice>
                ))}</ExampleText>}
              </QuestionnaireChoices>
              <QuestionnaireError />
            </CardContent>
          </QuestionnaireItem>)} />
        ))}</ExampleText>}

        <CardFooter>
          <QuestionnaireActions className="w-full">
            <QuestionnairePrevious />
            <QuestionnaireNext>{<ExampleText>Next</ExampleText>}</QuestionnaireNext>
            <QuestionnaireSubmit>{<ExampleText>Create the workspace</ExampleText>}</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>

      <div
        // The reset button sits outside the Actions grid. That grid assigns
        // its three columns to Previous, Skip and Next or Submit, so an extra
        // child lands in column one and jumps to a second row once Previous
        // shows.
        className="flex justify-end"
      >
        <Button type="reset" size="sm" variant="outline">
          <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
          {<ExampleText>Start over </ExampleText>}</Button>
      </div>
    </Questionnaire>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
