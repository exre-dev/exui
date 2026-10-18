
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon, FolderIcon, ImageIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup className="**:data-[slot=button]:border-0">
      <Button aria-label={copyExample("Files")}>
        <FileIcon aria-hidden="true" />
        {<ExampleText>Files </ExampleText>}</Button>
      <ButtonGroupSeparator className="bg-primary/72" />
      <Button aria-label={copyExample("Folder")}>
        <FolderIcon aria-hidden="true" />
        {<ExampleText>Folder </ExampleText>}</Button>
      <ButtonGroupSeparator className="bg-primary/72" />
      <Button aria-label={copyExample("Trash")}>
        <ImageIcon aria-hidden="true" />
        {<ExampleText>Media </ExampleText>}</Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
