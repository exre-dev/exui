
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button className="group/sliding relative overflow-hidden rounded-full px-6">
      <span className="inline-flex items-center transition-transform duration-300 group-hover/sliding:-translate-x-2">
        {<ExampleText>Get Started </ExampleText>}</span>
      <ArrowRightIcon aria-hidden="true" className="absolute right-2.5 translate-x-8 opacity-0 transition-all duration-300 group-hover/sliding:translate-x-0 group-hover/sliding:opacity-100" />
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
