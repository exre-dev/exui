
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FolderIcon } from "lucide-react"

import { IconTile } from "@exre/exui"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <IconTile variant="frame" size="xl" aria-hidden="true">
              <FolderIcon  />
            </IconTile>
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>No files yet</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>Upload a file to get started. Everything you add shows up here. </ExampleText>}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
