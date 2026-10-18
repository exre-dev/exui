
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CopyIcon, RotateCcwIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"


const apiKeys = [
  {
    name: "Production API",
    token: "sk_live_••••••••4f3a",
    permissions: ["read", "write"],
    lastUsed: "2 minutes ago",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "Staging API",
    token: "sk_test_••••••••8b2c",
    permissions: ["read", "write", "admin"],
    lastUsed: "1 hour ago",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "CI/CD Pipeline",
    token: "sk_ci_••••••••1d9e",
    permissions: ["read"],
    lastUsed: "3 days ago",
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "Legacy Integration",
    token: "sk_old_••••••••7a5f",
    permissions: ["read", "write"],
    lastUsed: "30 days ago",
    status: "Expired",
    statusVariant: "destructive-light" as const,
  },
]

const permissionVariant: Record<
  string,
  "outline" | "info-light" | "warning-light"
> = {
  read: "outline",
  write: "info-light",
  admin: "warning-light",
}

  function OriginalPattern() {
  return (
    <Card className="mx-auto flex w-full max-w-2xl p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{<ExampleText>Name</ExampleText>}</TableHead>
              <TableHead>{<ExampleText>Key</ExampleText>}</TableHead>
              <TableHead>{<ExampleText>Permissions</ExampleText>}</TableHead>
              <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
              <TableHead className="text-right">{<ExampleText>Actions</ExampleText>}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {<ExampleText>{apiKeys.map((key) => (
              <TableRow key={key.name}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{<ExampleText>{key.name}</ExampleText>}</span>
                    <span className="text-muted-foreground text-xs">
                      {<ExampleText>Last used: </ExampleText>}{<ExampleText>{key.lastUsed}</ExampleText>}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                    {key.token}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {<ExampleText>{key.permissions.map((perm) => (
                      <Badge
                        key={perm}
                        variant={permissionVariant[perm] ?? "outline"}
                        size="xs"
                      >
                        {<ExampleText>{perm}</ExampleText>}
                      </Badge>
                    ))}</ExampleText>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={key.statusVariant} size="sm">
                    {<ExampleText>{key.status}</ExampleText>}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="size-7">
                      <CopyIcon className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">{<ExampleText>Copy key</ExampleText>}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7">
                      <RotateCcwIcon className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">{<ExampleText>Regenerate key</ExampleText>}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}</ExampleText>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
