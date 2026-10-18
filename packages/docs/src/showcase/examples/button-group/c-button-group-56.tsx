
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DownloadIcon, PaperclipIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


const attachment = {
  name: "Q4-Product-Roadmap.pdf",
  size: "2.4 MB",
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" size="xs">
        <PaperclipIcon aria-hidden="true" />
        {<ExampleText>{attachment.name}</ExampleText>}
        <span className="opacity-60">({<ExampleText>{attachment.size}</ExampleText>})</span>
      </Button>
      <Button variant="outline" size="icon-xs" aria-label={copyExample("Download attachment")}>
        <DownloadIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
