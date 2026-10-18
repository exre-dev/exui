"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const [position, setPosition] = useState("bottom")

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>Radio Group </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Panel Position</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">
                <ArrowUpIcon  />
                {<ExampleText>Top </ExampleText>}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <ArrowDownIcon  />
                {<ExampleText>Bottom </ExampleText>}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right" disabled>
                <ArrowRightIcon  />
                {<ExampleText>Right </ExampleText>}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
