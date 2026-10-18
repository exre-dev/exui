
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon } from "lucide-react"

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
          <CardTitle>{<ExampleText>Recent Documents</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>A list of your recently opened documents. </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileIcon  />
              </EmptyMedia>
              <EmptyTitle>{<ExampleText>No documents yet</ExampleText>}</EmptyTitle>
              <EmptyDescription>
                {<ExampleText>You haven't opened any documents recently. </ExampleText>}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">{<ExampleText>Create Document</ExampleText>}</Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
