
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent } from "@exre/exui"
import { Input } from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"

const items = [
  { id: "1", name: "Item Alpha", quantity: 1, price: "$10.00" },
  { id: "2", name: "Item Beta", quantity: 2, price: "$20.00" },
  { id: "3", name: "Item Gamma", quantity: 1, price: "$30.00" },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{<ExampleText>Item</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Quantity</ExampleText>}</TableHead>
                <TableHead className="text-right">{<ExampleText>Price</ExampleText>}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {<ExampleText>{items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{<ExampleText>{item.name}</ExampleText>}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={item.quantity}
                      className="h-8 w-20"
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="text-right">{<ExampleText>{item.price}</ExampleText>}</TableCell>
                </TableRow>
              ))}</ExampleText>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
