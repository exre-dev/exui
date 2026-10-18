
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon, FolderIcon, TrashIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" aria-label={copyExample("Files")}>
        <FileIcon aria-hidden="true" />
        {<ExampleText>Files </ExampleText>}</Button>
      <Button variant="outline" disabled aria-label={copyExample("Folder")}>
        <FolderIcon aria-hidden="true" />
        {<ExampleText>Folder </ExampleText>}</Button>
      <Button variant="outline" aria-label={copyExample("Trash")}>
        <TrashIcon aria-hidden="true" />
        {<ExampleText>Trash </ExampleText>}</Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
