
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookmarkIcon, DownloadIcon, SendIcon } from "lucide-react"



import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Message sent", {
            description: "Your message has been delivered.",
            icon: (
              <SendIcon className="size-4" />
            ),
          })
        }
      >
        {<ExampleText>Send Icon </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Download complete", {
            description: "design-assets.zip is ready.",
            icon: (
              <DownloadIcon className="size-4" />
            ),
          })
        }
      >
        {<ExampleText>Download Icon </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Bookmark added", {
            description: "Saved to your collection.",
            icon: (
              <BookmarkIcon className="size-4" />
            ),
          })
        }
      >
        {<ExampleText>Bookmark Icon </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
