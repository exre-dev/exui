
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent } from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"

const tasks = [
  {
    id: "1",
    name: "Design homepage",
    status: "Completed",
    statusColor: "bg-green-500/10 text-green-700",
  },
  {
    id: "2",
    name: "Implement API",
    status: "In Progress",
    statusColor: "bg-yellow-500/10 text-yellow-700",
  },
  {
    id: "3",
    name: "Write tests",
    status: "Pending",
    statusColor: "bg-gray-500/10 text-gray-700",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{<ExampleText>Task</ExampleText>}</TableHead>
                <TableHead className="text-right">{<ExampleText>Status</ExampleText>}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {<ExampleText>{tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{<ExampleText>{task.name}</ExampleText>}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${task.statusColor}`}
                    >
                      {<ExampleText>{task.status}</ExampleText>}
                    </span>
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
