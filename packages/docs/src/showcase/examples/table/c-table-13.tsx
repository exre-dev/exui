
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileSpreadsheetIcon, FileTextIcon, FolderIcon, ImageIcon, PenToolIcon } from "lucide-react"

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


const files = [
  {
    name: "Q4 Financial Report.pdf",
    icon: (
      <FileTextIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    ),
    size: "2.4 MB",
    owner: "Sarah Chen",
    ownerAvatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    sharing: "Team",
    sharingVariant: "info-light" as const,
    modified: "2 hours ago",
  },
  {
    name: "Brand Guidelines",
    icon: (
      <FolderIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    ),
    size: "—",
    owner: "Emily Park",
    ownerAvatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    sharing: "Public",
    sharingVariant: "success-light" as const,
    modified: "1 day ago",
  },
  {
    name: "Product Roadmap 2025.xlsx",
    icon: (
      <FileSpreadsheetIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    ),
    size: "856 KB",
    owner: "Marcus Johnson",
    ownerAvatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    sharing: "Private",
    sharingVariant: "outline" as const,
    modified: "3 days ago",
  },
  {
    name: "App Screenshots",
    icon: (
      <ImageIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    ),
    size: "48.2 MB",
    owner: "David Kim",
    ownerAvatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    sharing: "Team",
    sharingVariant: "info-light" as const,
    modified: "1 week ago",
  },
  {
    name: "Architecture Diagram.fig",
    icon: (
      <PenToolIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    ),
    size: "12.8 MB",
    owner: "Sofia Davis",
    ownerAvatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    sharing: "Restricted",
    sharingVariant: "warning-light" as const,
    modified: "2 weeks ago",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{<ExampleText>Name</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Owner</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Sharing</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Size</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Modified</ExampleText>}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{files.map((file) => (
            <ExampleRuntimeConsumer key={file.name} render={({copy: copyExample}) => (<TableRow key={file.name}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {<ExampleText>{file.icon}</ExampleText>}
                  <span className="text-sm font-medium">{<ExampleText>{file.name}</ExampleText>}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage src={file.ownerAvatar} alt={copyExample(file.owner)} />
                    <AvatarFallback>
                      {<ExampleText>{file.owner
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{<ExampleText>{file.owner}</ExampleText>}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={file.sharingVariant} size="sm">
                  {<ExampleText>{file.sharing}</ExampleText>}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {<ExampleText>{file.size}</ExampleText>}
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {<ExampleText>{file.modified}</ExampleText>}
              </TableCell>
            </TableRow>)} />
          ))}</ExampleText>}
        </TableBody>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
