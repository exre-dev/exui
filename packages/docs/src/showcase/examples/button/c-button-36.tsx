
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Users as RiFacebookFill, CodeXml as RiGithubFill, Globe as RiGoogleFill, Camera as RiInstagramFill, BriefcaseBusiness as RiLinkedinFill, AtSign as RiTwitterXFill } from "lucide-react"

import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button aria-label={copyExample("Google")} variant="outline" size="icon">
        <RiGoogleFill aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("Facebook")} variant="outline" size="icon">
        <RiFacebookFill aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("X")} variant="outline" size="icon">
        <RiTwitterXFill aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("GitHub")} variant="outline" size="icon">
        <RiGithubFill aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("LinkedIn")} variant="outline" size="icon">
        <RiLinkedinFill aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("Instagram")} variant="outline" size="icon">
        <RiInstagramFill aria-hidden="true" />
      </Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
