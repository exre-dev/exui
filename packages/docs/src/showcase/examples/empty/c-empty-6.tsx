
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CloudUploadIcon, PlusIcon } from "lucide-react"

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
      <Empty className="w-full max-w-md border border-dashed py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CloudUploadIcon  />
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>Upload files</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>Drag and drop files here, or click to browse. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            {<ExampleText>Browse Files </ExampleText>}</Button>
          <EmptyDescription className="text-xs">
            {<ExampleText>PNG, JPG, SVG up to 10MB </ExampleText>}</EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
