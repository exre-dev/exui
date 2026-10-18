
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BrushCleaningIcon } from "lucide-react"

import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadRedo,
  SignaturePadUndo,
} from "@exre/exui"

import { ButtonGroup } from "@exre/exui"
import { Kbd, KbdGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <SignaturePad className="mx-auto max-w-lg">
      <div className="flex items-center gap-3">
        <ButtonGroup aria-label={copyExample("History")}>
          <SignaturePadUndo />
          <SignaturePadRedo />
        </ButtonGroup>
        <p className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
          <KbdGroup>
            <Kbd>{<ExampleText>Ctrl</ExampleText>}</Kbd>
            <Kbd>{<ExampleText>Z</ExampleText>}</Kbd>
          </KbdGroup>
          {<ExampleText>to undo </ExampleText>}</p>
        <SignaturePadClear size="sm" className="ms-auto">
          <BrushCleaningIcon aria-hidden="true" />
          {<ExampleText>Clear </ExampleText>}</SignaturePadClear>
      </div>
      <SignaturePadArea className="h-48">
        <SignaturePadGuide />
        <SignaturePadPlaceholder>{<ExampleText>Draw your signature</ExampleText>}</SignaturePadPlaceholder>
      </SignaturePadArea>
    </SignaturePad>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
