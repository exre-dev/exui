
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileSpreadsheetIcon, FileTextIcon, ImageIcon } from "lucide-react"

import { Badge } from "@exre/exui"

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
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <FileTextIcon  />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Quarterly Report.pdf</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>2.4 MB · Updated 2 hours ago</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="success-light" size="sm">
            {<ExampleText>Final </ExampleText>}</Badge>
          <Button variant="outline" size="sm" className="ml-2">
            {<ExampleText>Open </ExampleText>}</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <FileSpreadsheetIcon  />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Budget 2025.xlsx</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>856 KB · Updated yesterday</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="warning-light" size="sm">
            {<ExampleText>Draft </ExampleText>}</Badge>
          <Button variant="outline" size="sm" className="ml-2">
            {<ExampleText>Open </ExampleText>}</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <ImageIcon  />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{<ExampleText>Hero Banner.png</ExampleText>}</ItemTitle>
          <ItemDescription>{<ExampleText>4.1 MB · Updated 3 days ago</ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="info-light" size="sm">
            {<ExampleText>Review </ExampleText>}</Badge>
          <Button variant="outline" size="sm" className="ml-2">
            {<ExampleText>Open </ExampleText>}</Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
