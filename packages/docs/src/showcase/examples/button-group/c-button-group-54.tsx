"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, Code2Icon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


const services = ["Resend API", "Stripe API", "GitHub API"]
const environments = ["Production", "Staging", "Development"]
const versions = ["v2", "v1", "beta"]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [service, setService] = useState(services[0])
  const [environment, setEnvironment] = useState(environments[0])
  const [version, setVersion] = useState(versions[0])

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs font-normal"
            aria-label={copyExample("Select API service")}
          >
            <Code2Icon className="size-3.5 opacity-60" aria-hidden="true" />
            {<ExampleText>{service}</ExampleText>}
            <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuGroup>
            {<ExampleText>{services.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setService(item)}>
                {<ExampleText>{item}</ExampleText>}
              </DropdownMenuItem>
            ))}</ExampleText>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-7 gap-1 text-xs font-normal"
            aria-label={copyExample("Select environment")}
          >
            {<ExampleText>{environment}</ExampleText>}
            <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuGroup>
            {<ExampleText>{environments.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setEnvironment(item)}>
                {<ExampleText>{item}</ExampleText>}
              </DropdownMenuItem>
            ))}</ExampleText>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-7 gap-1 font-mono text-xs"
            aria-label={copyExample("Select API version")}
          >
            {<ExampleText>{version}</ExampleText>}
            <ChevronDownIcon className="size-3 opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-24">
          <DropdownMenuGroup>
            {<ExampleText>{versions.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setVersion(item)}>
                <span className="font-mono">{<ExampleText>{item}</ExampleText>}</span>
              </DropdownMenuItem>
            ))}</ExampleText>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
