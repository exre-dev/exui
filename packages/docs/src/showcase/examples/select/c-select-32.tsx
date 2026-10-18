
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArchiveIcon, FileTextIcon, ImageIcon, MusicIcon, VideoIcon } from "lucide-react"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"


const categories = [
  {
    value: "documents",
    label: "Documents",
    icon: (
      <FileTextIcon className="size-4" />
    ),
  },
  {
    value: "images",
    label: "Images",
    icon: (
      <ImageIcon className="size-4" />
    ),
  },
  {
    value: "videos",
    label: "Videos",
    icon: (
      <VideoIcon className="size-4" />
    ),
  },
  {
    value: "audio",
    label: "Audio",
    icon: (
      <MusicIcon className="size-4" />
    ),
  },
  {
    value: "archives",
    label: "Archives",
    icon: (
      <ArchiveIcon className="size-4" />
    ),
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={categories[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={copyExample("Select category")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <span className="flex items-center gap-2">
                  {<ExampleText>{category.icon}</ExampleText>}
                  <span>{<ExampleText>{category.label}</ExampleText>}</span>
                </span>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
