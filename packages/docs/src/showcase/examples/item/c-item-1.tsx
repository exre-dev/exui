
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <Item>
        <ItemContent>
          <ItemTitle>{<ExampleText>Default Item</ExampleText>}</ItemTitle>
          <ItemDescription>
            {<ExampleText>A simple item with title and description. </ExampleText>}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{<ExampleText>Outline Item</ExampleText>}</ItemTitle>
          <ItemDescription>
            {<ExampleText>An outlined item with visible border. </ExampleText>}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>{<ExampleText>Muted Item</ExampleText>}</ItemTitle>
          <ItemDescription>
            {<ExampleText>A muted item with subtle background. </ExampleText>}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
