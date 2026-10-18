
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon, CreditCardIcon, ShieldIcon, UserIcon } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup className="gap-0">
        <Item asChild size="xs">
          <a onClick={(event) => event.preventDefault()} href="#">
            <ItemMedia variant="icon">
              <UserIcon  />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{<ExampleText>Profile</ExampleText>}</ItemTitle>
              <ItemDescription>{<ExampleText>Manage your account details</ExampleText>}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="text-muted-foreground size-4" />
            </ItemActions>
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild size="xs">
          <a onClick={(event) => event.preventDefault()} href="#">
            <ItemMedia variant="icon">
              <ShieldIcon  />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{<ExampleText>Security</ExampleText>}</ItemTitle>
              <ItemDescription>{<ExampleText>Password and two-factor auth</ExampleText>}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="text-muted-foreground size-4" />
            </ItemActions>
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild size="xs">
          <a onClick={(event) => event.preventDefault()} href="#">
            <ItemMedia variant="icon">
              <CreditCardIcon  />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{<ExampleText>Billing</ExampleText>}</ItemTitle>
              <ItemDescription>{<ExampleText>Plans, invoices, and payment</ExampleText>}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="text-muted-foreground size-4" />
            </ItemActions>
          </a>
        </Item>
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
