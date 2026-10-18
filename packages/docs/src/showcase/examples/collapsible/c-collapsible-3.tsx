
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"
import { Card, CardContent } from "@exre/exui"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="h-40 w-full max-w-xs">
      <Card className="py-3">
        <CardContent className="px-3">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between text-sm">
              <span>{<ExampleText>How do I reset my password?</ExampleText>}</span>
              <ChevronDownIcon aria-hidden="true" className="text-muted-foreground size-4 shrink-0 transition-transform in-aria-expanded:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden motion-reduce:animate-none">
              <div className="text-muted-foreground pt-3 text-sm">
                {<ExampleText>You can reset your password by clicking the "Forgot Password" link on the login page. We'll send you an email with instructions to create a new password. </ExampleText>}</div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
