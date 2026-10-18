"use client"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SendIcon, UserIcon } from "lucide-react"

import * as React from "react"

import { cn } from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


type NoAssigneeOption = {
  type: "none"
  id: "no-assignee"
  value: "none"
  label: string
  searchText: string
}

type TeamMember = {
  type: "member"
  id: string
  value: string
  label: string
  avatar: string
  initials: string
  isCurrentUser?: boolean
  searchText: string
}

type InviteOption = {
  type: "invite"
  id: "invite-user"
  value: "invite"
  label: string
  searchText: string
}

type AssigneeSelectionItem = NoAssigneeOption | TeamMember | InviteOption

const noAssigneeOption: NoAssigneeOption = {
  type: "none",
  id: "no-assignee",
  value: "none",
  label: "No assignee",
  searchText: "No assignee unassigned clear assignee remove assignee",
}

const teamMembers: TeamMember[] = [
  {
    type: "member",
    id: "member-1",
    value: "alex-morgan",
    label: "Alex Morgan",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "AM",
    isCurrentUser: true,
    searchText: "Alex Morgan current user owner",
  },
  {
    type: "member",
    id: "member-2",
    value: "emma-carter",
    label: "Emma Carter",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    initials: "EC",
    searchText: "Emma Carter product design",
  },
  {
    type: "member",
    id: "member-3",
    value: "ryan-mitchell",
    label: "Ryan Mitchell",
    avatar:
      "/examples/reui/photos/c6064767ae24420606.jpg",
    initials: "RM",
    searchText: "Ryan Mitchell engineering backend",
  },
  {
    type: "member",
    id: "member-4",
    value: "olivia-bennett",
    label: "Olivia Bennett",
    avatar:
      "/examples/reui/photos/efb8484410f45934d5.jpg",
    initials: "OB",
    searchText: "Olivia Bennett growth marketing",
  },
  {
    type: "member",
    id: "member-5",
    value: "ethan-brooks",
    label: "Ethan Brooks",
    avatar:
      "/examples/reui/photos/b2bda5d4122155a038.jpg",
    initials: "EB",
    searchText: "Ethan Brooks operations",
  },
] as const

const inviteOption: InviteOption = {
  type: "invite",
  id: "invite-user",
  value: "invite",
  label: "Invite...",
  searchText: "Invite new user teammate member collaborator",
}

const assigneeOptions: AssigneeSelectionItem[] = [
  noAssigneeOption,
  ...teamMembers,
  inviteOption,
]

function UserGlyph({ className }: { className?: string }) {
  return (
    <UserIcon className={cn("size-4 shrink-0", className)} />
  )
}

function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <SendIcon className={cn("size-4 shrink-0", className)} />
  )
}

function AssigneeTriggerLabel({
  option,
  placeholder,
}: {
  option: NoAssigneeOption | TeamMember | null
  placeholder: string
}) {
  const { copy: copyExample } = useExampleRuntime()

  if (!option) {
    return <span className="text-muted-foreground truncate">{<ExampleText>{placeholder}</ExampleText>}</span>
  }

  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UserGlyph className="text-muted-foreground" />
        <span className="truncate">{<ExampleText>{option.label}</ExampleText>}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-5">
        <AvatarImage src={option.avatar} alt={copyExample(option.label)} />
        <AvatarFallback className="text-[9px]">
          {<ExampleText>{option.initials}</ExampleText>}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">{<ExampleText>{option.label}</ExampleText>}</span>
    </span>
  )
}

function AssigneeListRow({
  option,
}: {
  option: NoAssigneeOption | TeamMember | InviteOption
}) {
  const { copy: copyExample } = useExampleRuntime()

  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UserGlyph className="text-muted-foreground" />
        <span className="truncate">{<ExampleText>{option.label}</ExampleText>}</span>
      </span>
    )
  }

  if (option.type === "invite") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <PaperPlaneIcon className="text-muted-foreground" />
        <span className="truncate">{<ExampleText>{option.label}</ExampleText>}</span>
      </span>
    )
  }

  return (
    <Item size="xs" className="p-0">
      <ItemMedia>
        <Avatar className="size-5">
          <AvatarImage src={option.avatar} alt={copyExample(option.label)} />
          <AvatarFallback className="text-[9px]">
            {<ExampleText>{option.initials}</ExampleText>}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="gap-1 whitespace-nowrap">
          <span>{<ExampleText>{option.label}</ExampleText>}</span>
          {<ExampleText>{option.isCurrentUser ? (
            <span className="text-muted-foreground font-normal">{<ExampleText>(You)</ExampleText>}</span>
          ) : null}</ExampleText>}
        </ItemTitle>
      </ItemContent>
    </Item>
  )
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [assignee, setAssignee] = React.useState<TeamMember | null>(null)
  const selectedAssignee = assignee ?? noAssigneeOption

  function handleAssigneeChange(nextAssignee: AssigneeSelectionItem | null) {
    if (!nextAssignee || nextAssignee.type === "invite") {
      return
    }

    setAssignee(nextAssignee.type === "member" ? nextAssignee : null)
  }

  return (
    <Field className="max-w-xs">
      <Combobox
        items={assigneeOptions}
        value={selectedAssignee}
        onValueChange={handleAssigneeChange}
        itemToStringValue={(item: AssigneeSelectionItem) => item.searchText}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          <ComboboxValue placeholder={copyExample("No assignee")}>
            {(selectedAssignee: NoAssigneeOption | TeamMember | null) => (
              <ExampleRuntimeConsumer render={({copy: copyExample}) => (<AssigneeTriggerLabel
                option={selectedAssignee}
                placeholder={copyExample("No assignee")}
              />)} />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder={copyExample("Select assignee")}
            className="mb-1"
          />
          <ComboboxEmpty>{<ExampleText>No assignees found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noAssigneeOption}>
              <AssigneeListRow option={noAssigneeOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            <ComboboxGroup items={teamMembers}>
              <ComboboxLabel>{<ExampleText>Team members</ExampleText>}</ComboboxLabel>
              <ComboboxCollection>
                {(member: TeamMember) => (
                  <ComboboxItem key={member.id} value={member}>
                    <AssigneeListRow option={member} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>

            <ComboboxSeparator />

            <ComboboxGroup items={[inviteOption]}>
              <ComboboxLabel>{<ExampleText>New user</ExampleText>}</ComboboxLabel>
              <ComboboxCollection>
                {(item: InviteOption) => (
                  <ComboboxItem key={item.id} value={item}>
                    <AssigneeListRow option={item} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
