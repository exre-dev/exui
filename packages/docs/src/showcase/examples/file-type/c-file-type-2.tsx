
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  FileType,
  type FileTypeName,
  type FileTypeVariant,
} from "@exre/exui"

const variants: FileTypeVariant[] = ["outline", "solid", "light", "mono"]

// The same types in every row, so the variant is the only thing that changes.
const types = [
  "pdf",
  "docx",
  "xlsx",
  "jpg",
  "zip",
] as const satisfies readonly FileTypeName[]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-fit flex-col gap-5">
      {<ExampleText>{variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-2.5">
          <span className="text-muted-foreground text-xs capitalize">
            {<ExampleText>{variant}</ExampleText>}
          </span>
          <div className="flex gap-4">
            {<ExampleText>{types.map((type) => (
              <FileType key={type} type={type} variant={variant} />
            ))}</ExampleText>}
          </div>
        </div>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
