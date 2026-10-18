
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
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{<ExampleText>No projects yet</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>You haven't created any projects yet. Get started by creating your first project. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Create project</ExampleText>}</a>
            </Button>
            <Button variant="outline">{<ExampleText>Import project</ExampleText>}</Button>
          </div>
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
