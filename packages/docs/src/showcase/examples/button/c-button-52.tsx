
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CreditCardIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button
      variant="outline"
      className="group/button h-auto justify-start gap-3 px-4 py-3 text-left"
    >
      <div className="bg-muted text-accent-foreground group-hover/button:bg-background rounded-md flex size-10 items-center justify-center">
        <CreditCardIcon aria-hidden="true" className="size-5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span>{<ExampleText>Credit Card</ExampleText>}</span>
        <span className="text-muted-foreground text-xs font-normal">
          {<ExampleText>Pay securely with your Visa or Mastercard </ExampleText>}</span>
      </div>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
