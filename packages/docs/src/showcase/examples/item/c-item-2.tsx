
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon, MailIcon } from "lucide-react"

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
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <MailIcon  />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Email Notifications</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>Receive updates via email</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            {<ExampleText>Configure </ExampleText>}</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <BellIcon  />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Push Notifications</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>Get notified on your device</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">{<ExampleText>Enable</ExampleText>}</Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
