
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
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
            <ItemDescription>{<ExampleText>Team Lead</ExampleText>}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success" size="sm">
              {<ExampleText>Online </ExampleText>}</Badge>
          </ItemActions>
        </Item>
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
            <ItemDescription>{<ExampleText>Developer</ExampleText>}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="warning" size="sm">
              {<ExampleText>Away </ExampleText>}</Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia>
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/823cc7e47d4e7e6cb0.jpg"
                alt={copyExample("David Kim")}
              />
              <AvatarFallback>{<ExampleText>DK</ExampleText>}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{<ExampleText>David Kim</ExampleText>}</ItemTitle>
            <ItemDescription>{<ExampleText>Designer</ExampleText>}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="outline" size="sm">
              {<ExampleText>Offline </ExampleText>}</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
