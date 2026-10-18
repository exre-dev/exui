
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CodeIcon, FileTextIcon, FlaskConicalIcon, GitBranchIcon, ListChecksIcon, PencilIcon, SearchIcon, TerminalIcon } from "lucide-react"

import { Fragment, type ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@exre/exui"


type Phase = {
  name: string
  steps: { id: string; label: string; icon: ReactNode }[]
}

// A step carries a finished icon element, not an icon name: every library prop
// has to stay a literal string for the registry installer to rewrite it, so
// nothing here can be looked up from the step.
const PHASES: Phase[] = [
  // Phases nest their steps instead of every step naming its own phase. The
  // separator row is the group boundary itself, so a flat list would need a
  // lookbehind on every row to work out where one phase ends and the next
  // one starts.
  {
    name: "Plan",
    steps: [
      {
        id: "scan",
        label: "Searched 214 files for rateLimit(",
        icon: (
          <SearchIcon  />
        ),
      },
      {
        id: "read",
        label: "Read src/lib/rate-limit.ts",
        icon: (
          <FileTextIcon  />
        ),
      },
      {
        id: "outline",
        label: "Drafted a 3 step plan",
        icon: (
          <ListChecksIcon  />
        ),
      },
    ],
  },
  {
    name: "Edit",
    steps: [
      {
        id: "window",
        label: "Widened the window to 60s",
        icon: (
          <PencilIcon  />
        ),
      },
      {
        id: "route",
        label: "Wired the limiter into the send route",
        icon: (
          <CodeIcon  />
        ),
      },
      {
        id: "commit",
        label: "Committed to fix/rate-limit-window",
        icon: (
          <GitBranchIcon  />
        ),
      },
    ],
  },
  {
    name: "Verify",
    // Verify is two steps where the others are three. A run log is whatever
    // the run actually did, and padding every phase to the same length turns
    // the example into a template no real run would produce.
    steps: [
      {
        id: "tests",
        label: "Ran pnpm test rate-limit",
        icon: (
          <TerminalIcon  />
        ),
      },
      {
        id: "probe",
        label: "Confirmed the 429 no longer fires",
        icon: (
          <FlaskConicalIcon  />
        ),
      },
    ],
  },
]

// Phases are flat siblings in one column rather than a container each, so the
// separator keeps the same rhythm as the steps and a phase cannot end up with
// its own inherited spacing.
//
// A labeled divider takes no role of its own. A separator role draws its name
// from aria-label and treats its contents as presentational, so the phase name
// you can see would be the one thing never announced. Left as plain content it
// reads in document order, right before the steps it introduces.
//
// The rules either side are pseudo elements on the row itself and the label is
// an ordinary flex child between them, so it needs no background plate and
// nothing should be layered over it.
  function OriginalPattern() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{<ExampleText>Agent run</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>auth-rate-limit, 1m 48s</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {<ExampleText>{PHASES.map((phase) => (
            <Fragment key={phase.name}>
              <Marker variant="separator">
                <MarkerContent>{<ExampleText>{phase.name}</ExampleText>}</MarkerContent>
              </Marker>
              {<ExampleText>{phase.steps.map((step) => (
                <Marker key={step.id}>
                  <MarkerIcon>{<ExampleText>{step.icon}</ExampleText>}</MarkerIcon>
                  <MarkerContent>{<ExampleText>{step.label}</ExampleText>}</MarkerContent>
                </Marker>
              ))}</ExampleText>}
            </Fragment>
          ))}</ExampleText>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
