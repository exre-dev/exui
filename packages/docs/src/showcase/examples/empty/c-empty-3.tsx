
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleDashedIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"
import { Kbd } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>{<ExampleText>404 — Not Found</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>The page you're looking for doesn't exist. Try searching for what you need below. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="w-3/4">
            <InputGroupInput placeholder={copyExample("Try searching for pages…")} />
            <InputGroupAddon>
              <CircleDashedIcon  />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <EmptyDescription>
            {<ExampleText>Need help? </ExampleText>}<a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Contact support</ExampleText>}</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
