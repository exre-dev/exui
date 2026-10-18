
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@exre/exui"

const SIDES = [
  { label: "Top", direction: "top" },
  { label: "Right", direction: "right" },
  { label: "Bottom", direction: "bottom" },
  { label: "Left", direction: "left" },
] as const

  function OriginalPattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {<ExampleText>{SIDES.map((side) => (
        <Drawer key={side.label} direction={side.direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">{<ExampleText>{side.label}</ExampleText>}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{<ExampleText>Move Goal</ExampleText>}</DrawerTitle>
              <DrawerDescription>
                {<ExampleText>Set your daily activity goal. </ExampleText>}</DrawerDescription>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              {<ExampleText>{Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className="mb-4 leading-normal">
                  {<ExampleText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </ExampleText>}</p>
              ))}</ExampleText>}
            </div>
            <DrawerFooter>
              <Button>{<ExampleText>Submit</ExampleText>}</Button>
              <DrawerClose asChild>
                <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
