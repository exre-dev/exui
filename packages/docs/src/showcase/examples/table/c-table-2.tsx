
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"

const invoices = [
  { invoice: "INV001", status: "Paid", amount: "$250.00" },
  { invoice: "INV002", status: "Pending", amount: "$150.00" },
  { invoice: "INV003", status: "Unpaid", amount: "$350.00" },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{<ExampleText>Invoice</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Amount</ExampleText>}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{<ExampleText>{invoice.invoice}</ExampleText>}</TableCell>
              <TableCell>{<ExampleText>{invoice.status}</ExampleText>}</TableCell>
              <TableCell className="text-right">{<ExampleText>{invoice.amount}</ExampleText>}</TableCell>
            </TableRow>
          ))}</ExampleText>}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>{<ExampleText>Total</ExampleText>}</TableCell>
            <TableCell className="text-right font-bold">$750.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
