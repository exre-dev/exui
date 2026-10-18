"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@exre/exui"
import { CascaderItems } from "@exre/exui"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@exre/exui"
import type { CascaderNode } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

const topics: CascaderNode[] = [
  {
    value: "billing",
    label: "Billing",
    children: [
      { value: "billing.invoice", label: "Invoice question" },
      { value: "billing.refund", label: "Refund request" },
      { value: "billing.plan", label: "Change plan" },
      { value: "billing.tax", label: "Tax details" },
    ],
  },
  {
    value: "technical",
    label: "Technical",
    children: [
      {
        value: "technical.api",
        label: "API",
        children: [
          { value: "technical.api.auth", label: "Authentication" },
          { value: "technical.api.limits", label: "Rate limits" },
          { value: "technical.api.webhooks", label: "Webhooks" },
        ],
      },
      { value: "technical.bug", label: "Bug report" },
      { value: "technical.performance", label: "Performance" },
    ],
  },
  {
    value: "account",
    label: "Account",
    children: [
      { value: "account.login", label: "Cannot sign in" },
      { value: "account.email", label: "Change email" },
      { value: "account.delete", label: "Delete account" },
    ],
  },
  {
    value: "team",
    label: "Team",
    children: [
      { value: "team.invite", label: "Invites" },
      { value: "team.seats", label: "Seats" },
      { value: "team.roles", label: "Roles" },
    ],
  },
  {
    value: "licensing",
    label: "Licensing",
    children: [
      { value: "licensing.key", label: "License key" },
      { value: "licensing.transfer", label: "Transfer a license" },
    ],
  },
  {
    value: "security",
    label: "Security",
    children: [
      { value: "security.report", label: "Report a vulnerability" },
      { value: "security.sso", label: "SSO setup" },
    ],
  },
  { value: "feedback", label: "Product feedback" },
  { value: "other", label: "Something else" },
]

/**
 * Form integration. `name` makes the cascader submit like any native field, so
 * it works with a plain form action or any form library without a controller
 * wrapper. The submitted value is the selected node's `value`.
 */
  function OriginalPattern() {
  const { id: exampleId, copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="flex w-full justify-center p-4">
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setSubmitted(String(data.get("topic") ?? ""))
        }}
      >
        <Field>
          <FieldLabel htmlFor={exampleId("topic-trigger")}>
            {<ExampleText>What do you need help with? </ExampleText>}</FieldLabel>
          <Cascader labels={exampleLocales.cascader} items={topics} name="topic">
            <CascaderTrigger
              id={exampleId("topic-trigger")}
              render={
                <Button
                  variant="outline"
                  className="w-full justify-between gap-2 font-normal"
                />
              }
            >
              <CascaderValue placeholder={copyExample("Select a topic")} />
            </CascaderTrigger>

            <CascaderContent className="w-(--anchor-width)">
              <CascaderPanel>
                <CascaderNav>
                  <CascaderInput />
                </CascaderNav>
                <CascaderBreadcrumb />
                <CascaderEmpty />
                <CascaderList>
                  <CascaderItems />
                </CascaderList>
                <CascaderStatus />
              </CascaderPanel>
            </CascaderContent>
          </Cascader>
          <FieldDescription>
            {<ExampleText>Pick the most specific topic you can. </ExampleText>}</FieldDescription>
        </Field>

        <Button type="submit" className="w-full">
          {<ExampleText>Submit request </ExampleText>}</Button>

        {<ExampleText>{submitted ? (
          <p className="text-muted-foreground text-xs">
            {<ExampleText>Submitted </ExampleText>}<code className="text-foreground">{<ExampleText>topic=</ExampleText>}{submitted}</code>
          </p>
        ) : null}</ExampleText>}
      </form>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
