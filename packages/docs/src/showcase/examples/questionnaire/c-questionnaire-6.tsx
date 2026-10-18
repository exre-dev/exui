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
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
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

const REGIONS: Option[] = [
  { value: "us", label: "United States" },
  { value: "eu", label: "European Union" },
  { value: "self-managed", label: "A region you manage" },
]

const PLANS: Option[] = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "enterprise", label: "Enterprise" },
]

const SIGNERS: Option[] = [
  { value: "me", label: "I sign it myself" },
  { value: "legal", label: "Our legal team" },
  { value: "admin", label: "A named administrator" },
]

const ITEMS = [
  { name: "region", required: true },
  { name: "plan", required: true },
  { name: "signer", required: true },
]

// The one cross-question rule in this flow, written out once. No schema
// library is involved and none is missing: a single rule over two FormData
// reads costs less than a resolver, and the per-question required checks a
// schema would carry are already the primitive's job.
const PLAN_CONFLICT =
  "A region you manage is available on Enterprise. Pick another plan, or change the region."

type Summary = { region: string; plan: string; signer: string }

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

  // Controlled navigation is what makes the walk-back possible at all: item
  // and onItemChange hand the flow's position to this component, so writing to
  // it moves the visitor, and the root focuses whichever question it lands on.
  const [item, setItem] = useState("region")
  const [planError, setPlanError] = useState<string | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)

  // Each question is already gated by the built-in required check, so nothing
  // here re-implements that. This rule spans two answers and cannot be judged
  // until both exist, which is why it runs on submit and moves item by hand.
  //
  // Rejected: noValidate={false} switches on native constraint validation, but
  // the browser judges one control at a time and answers with its own bubble,
  // so it can never express a rule that reads across two questions.
  //
  // The root re-checks every enabled item before this handler is reached, so
  // all three answers are known to exist by the time it runs and the only
  // thing left to judge is the combination.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const region = formData.get("region")
    const plan = formData.get("plan")

    if (region === "self-managed" && plan === "starter") {
      setPlanError(PLAN_CONFLICT)
      setItem("plan")
      return
    }

    setSummary({
      region: labelOf(REGIONS, region),
      plan: labelOf(PLANS, plan),
      signer: labelOf(SIGNERS, formData.get("signer")),
    })
  }

  function startOver() {
    setSummary(null)
    setPlanError(null)
    setItem("region")
  }

  if (summary) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Agreement on its way</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>The data agreement has been drafted against these three answers and sent for signature. </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3">
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Data residency</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.region}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Plan</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.plan}</ExampleText>}</dd>
            </div>
            <div className="grid min-w-0 gap-0.5">
              <dt className="text-muted-foreground text-sm">{<ExampleText>Signed by</ExampleText>}</dt>
              <dd className="text-sm font-medium">{<ExampleText>{summary.signer}</ExampleText>}</dd>
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
    <Questionnaire
      className="mx-auto w-full max-w-md"
      item={item}
      items={ITEMS}
      onItemChange={setItem}
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-region`)}
          name="region"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-region`)} render={<CardTitle />}>
              {<ExampleText>Where should your data live? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>Residency is fixed once the workspace is created. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{REGIONS.map((region) => (
                <QuestionnaireChoice
                  key={region.value}
                  value={region.value}
                  // Both questions clear the message as they change, because
                  // either answer can resolve the conflict and a stale
                  // sentence under a corrected question is worse than none.
                  onChange={() => setPlanError(null)}
                >
                  {<ExampleText>{region.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-plan`)}
          name="plan"
          required
          // invalid and the error children are separate on purpose: the flag
          // drives the styling and the alert role, the children supply the
          // sentence. Null rather than an empty string leaves the primitive's
          // own required copy in place for the ordinary unanswered case.
          //
          // The flag also blocks Next while it is set, so the rule holds on the
          // way forward and not only on the way out. The visitor cannot
          // walk past the question that broke it and meet the same message
          // again at the end.
          invalid={planError !== null}
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-plan`)} render={<CardTitle />}>
              {<ExampleText>Which plan are you on? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>Not every region is offered on every plan. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{PLANS.map((plan) => (
                <QuestionnaireChoice
                  key={plan.value}
                  value={plan.value}
                  onChange={() => setPlanError(null)}
                >
                  {<ExampleText>{plan.label}</ExampleText>}
                </QuestionnaireChoice>
              ))}</ExampleText>}
            </QuestionnaireChoices>
            <QuestionnaireError>{<ExampleText>{planError}</ExampleText>}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={exampleId(`${titleId}-signer`)}
          name="signer"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={exampleId(`${titleId}-signer`)} render={<CardTitle />}>
              {<ExampleText>Who signs the data agreement? </ExampleText>}</QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              {<ExampleText>We send it for signature as soon as this flow is finished. </ExampleText>}</QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {<ExampleText>{SIGNERS.map((signer) => (
                <QuestionnaireChoice key={signer.value} value={signer.value}>
                  {<ExampleText>{signer.label}</ExampleText>}
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
            <QuestionnaireSubmit>{<ExampleText>Request the agreement</ExampleText>}</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
