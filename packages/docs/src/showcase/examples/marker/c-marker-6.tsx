"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, FileTextIcon, GitMergeIcon, RotateCcwIcon } from "lucide-react"

import { useState } from "react"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@exre/exui"


// asChild merges the row onto the anchor rather than wrapping it, so the
// marker's own classes land on the anchor and the primitive's link treatment
// comes for free. A button gets no such treatment, which is why only the
// button carries a hover.
//
// The button toggles real state and the row rewrites itself, because a control
// that only looks clickable is a decorative control. That is the one reason
// this file is a client component.
//
// The icon swap is two complete elements behind a ternary instead of one
// element with a computed name, because every library prop has to stay a
// literal string for the registry installer to rewrite it.
  function OriginalPattern() {
  const [reverted, setReverted] = useState(false)

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <Marker asChild>
        <a onClick={(event) => event.preventDefault()} href="#">
          <MarkerIcon>
            <GitMergeIcon  />
          </MarkerIcon>
          <MarkerContent>{<ExampleText>Review pull request #412</ExampleText>}</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <a onClick={(event) => event.preventDefault()} href="#">
          <MarkerIcon>
            <FileTextIcon  />
          </MarkerIcon>
          <MarkerContent>{<ExampleText>Open the diff for rate-limit.ts</ExampleText>}</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <button
          type="button"
          className="hover:text-foreground transition-colors"
          onClick={() => setReverted((value) => !value)}
        >
          <MarkerIcon>
            {<ExampleText>{reverted ? (
              <CheckIcon  />
            ) : (
              <RotateCcwIcon  />
            )}</ExampleText>}
          </MarkerIcon>
          <MarkerContent>
            {<ExampleText>{reverted ? "Undo the revert" : "Revert this change"}</ExampleText>}
          </MarkerContent>
        </button>
      </Marker>
      {/* Mounted empty from the first render, not inserted on the click: a
          live region added at the same moment as its text is not reliably
          announced, and the button's own label changes silently. */}
      <span role="status" aria-live="polite" className="sr-only">
        {<ExampleText>{reverted ? "Change reverted" : ""}</ExampleText>}
      </span>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
