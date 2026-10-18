
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"

  function OriginalPattern() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline" className={cn("bg-muted justify-start")}>
        {<ExampleText>Dashboard </ExampleText>}</Button>
      <Button variant="outline" className="justify-start">
        {<ExampleText>Analytics </ExampleText>}</Button>
      <Button variant="outline" className="justify-start">
        {<ExampleText>Settings </ExampleText>}</Button>
      <Button variant="outline" className="justify-start">
        {<ExampleText>Help </ExampleText>}</Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
