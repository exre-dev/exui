
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <Item variant="outline" size="xs">
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/e93553df2422635515.jpg"
              alt={copyExample("Alex Johnson")}
            />
            <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Alex Johnson</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>Senior Software Engineer</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            {<ExampleText>Follow </ExampleText>}</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/c6e9e0d487c842b94f.jpg"
              alt={copyExample("Sarah Chen")}
            />
            <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Sarah Chen</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>Product Designer</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">{<ExampleText>Following</ExampleText>}</Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
