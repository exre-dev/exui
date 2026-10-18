
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon } from "lucide-react"

import { IconTile } from "@exre/exui"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex w-full max-w-sm items-center justify-center">
      <Item variant="outline">
        <ItemMedia>
          <IconTile variant="elevated" size="sm" aria-hidden="true">
            <FileTextIcon  />
          </IconTile>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Quarterly report</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>Updated 2 hours ago by Anna</ExampleText>}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
