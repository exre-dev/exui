
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"


const products = [
  { id: "1", name: "Wireless Mouse", price: "$29.99" },
  { id: "2", name: "Mechanical Keyboard", price: "$129.99" },
  { id: "3", name: "USB-C Hub", price: "$49.99" },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{<ExampleText>Product</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Price</ExampleText>}</TableHead>
                <TableHead className="text-right">{<ExampleText>Actions</ExampleText>}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {<ExampleText>{products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{<ExampleText>{product.name}</ExampleText>}</TableCell>
                  <TableCell>{<ExampleText>{product.price}</ExampleText>}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon  />
                          <span className="sr-only">{<ExampleText>Open menu</ExampleText>}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{<ExampleText>Edit</ExampleText>}</DropdownMenuItem>
                        <DropdownMenuItem>{<ExampleText>Duplicate</ExampleText>}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          {<ExampleText>Delete </ExampleText>}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
