
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MailIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Button
      variant="outline"
      className="relative gap-2"
      aria-label={copyExample("Inbox (8 unread)")}
    >
      <MailIcon aria-hidden="true" />
      {<ExampleText>Inbox </ExampleText>}<Badge
        variant="destructive"
        size="sm"
        className="absolute -top-1.5 -right-2 rounded-full px-1"
        aria-hidden="true"
      >
        8
      </Badge>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
