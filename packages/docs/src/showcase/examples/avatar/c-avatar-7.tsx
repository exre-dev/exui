
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, PlusIcon, ShieldCheckIcon, StarIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center gap-2">
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/f1d4253436738aaf8f.jpg"
          alt={copyExample("Nick Johnson")}
        />
        <AvatarFallback>{<ExampleText>NJ</ExampleText>}</AvatarFallback>
        <AvatarBadge>
          <PlusIcon aria-hidden="true" />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/e93553df2422635515.jpg"
          alt={copyExample("Alex Johnson (away)")}
        />
        <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-success">
          <CheckIcon aria-hidden="true" />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
          alt={copyExample("Sarah Chen")}
        />
        <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-warning">
          <StarIcon aria-hidden="true" />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/4349381d8a8476edbc.jpg"
          alt={copyExample("Michael Rodriguez")}
        />
        <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-info">
          <ShieldCheckIcon aria-hidden="true" />
        </AvatarBadge>
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
