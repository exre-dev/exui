
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">{<ExampleText>With No Close Button</ExampleText>}</Button>
        </SheetTrigger>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>{<ExampleText>Edit profile</ExampleText>}</SheetTitle>
            <SheetDescription>
              {<ExampleText>Make changes to your profile here. Click save when you're done. </ExampleText>}</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={exampleId("name")}>{<ExampleText>Name</ExampleText>}</FieldLabel>
                <Input id={exampleId("name")} defaultValue="John Doe" />
              </Field>
              <Field>
                <FieldLabel htmlFor={exampleId("username")}>{<ExampleText>Username</ExampleText>}</FieldLabel>
                <Input id={exampleId("username")} defaultValue="@john-doe" />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type="submit">{<ExampleText>Save changes</ExampleText>}</Button>
            <SheetClose asChild>
              <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
