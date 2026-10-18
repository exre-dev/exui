import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChartLineIcon, ChevronRightIcon, DatabaseIcon } from "lucide-react"
import { CodeBlock } from "@exre/exui"

import { Bubble, BubbleContent } from "@exre/exui"
import { Message, MessageContent } from "@exre/exui"
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

const QUERIES = [
  {
    id: "by-day",
    title: "Queried trial signups by day",
    description: "28 rows",
    sql: `select date_trunc('day', created_at) as day, count(*)
from trials
where created_at >= current_date - 27
group by 1 order by 1`,
  },
  {
    id: "by-domain",
    title: "Queried bounces by email domain",
    description: "12 rows",
    sql: `select split_part(email, '@', 2) as domain, count(*)
from verification_attempts
where status = 'bounced' and created_at::date = '2026-10-06'
group by 1 order by 2 desc limit 12`,
  },
]

const DASHBOARDS = [
  { title: "Activation funnel, weekly", href: "#" },
  { title: "Email delivery health", href: "#" },
]

// The work folds into one row above the answer and the sources sit below it.
// keeps an opened query open when the summary folds.
function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <div className="flex w-full max-w-md flex-col gap-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Why did trial signups drop last Tuesday?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <div className="flex flex-col gap-4">
            <Trace>
              <TraceCollapsible defaultOpen>
                <TraceCollapsibleTrigger>
                  <TraceLine>
                    <TraceTitle><ExampleText>Worked for 38s</ExampleText></TraceTitle>
                    <TraceDescription><ExampleText>
                      {QUERIES.length} queries
                    </ExampleText></TraceDescription>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {QUERIES.map((query) => (
                      <TraceCollapsible key={query.id}>
                        <TraceCollapsibleTrigger>
                          <TraceLine>
                            <TraceIcon>
                              <DatabaseIcon aria-hidden="true"
                              />
                            </TraceIcon>
                            <TraceTitle><ExampleText>{query.title}</ExampleText></TraceTitle>
                            <TraceDescription><ExampleText>
                              {query.description}
                            </ExampleText></TraceDescription>
                          </TraceLine>
                        </TraceCollapsibleTrigger>
                        <TraceCollapsibleContent>
                          <CodeBlock
                            code={query.sql}
                            language="sql"
                            label={copyExample(query.title)}
                            wrap
                          />
                        </TraceCollapsibleContent>
                      </TraceCollapsible>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
            <p className="leading-relaxed text-pretty"><ExampleText>
              Signups fell 41% because verification emails to Gmail bounced for
              4 hours after the DKIM record broke.
            </ExampleText></p>
            <Trace>
              <TraceCollapsible>
                <TraceCollapsibleTrigger>
                  <TraceLine>
                    <TraceIcon>
                      <ChartLineIcon aria-hidden="true"
                      />
                    </TraceIcon>
                    <TraceTitle><ExampleText>Used {DASHBOARDS.length} dashboards</ExampleText></TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {DASHBOARDS.map((dashboard) => (
                      <a key={dashboard.title} href={dashboard.href}>
                        <TraceLine>
                          <TraceTitle><ExampleText>{dashboard.title}</ExampleText></TraceTitle>
                          <TraceIcon>
                            <ChevronRightIcon aria-hidden="true"
                            />
                          </TraceIcon>
                        </TraceLine>
                      </a>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
          </div>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
