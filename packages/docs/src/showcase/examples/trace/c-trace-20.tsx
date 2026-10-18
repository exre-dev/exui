"use client"

import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BadgeCheckIcon, MapPinIcon, ShieldCheckIcon, UserCheckIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@exre/exui"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@exre/exui"

// Asking for a new document turns the failure into a pending step, since the
// case stays open until the applicant replies.
function OriginalPattern() {
  const [screened, setScreened] = React.useState(false)
  const [requested, setRequested] = React.useState(false)
  const addressTrigger = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setScreened(true), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  function requestDocument() {
    setRequested(true)
    // The button sits in the panel it replaces, so focus goes back to the row.
    addressTrigger.current?.focus()
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <BadgeCheckIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Verified the passport</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>chip and MRZ match</ExampleText></TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <UserCheckIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Matched the selfie to the photo</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>97% similar</ExampleText></TraceDescription>
        </TraceLine>
        <TraceLine status={screened ? undefined : "running"}>
          <TraceIcon>
            <ShieldCheckIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>
            {screened
              ? "Screened sanctions and PEP lists"
              : "Screening sanctions and PEP lists"}
          </ExampleText></TraceTitle>
          {screened ? <TraceDescription><ExampleText>no matches</ExampleText></TraceDescription> : null}
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger ref={addressTrigger}>
            <TraceLine status={requested ? "pending" : "error"}>
              <TraceIcon>
                <MapPinIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>
                {requested
                  ? "Waiting for a new proof of address"
                  : "Rejected the proof of address"}
              </ExampleText></TraceTitle>
              <TraceDescription><ExampleText>
                {requested ? "requested just now" : "too old"}
              </ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <div className="flex flex-col items-start gap-3">
              {requested ? (
                <p className="text-pretty"><ExampleText>
                  Jordan was emailed a link to upload a recent one.
                </ExampleText></p>
              ) : (
                <>
                  <p className="text-pretty"><ExampleText>
                    The utility bill is from June 2, and policy needs one from
                    the last 90 days.
                  </ExampleText></p>
                  <Button size="xs" variant="outline" onClick={requestDocument}><ExampleText>
                    Request a new document
                  </ExampleText></Button>
                </>
              )}
            </div>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      {/* Rows change in place, so the two changes a reviewer waits for are
            also announced. */}
      <p role="status" className="sr-only"><ExampleText>
        {requested
          ? "New proof of address requested"
          : screened
            ? "Screening finished, no matches"
            : ""}
      </ExampleText></p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
