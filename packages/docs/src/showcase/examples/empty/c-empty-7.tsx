
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InboxIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon  />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>Inbox zero</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>You're all caught up. No new messages. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
