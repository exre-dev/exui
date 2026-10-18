
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BarChart3Icon } from "lucide-react"

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
    <div className="flex items-center justify-center p-4">
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BarChart3Icon  />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>No data yet</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>Once your project starts receiving traffic, analytics will appear here. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="sm">{<ExampleText>Connect Data Source</ExampleText>}</Button>
            <Button variant="outline" size="sm">
              {<ExampleText>View Docs </ExampleText>}</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
