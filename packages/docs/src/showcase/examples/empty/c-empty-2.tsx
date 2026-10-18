
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyTitle>{<ExampleText>No results found</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>No results found for your search. Try adjusting your search terms. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>{<ExampleText>Try again</ExampleText>}</Button>
          <Button variant="link" asChild className="text-muted-foreground">
            <a onClick={(event) => event.preventDefault()} href="#">
              {<ExampleText>Learn more</ExampleText>}{<ExampleText>{" "}</ExampleText>}
              <ArrowUpRightIcon  />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
