
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Table>
        <TableCaption>{<ExampleText>A list of your recent invoices.</ExampleText>}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{<ExampleText>Invoice</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Method</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Amount</ExampleText>}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="text-sm font-medium">
                {<ExampleText>{invoice.invoice}</ExampleText>}
              </TableCell>
              <TableCell className="text-sm">{<ExampleText>{invoice.paymentStatus}</ExampleText>}</TableCell>
              <TableCell className="text-sm">{<ExampleText>{invoice.paymentMethod}</ExampleText>}</TableCell>
              <TableCell className="text-right text-sm">
                {<ExampleText>{invoice.totalAmount}</ExampleText>}
              </TableCell>
            </TableRow>
          ))}</ExampleText>}
        </TableBody>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
