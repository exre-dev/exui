
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PackageIcon } from "lucide-react"

import { IconStack } from "@exre/exui"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-md items-center justify-center p-4">
      <Item variant="outline" className="max-w-sm">
        <ItemMedia>
          <IconStack aria-hidden="true" className="text-primary h-12 w-11">
            <PackageIcon className="text-primary size-3" />
          </IconStack>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Registry package ready</ExampleText>}</ItemTitle>
          <ItemDescription>
            {<ExampleText>Use IconStack as rich media inside compact shadcn items. </ExampleText>}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
