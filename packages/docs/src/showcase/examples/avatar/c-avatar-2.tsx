
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { UserIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <UserIcon className="size-4" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
