
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Users as RiFacebookFill, CodeXml as RiGithubFill, Globe as RiGoogleFill, AtSign as RiTwitterXFill } from "lucide-react"

import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        aria-label={copyExample("Login with Google")}
        className="flex-1"
        size="icon"
        variant="outline"
      >
        <RiGoogleFill
          aria-hidden="true"
          className="dark:text-primary text-[#DB4437]"
          size={16}
        />
      </Button>
      <Button
        aria-label={copyExample("Login with Facebook")}
        className="flex-1"
        size="icon"
        variant="outline"
      >
        <RiFacebookFill
          aria-hidden="true"
          className="dark:text-primary text-[#1877f2]"
          size={16}
        />
      </Button>
      <Button
        aria-label={copyExample("Login with X")}
        className="flex-1"
        size="icon"
        variant="outline"
      >
        <RiTwitterXFill
          aria-hidden="true"
          className="dark:text-primary text-[#14171a]"
          size={16}
        />
      </Button>
      <Button
        aria-label={copyExample("Login with GitHub")}
        className="flex-1"
        size="icon"
        variant="outline"
      >
        <RiGithubFill
          aria-hidden="true"
          className="dark:text-primary text-black"
          size={16}
        />
      </Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
