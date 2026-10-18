
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon, PackageIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
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
  {
    name: "Ergonomic Desk Chair",
    sku: "FRN-001",
    category: "Furniture",
    price: "$549.00",
    stock: 124,
    stockStatus: "In Stock",
    stockVariant: "success-light" as const,
  },
  {
    name: "Wireless Noise-Canceling Headphones",
    sku: "AUD-042",
    category: "Audio",
    price: "$349.99",
    stock: 8,
    stockStatus: "Low Stock",
    stockVariant: "warning-light" as const,
  },
  {
    name: '4K Ultra HD Monitor 32"',
    sku: "DSP-019",
    category: "Displays",
    price: "$799.00",
    stock: 0,
    stockStatus: "Out of Stock",
    stockVariant: "destructive-light" as const,
  },
  {
    name: "Mechanical Keyboard RGB",
    sku: "INP-087",
    category: "Input",
    price: "$179.99",
    stock: 56,
    stockStatus: "In Stock",
    stockVariant: "success-light" as const,
  },
  {
    name: "USB-C Docking Station",
    sku: "ACC-033",
    category: "Accessories",
    price: "$249.00",
    stock: 3,
    stockStatus: "Low Stock",
    stockVariant: "warning-light" as const,
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{<ExampleText>Product</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Category</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Stock</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Price</ExampleText>}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{products.map((product) => (
            <TableRow key={product.sku}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-sm">
                    <PackageIcon className="text-muted-foreground size-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{<ExampleText>{product.name}</ExampleText>}</span>
                    <span className="text-muted-foreground truncate font-mono text-xs">
                      {<ExampleText>{product.sku}</ExampleText>}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {<ExampleText>{product.category}</ExampleText>}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={product.stockVariant} size="sm">
                    {<ExampleText>{product.stockStatus}</ExampleText>}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    ({<ExampleText>{product.stock}</ExampleText>})
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {<ExampleText>{product.price}</ExampleText>}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon  />
                      <span className="sr-only">{<ExampleText>Open menu</ExampleText>}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>{<ExampleText>Edit</ExampleText>}</DropdownMenuItem>
                    <DropdownMenuItem>{<ExampleText>Restock</ExampleText>}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      {<ExampleText>Archive </ExampleText>}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}</ExampleText>}
        </TableBody>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
