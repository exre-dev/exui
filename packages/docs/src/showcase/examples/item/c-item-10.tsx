
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FolderIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@exre/exui"
import { Progress } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <Item variant="outline">
        <ItemHeader>
          <div className="flex items-center gap-2">
            <FolderIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
            <span className="text-muted-foreground text-xs">{<ExampleText>Project</ExampleText>}</span>
          </div>
          <Badge variant="info-light" size="xs">
            {<ExampleText>In Progress </ExampleText>}</Badge>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>{<ExampleText>Website Redesign</ExampleText>}</ItemTitle>
          <ItemDescription>
            {<ExampleText>Complete overhaul of the marketing site with a focus on conversion optimization and modern design patterns. </ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            {<ExampleText>Open </ExampleText>}</Button>
        </ItemActions>
        <ItemFooter>
          <AvatarGroup>
            <Avatar size="sm">
              <AvatarImage
                src="/examples/reui/photos/c6e9e0d487c842b94f.jpg"
                alt={copyExample("SC")}
              />
              <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="/examples/reui/photos/e93553df2422635515.jpg"
                alt={copyExample("AJ")}
              />
              <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="/examples/reui/photos/dbc92c73c5f6acf737.jpg"
                alt={copyExample("EP")}
              />
              <AvatarFallback>{<ExampleText>EP</ExampleText>}</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <div className="flex items-center gap-2">
            <Progress value={65} className="w-20" />
            <span className="text-muted-foreground text-xs">65%</span>
          </div>
        </ItemFooter>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
