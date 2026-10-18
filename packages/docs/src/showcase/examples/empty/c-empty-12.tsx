
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, PlusIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Tasks</ExampleText>}</CardTitle>
          <CardDescription>{<ExampleText>Track and manage your to-dos.</ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleCheckIcon  />
              </EmptyMedia>
              <EmptyTitle>{<ExampleText>All clear</ExampleText>}</EmptyTitle>
              <EmptyDescription>
                {<ExampleText>You have no pending tasks. Enjoy the downtime or create a new one. </ExampleText>}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" variant="outline">
                <PlusIcon data-icon="inline-start" />
                {<ExampleText>New Task </ExampleText>}</Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
