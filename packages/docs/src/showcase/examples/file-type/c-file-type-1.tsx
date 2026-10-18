
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  FileType,
  type FileTypeName,
} from "@exre/exui"

const formats = [
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "jpg",
  "mp4",
  "mp3",
  "zip",
  "fig",
  "html",
] as const satisfies readonly FileTypeName[]

  function OriginalPattern() {
  // No captions: each icon names itself ("PDF file", "MP4 file"), so a screen
  // reader still hears every format.
  return (
    <div className="mx-auto grid w-fit grid-cols-5 gap-x-4 gap-y-6">
      {<ExampleText>{formats.map((type) => (
        <FileType key={type} type={type} />
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
