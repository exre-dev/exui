
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="group/avatar relative flex items-center justify-center">
      {/* Animated Story Ring */}
      <div className="absolute -inset-1 animate-[spin_3s_linear_infinite] rounded-full bg-linear-to-tr from-yellow-400 via-fuchsia-500 to-violet-600 opacity-75 blur-xs transition-all duration-500 group-hover/avatar:opacity-100 group-hover/avatar:blur-sm" />

      {/* Main Avatar */}
      <Avatar className="ring-background size-10 ring-2 transition-transform duration-500 group-hover/avatar:scale-95">
        <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("User story")} />
        <AvatarFallback>{<ExampleText>JD</ExampleText>}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
