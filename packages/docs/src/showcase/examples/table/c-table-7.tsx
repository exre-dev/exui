
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"

const orders = [
  {
    id: "#3210",
    customer: "Olivia Martin",
    email: "olivia@example.com",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    amount: "$1,999.00",
    status: "Paid",
    statusVariant: "success" as const,
    date: "Feb 1, 2025",
  },
  {
    id: "#3209",
    customer: "Jackson Lee",
    email: "jackson@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    amount: "$39.00",
    status: "Pending",
    statusVariant: "warning" as const,
    date: "Jan 28, 2025",
  },
  {
    id: "#3208",
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    amount: "$299.00",
    status: "Paid",
    statusVariant: "success" as const,
    date: "Jan 25, 2025",
  },
  {
    id: "#3207",
    customer: "William Kim",
    email: "will@example.com",
    avatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    amount: "$99.00",
    status: "Refunded",
    statusVariant: "destructive-light" as const,
    date: "Jan 22, 2025",
  },
  {
    id: "#3206",
    customer: "Sofia Davis",
    email: "sofia@example.com",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    amount: "$2,500.00",
    status: "Paid",
    statusVariant: "success" as const,
    date: "Jan 18, 2025",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{<ExampleText>Order</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Customer</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Amount</ExampleText>}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{orders.map((order) => (
            <ExampleRuntimeConsumer key={order.id} render={({copy: copyExample}) => (<TableRow key={order.id}>
              <TableCell className="font-mono text-sm">{<ExampleText>{order.id}</ExampleText>}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={order.avatar} alt={copyExample(order.customer)} />
                    <AvatarFallback>
                      {<ExampleText>{order.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {<ExampleText>{order.customer}</ExampleText>}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {<ExampleText>{order.date}</ExampleText>}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={order.statusVariant} size="sm">
                  {<ExampleText>{order.status}</ExampleText>}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {<ExampleText>{order.amount}</ExampleText>}
              </TableCell>
            </TableRow>)} />
          ))}</ExampleText>}
        </TableBody>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
