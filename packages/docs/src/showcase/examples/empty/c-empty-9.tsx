
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellOffIcon } from "lucide-react"

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
      <Empty className="bg-muted py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BellOffIcon  />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>No notifications</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>When you get notifications, they'll show up here. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
