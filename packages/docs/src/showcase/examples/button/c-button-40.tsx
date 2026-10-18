
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SearchIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Kbd, KbdGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Button variant="outline" aria-label={copyExample("Search (Command K)")}>
      <SearchIcon aria-hidden="true" />
      <span>{<ExampleText>Search</ExampleText>}</span>
      <KbdGroup aria-hidden="true">
        <Kbd>⌘</Kbd>
        <Kbd>{<ExampleText>K</ExampleText>}</Kbd>
      </KbdGroup>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
