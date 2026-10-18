
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

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


const leaders = [
  {
    rank: 1,
    name: "Sarah Chen",
    handle: "@sarahchen",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    score: 12840,
    change: "+320",
    changeUp: true,
    level: "Diamond",
    levelVariant: "info" as const,
  },
  {
    rank: 2,
    name: "Marcus Johnson",
    handle: "@marcusj",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    score: 11250,
    change: "+180",
    changeUp: true,
    level: "Platinum",
    levelVariant: "default" as const,
  },
  {
    rank: 3,
    name: "Emily Park",
    handle: "@emilyp",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    score: 10890,
    change: "-45",
    changeUp: false,
    level: "Platinum",
    levelVariant: "default" as const,
  },
  {
    rank: 4,
    name: "David Kim",
    handle: "@davidk",
    avatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    score: 9420,
    change: "+520",
    changeUp: true,
    level: "Gold",
    levelVariant: "warning" as const,
  },
  {
    rank: 5,
    name: "Sofia Davis",
    handle: "@sofiad",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    score: 8750,
    change: "+90",
    changeUp: true,
    level: "Gold",
    levelVariant: "warning" as const,
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>{<ExampleText>Player</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Level</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Score</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Change</ExampleText>}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{leaders.map((leader) => (
            <ExampleRuntimeConsumer key={leader.rank} render={({copy: copyExample}) => (<TableRow key={leader.rank}>
              <TableCell className="text-center text-sm font-bold">
                {<ExampleText>{leader.rank}</ExampleText>}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={leader.avatar} alt={copyExample(leader.name)} />
                    <AvatarFallback>
                      {<ExampleText>{leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{<ExampleText>{leader.name}</ExampleText>}</span>
                    <span className="text-muted-foreground text-xs">
                      {<ExampleText>{leader.handle}</ExampleText>}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={leader.levelVariant} size="sm">
                  {<ExampleText>{leader.level}</ExampleText>}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm font-medium">
                {<ExampleText>{leader.score.toLocaleString()}</ExampleText>}
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-0.5 text-sm">
                  {<ExampleText>{leader.changeUp ? (
                    <TrendingUpIcon aria-hidden="true" className="text-success size-3.5" />
                  ) : (
                    <TrendingDownIcon aria-hidden="true" className="text-destructive size-3.5" />
                  )}</ExampleText>}
                  <span
                    className={
                      leader.changeUp ? "text-success" : "text-destructive"
                    }
                  >
                    {<ExampleText>{leader.change}</ExampleText>}
                  </span>
                </span>
              </TableCell>
            </TableRow>)} />
          ))}</ExampleText>}
        </TableBody>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
