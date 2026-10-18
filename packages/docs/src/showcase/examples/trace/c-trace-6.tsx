"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpRightIcon, GlobeIcon, SearchIcon } from "lucide-react"
import * as React from "react"
import { Badge } from "@exre/exui"
import { cn } from "@exre/exui"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@exre/exui"

type Source = { id: number; title: string; domain: string; href: string }

const QUERIES = [
  { query: "localStorage session token xss risk", results: 8 },
  { query: "httponly cookie spa refresh token", results: 6 },
]

const SOURCES: Source[] = [
  {
    id: 1,
    title: "Session management cheat sheet",
    domain: "owasp.org",
    href: "#",
  },
  {
    id: 2,
    title: "Window: localStorage property",
    domain: "developer.mozilla.org",
    href: "#",
  },
  {
    id: 3,
    title: "Set-Cookie header",
    domain: "developer.mozilla.org",
    href: "#",
  },
  {
    id: 4,
    title: "OAuth 2.0 for browser-based apps",
    domain: "datatracker.ietf.org",
    href: "#",
  },
]

// A citation opens the sources and moves focus to the row it cites.
function OriginalPattern() {
  const [sourcesOpen, setSourcesOpen] = React.useState(false)
  const [cited, setCited] = React.useState<number | null>(null)
  const linkRefs = React.useRef(new Map<number, HTMLAnchorElement>())

  // The panel mounts its rows only once it is open, so focus waits a frame.
  function showSource(id: number) {
    setSourcesOpen(true)
    setCited(id)
    window.requestAnimationFrame(() => linkRefs.current.get(id)?.focus())
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <SearchIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Searched the web {QUERIES.length} times</ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {QUERIES.map((item) => (
                <TraceLine key={item.query}>
                  <TraceTitle><ExampleText>{item.query}</ExampleText></TraceTitle>
                  <TraceDescription><ExampleText>{item.results} results</ExampleText></TraceDescription>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <GlobeIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Read {SOURCES.length} sources</ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {SOURCES.map((source) => (
                <a
                  key={source.id}
                  ref={(node) => {
                    if (node) linkRefs.current.set(source.id, node)
                    else linkRefs.current.delete(source.id)
                  }}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  onBlur={() => setCited(null)}
                >
                  <TraceLine>
                    <TraceTitle>
                      {/* The cited source keeps full contrast until focus
                          leaves it, so a mouse click shows where it landed. */}
                      <span
                        className={cn(cited === source.id && "text-foreground")}
                      ><ExampleText>
                        {source.id}. {source.title}
                      </ExampleText></span>
                      <span className="sr-only"><ExampleText> (opens in a new tab)</ExampleText></span>
                    </TraceTitle>
                    <TraceDescription><ExampleText>{source.domain}</ExampleText></TraceDescription>
                    <TraceIcon>
                      <ArrowUpRightIcon aria-hidden="true"
                      />
                    </TraceIcon>
                  </TraceLine>
                </a>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <p className="leading-relaxed text-pretty"><ExampleText>
        No. Any XSS bug can read it
        <Cite id={1} onSelect={showSource} />
        <Cite id={2} onSelect={showSource} />. Use an HttpOnly cookie
        <Cite id={3} onSelect={showSource} /> and keep access tokens in memory
        <Cite id={4} onSelect={showSource} />.
      </ExampleText></p>
    </div>
  )
}

function Cite({
  id,
  onSelect,
}: {
  id: number
  onSelect: (id: number) => void
}) {
  const { copy: copyExample, format: formatExample } = useExampleRuntime()
  const source = SOURCES.find((item) => item.id === id)
  return (
    <Badge
      asChild
      variant="secondary"
      radius="full"
      className="ms-1 cursor-pointer align-middle"
    >
      <button
        type="button"
        aria-label={formatExample("Source {id}: {title}", { id, title: copyExample(source?.title ?? "") })}
        onClick={() => onSelect(id)}
      >
        {id}
      </button>
    </Badge>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
