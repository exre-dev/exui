
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CodeIcon, DatabaseIcon, WebhookIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <DatabaseIcon  />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{<ExampleText>Database</ExampleText>}</ItemTitle>
            <ItemDescription>
              {<ExampleText>Sync records from your data warehouse </ExampleText>}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success-light" size="sm">
              {<ExampleText>Connected </ExampleText>}</Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <WebhookIcon  />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{<ExampleText>Webhooks</ExampleText>}</ItemTitle>
            <ItemDescription>
              {<ExampleText>Push realtime events to your endpoints </ExampleText>}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success-light" size="sm">
              {<ExampleText>Connected </ExampleText>}</Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <CodeIcon  />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{<ExampleText>API access</ExampleText>}</ItemTitle>
            <ItemDescription>
              {<ExampleText>Build custom integrations with the REST API </ExampleText>}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              {<ExampleText>Connect </ExampleText>}</Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
