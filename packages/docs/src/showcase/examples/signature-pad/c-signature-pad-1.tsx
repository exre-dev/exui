"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadControls,
  SignaturePadPlaceholder,
  SignaturePadPreview,
  SignaturePadSave,
  type SignaturePadStroke,
} from "@exre/exui"

  function OriginalPattern() {
  const [saved, setSaved] = useState<SignaturePadStroke[]>([])

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <SignaturePad>
        <SignaturePadArea variant="muted" className="h-60">
          <SignaturePadPlaceholder />
          <SignaturePadControls position="bottom-end">
            <SignaturePadClear />
            <SignaturePadSave
              format="json"
              onSave={(_, strokes) => setSaved(strokes)}
            />
          </SignaturePadControls>
        </SignaturePadArea>
      </SignaturePad>
      <div role="status">
        {<ExampleText>{saved.length > 0 && (
          <div className="text-muted-foreground flex items-center gap-3 text-sm">
            {<ExampleText>Saved </ExampleText>}<SignaturePadPreview strokes={saved} className="h-8 w-auto" />
          </div>
        )}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
