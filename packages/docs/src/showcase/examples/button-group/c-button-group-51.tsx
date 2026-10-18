
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon, MoreHorizontalIcon, PlusIcon, ShoppingCartIcon, UserPlusIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@exre/exui"


const icons = {
  plus: (
    <PlusIcon aria-hidden="true" />
  ),
  more: (
    <MoreHorizontalIcon aria-hidden="true" />
  ),
  userPlus: (
    <UserPlusIcon aria-hidden="true" />
  ),
  cart: (
    <ShoppingCartIcon aria-hidden="true" />
  ),
  fileText: (
    <FileTextIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label={copyExample("More options")}>
        {<ExampleText>{icons.plus}</ExampleText>}
        {<ExampleText>New </ExampleText>}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="outline" aria-label={copyExample("More options")}>
            {<ExampleText>{icons.more}</ExampleText>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Create</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              {<ExampleText>{icons.userPlus}</ExampleText>}
              {<ExampleText>New Customer </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.cart}</ExampleText>}
              {<ExampleText>New Order </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.fileText}</ExampleText>}
              {<ExampleText>New Invoice </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
