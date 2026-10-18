
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="min-h-[300px] w-full max-w-md">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner className="size-4" />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>Loading projects</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>Please wait while we fetch your project data. This should only take a moment. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" disabled>
            {<ExampleText>Cancel </ExampleText>}</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
