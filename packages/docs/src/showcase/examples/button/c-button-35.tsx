"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
      {<ExampleText>{isExpanded ? "Show less" : "Show more"}</ExampleText>}
      {<ExampleText>{isExpanded ? (
        <ChevronUpIcon aria-hidden="true" />
      ) : (
        <ChevronDownIcon aria-hidden="true" />
      )}</ExampleText>}
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
