
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Settings2Icon } from "lucide-react"

import { IconTile } from "@exre/exui"



  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <IconTile
        asChild
        variant="elevated"
        className="hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <a onClick={(event) => event.preventDefault()} href="#" aria-label={copyExample("Open settings")}>
          <Settings2Icon aria-hidden="true" />
        </a>
      </IconTile>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
