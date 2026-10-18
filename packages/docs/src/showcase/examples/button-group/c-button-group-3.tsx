
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon, PencilIcon, UploadIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <Button variant="outline">
        <FileTextIcon aria-hidden="true" />
        <Badge variant="warning-light">{<ExampleText>Draft</ExampleText>}</Badge>
      </Button>

      <Button variant="outline">
        <PencilIcon aria-hidden="true" />
        <span>{<ExampleText>Edit</ExampleText>}</span>
      </Button>

      <Button aria-label={copyExample("Upload")} variant="outline" size="icon">
        <UploadIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
