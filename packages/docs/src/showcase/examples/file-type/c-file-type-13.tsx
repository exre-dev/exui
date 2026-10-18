
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CloudUploadIcon, EyeOffIcon, LinkIcon, LockIcon, ShieldCheckIcon, StarIcon } from "lucide-react"

import type { ReactNode } from "react"
import {
  FileType,
  type FileTypeName,
} from "@exre/exui"



type FileState = {
  type: FileTypeName
  /** Names the state and the type, so the icons can stay hidden. */
  caption: string
  icon: ReactNode
}

const FILES: FileState[] = [
  {
    type: "pdf",
    caption: "Locked PDF",
    icon: (
      <LockIcon  />
    ),
  },
  {
    type: "docx",
    caption: "Verified DOCX",
    icon: (
      <ShieldCheckIcon  />
    ),
  },
  {
    type: "xlsx",
    caption: "Shared XLSX",
    icon: (
      <LinkIcon  />
    ),
  },
  {
    type: "png",
    caption: "Starred PNG",
    icon: (
      <StarIcon  />
    ),
  },
  {
    type: "fig",
    caption: "Hidden FIG",
    icon: (
      <EyeOffIcon  />
    ),
  },
  {
    type: "zip",
    caption: "Uploading ZIP",
    icon: (
      <CloudUploadIcon  />
    ),
  },
]

  function OriginalPattern() {
  return (
    <ul className="mx-auto grid w-fit grid-cols-3 gap-x-8 gap-y-6">
      {<ExampleText>{FILES.map((file) => (
        <li key={file.type} className="flex flex-col items-center gap-2.5">
          {/* The icon takes the glyph's place and color in every variant. */}
          <div className="flex gap-2">
            <FileType type={file.type} icon={file.icon} aria-hidden="true" />
            <FileType
              type={file.type}
              icon={file.icon}
              variant="solid"
              aria-hidden="true"
            />
          </div>
          <span className="text-muted-foreground text-xs">{<ExampleText>{file.caption}</ExampleText>}</span>
        </li>
      ))}</ExampleText>}
    </ul>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
