"use client"

import { ExampleSidebarProvider, ExampleSidebar } from "../_shared/surface-runtime"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookOpenIcon, BugIcon, EyeIcon, GitPullRequestArrowIcon, ListChecksIcon, MessageSquareIcon, MoreHorizontalIcon, PaperclipIcon, RocketIcon, UserPlusIcon } from "lucide-react"

import type { ReactNode } from "react"
import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@exre/exui"


interface Assignee {
  id: string
  name: string
  initials: string
  avatar: string
}

interface LinkedWork {
  id: string
  label: string
  count: number
  icon: ReactNode
}

interface ActivityEntry {
  id: string
  label: string
  time: string
  icon: ReactNode
}

// Demo data only: every link is `href="#"` and the faces come from the fixed
// set of photo ids this registry already ships, so nothing here points at a
// real person or an invented endpoint.
const ASSIGNEES: Assignee[] = [
  {
    id: "mara",
    name: "Mara Ellison",
    initials: "ME",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
  },
  {
    id: "tobias",
    name: "Tobias Reiner",
    initials: "TR",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
  },
  {
    id: "priya",
    name: "Priya Raman",
    initials: "PR",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
  },
]

// Icons are JSX nodes carrying a STATIC name per library, which is the shape
// `shadcn add` rewrites when it swaps the icon package for the one the
// installing project already uses.
const LINKED: LinkedWork[] = [
  {
    id: "subtasks",
    label: "Sub-tasks",
    count: 6,
    icon: (
      <ListChecksIcon aria-hidden="true" />
    ),
  },
  {
    id: "pull-requests",
    label: "Pull requests",
    count: 2,
    icon: (
      <GitPullRequestArrowIcon aria-hidden="true" />
    ),
  },
  {
    id: "incidents",
    label: "Incidents",
    count: 1,
    icon: (
      <BugIcon aria-hidden="true" />
    ),
  },
  {
    id: "docs",
    label: "Docs",
    count: 3,
    icon: (
      <BookOpenIcon aria-hidden="true" />
    ),
  },
]

const ACTIVITY: ActivityEntry[] = [
  {
    id: "review",
    label: "Priya requested changes",
    time: "2h",
    icon: (
      <MessageSquareIcon aria-hidden="true" />
    ),
  },
  {
    id: "deploy",
    label: "Deployed to staging",
    time: "5h",
    icon: (
      <RocketIcon aria-hidden="true" />
    ),
  },
  {
    id: "assigned",
    label: "Mara took ownership",
    time: "Yesterday",
    icon: (
      <UserPlusIcon aria-hidden="true" />
    ),
  },
]

// One person, with a row menu. `showOnHover` only hides the action from `md`
// up, so on a touch-width frame it stays visible, which is what makes the row
// usable without a hover state at all.
//
// The menu opens to the LEFT because the panel is flush against the right edge
// of the frame and a right-side popup would have nowhere to go.
function AssigneeRow({ assignee }: { assignee: Assignee }) {
  const {format: formatExample,  copy: copyExample } = useExampleRuntime()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a onClick={(event) => event.preventDefault()} href="#">
          <Avatar size="sm">
            <AvatarImage src={assignee.avatar} alt={copyExample("")} />
            <AvatarFallback>{<ExampleText>{assignee.initials}</ExampleText>}</AvatarFallback>
          </Avatar>
          <span>{<ExampleText>{assignee.name}</ExampleText>}</span>
        </a>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            showOnHover
            aria-label={(formatExample("Actions for {name}", { name: assignee.name }))}
          >
            <MoreHorizontalIcon aria-hidden="true" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>{<ExampleText>Make owner</ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>{<ExampleText>Notify</ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">{<ExampleText>Remove</ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

// The inspector itself. SidebarMenuBadge stays a SIBLING of the button rather
// than a child: `asChild` puts every child inside the anchor, so a count
// nested there would join the link's hit target and its accessible name.
//
// In the activity rows the timestamp is the last span, and the menu button
// applies `truncate` to whichever span comes last. Giving the timestamp
// `shrink-0` and the label `min-w-0 flex-1` puts the ellipsis back on the text
// that actually needs one.
//
// `absolute h-full` is what keeps the panel inside the example. This is the
// desktop branch, whose container ships `fixed inset-y-0 h-svh`, and a fixed
// box neither reads the provider's height nor is clipped by its
// overflow-hidden, so it would be window tall against the right edge of the
// page. The className lands on that container and tailwind-merge swaps both
// groups; the provider's `relative` is what it then measures against, and its
// overflow-hidden is what finally clips the off-canvas slide to the example.
function Inspector() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ExampleSidebar
      side="right"
      variant="floating"
      collapsible="offcanvas"
      className="absolute h-full"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{<ExampleText>Details</ExampleText>}</span>
          <Badge variant="warning-light" className="ml-auto shrink-0">
            {<ExampleText>In review </ExampleText>}</Badge>
        </div>
      </SidebarHeader>

      <SidebarContent role="complementary" aria-label={copyExample("Issue details")}>
        <SidebarGroup>
          <SidebarGroupLabel>{<ExampleText>Assignees</ExampleText>}</SidebarGroupLabel>
          <SidebarGroupAction type="button">
            <UserPlusIcon aria-hidden="true" />
            <span className="sr-only">{<ExampleText>Add assignee</ExampleText>}</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {<ExampleText>{ASSIGNEES.map((assignee) => (
                <AssigneeRow key={assignee.id} assignee={assignee} />
              ))}</ExampleText>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{<ExampleText>Linked work</ExampleText>}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {<ExampleText>{LINKED.map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton asChild>
                    <a onClick={(event) => event.preventDefault()} href="#">
                      {<ExampleText>{entry.icon}</ExampleText>}
                      <span>{<ExampleText>{entry.label}</ExampleText>}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{<ExampleText>{entry.count}</ExampleText>}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}</ExampleText>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{<ExampleText>Activity</ExampleText>}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {<ExampleText>{ACTIVITY.map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton asChild>
                    <a onClick={(event) => event.preventDefault()} href="#">
                      {<ExampleText>{entry.icon}</ExampleText>}
                      <span className="min-w-0 flex-1 truncate">
                        {<ExampleText>{entry.label}</ExampleText>}
                      </span>
                      <span className="text-sidebar-foreground/60 shrink-0 text-xs">
                        {<ExampleText>{entry.time}</ExampleText>}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}</ExampleText>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button variant="outline" size="sm" className="w-full">
          {<ExampleText>Open in board </ExampleText>}</Button>
      </SidebarFooter>
    </ExampleSidebar>
  )
}

// The record the panel describes. `min-w-0` matters here: the inset is
// `w-full flex-1`, so without it a long title would grow the flex item and
// shove the inspector off the frame instead of wrapping.
function IssueView() {
  return (
    <SidebarInset className="min-w-0 overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
          {<ExampleText>ENG-2481 </ExampleText>}</span>
        <Button variant="outline" size="sm" className="ml-auto">
          {<ExampleText>Share </ExampleText>}</Button>
        <SidebarTrigger />
      </header>

      <div className="min-w-0 flex-1 overflow-auto px-4 py-4">
        <h1 className="text-base font-medium">
          {<ExampleText>Retry failed webhook deliveries </ExampleText>}</h1>
        <p className="text-muted-foreground mt-2 max-w-prose text-sm">
          {<ExampleText>Deliveries that fail on a 5xx are dropped after the first attempt, so a customer whose endpoint restarts during a deploy never sees the event again. </ExampleText>}</p>
        <p className="text-muted-foreground mt-2 max-w-prose text-sm">
          {<ExampleText>Queue the failures and retry them with a backoff, then surface the attempt count on the delivery record. </ExampleText>}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm">
            <MessageSquareIcon aria-hidden="true" />
            {<ExampleText>Comment </ExampleText>}</Button>
          <Button variant="ghost" size="sm">
            <PaperclipIcon aria-hidden="true" />
            {<ExampleText>Attach </ExampleText>}</Button>
          <Button variant="ghost" size="sm">
            <EyeIcon aria-hidden="true" />
            {<ExampleText>Watch </ExampleText>}</Button>
        </div>
      </div>
    </SidebarInset>
  )
}

// The same parts doing a second job: a right-hand inspector beside the record
// it describes, rather than a navigation panel.
//
// The children are in INSET-FIRST order, and that is what puts the panel on
// the right. `side="right"` only decides which edge the fixed container pins
// to; the space it occupies comes from a spacer rendered in flex order, so a
// Sidebar written before the inset would reserve its column on the left.
//
// `variant="floating"` draws its own chrome, a padded container with a ring
// and a radius that every style resolves for itself, so there is nothing here
// to hand-roll a border or a corner for.
//
// `collapsible="offcanvas"` means the panel can be entirely gone, so
// SidebarTrigger in the inset header is what brings it back. SidebarRail is
// left out rather than unavailable: it ships `tabIndex={-1}` and `sm:flex`, so
// it would add a second control for the one toggle that only a mouse on a wide
// frame can reach. Under 768px shadcn's Sidebar swaps to a Sheet and that same
// trigger opens it.
//
// `min-h-0` beside the height is load-bearing. SidebarProvider ships
// `min-h-svh`, and tailwind-merge only drops it when another `min-h-*` arrives
// with it, so without the pair the example is viewport tall inside its frame.
  function OriginalPattern() {
  return (
    <ExampleSidebarProvider className="relative h-dvh min-h-0 w-full overflow-hidden">
      <IssueView />
      <Inspector />
    </ExampleSidebarProvider>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
