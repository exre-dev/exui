
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, MenuIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" size="icon-sm" aria-label={copyExample("Align left")}>
        <AlignLeftIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label={copyExample("Align center")}>
        <AlignCenterIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label={copyExample("Align right")}>
        <AlignRightIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label={copyExample("Align justify")}>
        <MenuIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
