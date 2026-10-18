
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SearchIcon } from "lucide-react"

import { Field, FieldLabel } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("search-input")}>{<ExampleText>Search Components</ExampleText>}</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput id={exampleId("search-input")} placeholder={copyExample("Search...")} />
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
