import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleDashedIcon, DatabaseIcon, FlaskConicalIcon } from "lucide-react"
import { Card, CardContent } from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"
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

const MODELS = [
  { name: "stg_orders", rows: "1.2M rows" },
  { name: "stg_customers", rows: "84K rows" },
  { name: "int_order_items", rows: "3.4M rows" },
  { name: "fct_revenue", rows: "1.1M rows" },
]

const DUPLICATES = [
  { orderId: "ord_8821340", copies: 2 },
  { orderId: "ord_8823004", copies: 3 },
]

// The skipped model stays listed as pending, so the run shows which report is
// stale.
function OriginalPattern() {
  return (
    <div className="w-full max-w-md text-sm">
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <DatabaseIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Built {MODELS.length} models</ExampleText></TraceTitle>
              <TraceDescription><ExampleText>1m 24s</ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {MODELS.map((model) => (
                <TraceLine key={model.name}>
                  <TraceTitle><ExampleText>{model.name}</ExampleText></TraceTitle>
                  <TraceDescription><ExampleText>{model.rows}</ExampleText></TraceDescription>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <FlaskConicalIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Unique test failed on fct_revenue</ExampleText></TraceTitle>
              <TraceDescription><ExampleText>
                {DUPLICATES.length} duplicates
              </ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            {/* A borderless Card is the outer frame; the table sits flush in it. */}
            <Card className="p-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8"><ExampleText>order_id</ExampleText></TableHead>
                      <TableHead className="h-8 text-right"><ExampleText>Copies</ExampleText></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DUPLICATES.map((row) => (
                      <TableRow key={row.orderId}>
                        <TableCell className="py-1.5">
                          <code className="text-xs">{row.orderId}</code>
                        </TableCell>
                        <TableCell className="py-1.5 text-right"><ExampleText>
                          {row.copies}
                        </ExampleText></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="pending">
          <TraceIcon>
            <CircleDashedIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Skipped dim_customer_ltv</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>upstream failed</ExampleText></TraceDescription>
        </TraceLine>
      </Trace>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
