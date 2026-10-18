
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Button
      size="icon"
      variant="outline"
      className="relative"
      aria-label={copyExample("Notifications (8)")}
    >
      <BellIcon aria-hidden="true" />
      <Badge
        variant="destructive"
        size="xs"
        className="absolute -top-1 -right-1 rounded-full px-1"
        aria-hidden="true"
      >
        8
      </Badge>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
