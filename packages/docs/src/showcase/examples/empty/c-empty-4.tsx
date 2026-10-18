
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FolderIcon, PlusIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon  />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>Nothing to see here</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>No posts have been created yet. Get started by</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>creating your first post</ExampleText>}</a>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">
            <PlusIcon data-icon="inline-start" />
            {<ExampleText>New Post </ExampleText>}</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
