
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">{<ExampleText>Open Popover</ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <PopoverHeader>
            <PopoverTitle>{<ExampleText>Dimensions</ExampleText>}</PopoverTitle>
            <PopoverDescription>
              {<ExampleText>Set the dimensions for the layer. </ExampleText>}</PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-2">
            <Field orientation="horizontal">
              <FieldLabel htmlFor={exampleId("width")} className="w-1/2">
                {<ExampleText>Width </ExampleText>}</FieldLabel>
              <Input id={exampleId("width")} defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor={exampleId("height")} className="w-1/2">
                {<ExampleText>Height </ExampleText>}</FieldLabel>
              <Input id={exampleId("height")} defaultValue="25px" />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
