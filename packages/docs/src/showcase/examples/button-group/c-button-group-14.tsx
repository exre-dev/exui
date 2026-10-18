
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CopyIcon, SearchIcon, Trash2Icon, UploadIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup orientation="vertical">
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon" aria-label={copyExample("Search")}>
          <SearchIcon aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label={copyExample("Copy")}>
          <CopyIcon aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label={copyExample("Share")}>
          <UploadIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label={copyExample("Trash")}>
          <Trash2Icon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
