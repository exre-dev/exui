"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { UsersIcon } from "lucide-react"

import * as React from "react"

import { cn } from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
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


type TeamMember = {
  id: string
  value: string
  label: string
  avatar?: string
  initials: string
  isCurrentUser?: boolean
}

type EmptyMembersOption = {
  id: "no-members"
  value: "none"
  label: string
  searchText: string
}

type MemberSelectionItem = EmptyMembersOption | TeamMember

const noMembersOption: EmptyMembersOption = {
  id: "no-members",
  value: "none",
  label: "No members",
  searchText: "No members clear members remove members empty",
}

const teamMembers: TeamMember[] = [
  {
    id: "member-1",
    value: "alex-morgan",
    label: "Alex Morgan",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "AM",
    isCurrentUser: true,
  },
  {
    id: "member-2",
    value: "emma-carter",
    label: "Emma Carter",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    initials: "EC",
  },
  {
    id: "member-3",
    value: "ryan-mitchell",
    label: "Ryan Mitchell",
    initials: "RM",
  },
  {
    id: "member-4",
    value: "olivia-bennett",
    label: "Olivia Bennett",
    avatar:
      "/examples/reui/photos/efb8484410f45934d5.jpg",
    initials: "OB",
  },
  {
    id: "member-5",
    value: "ethan-brooks",
    label: "Ethan Brooks",
    avatar:
      "/examples/reui/photos/b2bda5d4122155a038.jpg",
    initials: "EB",
  },
  {
    id: "member-6",
    value: "sophia-reed",
    label: "Sophia Reed",
    avatar:
      "/examples/reui/photos/5785adb882eb815215.jpg",
    initials: "SR",
  },
  {
    id: "member-7",
    value: "lucas-hayes",
    label: "Lucas Hayes",
    avatar:
      "/examples/reui/photos/db62bd4fecdc9df2e3.jpg",
    initials: "LH",
  },
  {
    id: "member-8",
    value: "ava-sinclair",
    label: "Ava Sinclair",
    initials: "AS",
  },
  {
    id: "member-9",
    value: "mia-parker",
    label: "Mia Parker",
    avatar:
      "/examples/reui/photos/ccbc5e77aa9f9a4b17.jpg",
    initials: "MP",
  },
  {
    id: "member-10",
    value: "noah-foster",
    label: "Noah Foster",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "NF",
  },
  {
    id: "member-11",
    value: "grace-collins",
    label: "Grace Collins",
    initials: "GC",
  },
  {
    id: "member-12",
    value: "jack-turner",
    label: "Jack Turner",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "JT",
  },
]

const memberSelectionOptions: MemberSelectionItem[] = [
  noMembersOption,
  ...teamMembers,
]

function isNoMembersOption(
  item: MemberSelectionItem
): item is EmptyMembersOption {
  return item.id === noMembersOption.id
}

function isMemberSelectionItemEqual(
  item: MemberSelectionItem,
  value: MemberSelectionItem
) {
  return item.id === value.id
}

function UsersGlyph({ className }: { className?: string }) {
  return (
    <UsersIcon className={cn("size-4 shrink-0", className)} />
  )
}

function MemberAvatar({
  member,
  className,
  fallbackClassName,
}: {
  member: TeamMember
  className?: string
  fallbackClassName?: string
}) {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Avatar className={className}>
      {<ExampleText>{member.avatar ? (
        <AvatarImage src={member.avatar} alt={copyExample(member.label)} />
      ) : null}</ExampleText>}
      <AvatarFallback
        className={cn("text-foreground text-[9px]", fallbackClassName)}
      >
        {<ExampleText>{member.initials}</ExampleText>}
      </AvatarFallback>
    </Avatar>
  )
}

function MembersTriggerSummary({
  selectedMembers,
}: {
  selectedMembers: TeamMember[]
}) {
  const { format: formatExample } = useExampleRuntime()

  if (!selectedMembers.length) {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UsersGlyph className="text-muted-foreground" />
        <span className="truncate">{<ExampleText>Members</ExampleText>}</span>
      </span>
    )
  }

  const visibleMembers = selectedMembers.slice(0, 4)
  const hiddenMemberCount = selectedMembers.length - visibleMembers.length
  const selectedLabel = selectedMembers.map((member) => member.label).join(", ")
  const countLabel =
    selectedMembers.length === 1
      ? formatExample("{count} member", { count: 1 })
      : hiddenMemberCount > 0
        ? formatExample(hiddenMemberCount === 1 ? "+{count} member" : "+{count} members", { count: hiddenMemberCount })
        : formatExample("{count} members", { count: selectedMembers.length })

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="sr-only">{<ExampleText>Selected members: </ExampleText>}{<ExampleText>{selectedLabel}</ExampleText>}</span>
      <AvatarGroup className="-space-x-1">
        {<ExampleText>{visibleMembers.map((member) => (
          <MemberAvatar
            key={member.id}
            member={member}
            className="size-5"
            fallbackClassName="text-[9px]"
          />
        ))}</ExampleText>}
      </AvatarGroup>
      <span className="truncate">{<ExampleText><>{countLabel}</></ExampleText>}</span>
    </span>
  )
}

function MemberListRow({ member }: { member: TeamMember }) {
  return (
    <Item size="xs" className="p-0">
      <ItemMedia>
        <MemberAvatar member={member} className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="gap-1 whitespace-nowrap">
          <span>{<ExampleText>{member.label}</ExampleText>}</span>
          {<ExampleText>{member.isCurrentUser ? (
            <span className="text-muted-foreground font-normal">{<ExampleText>(You)</ExampleText>}</span>
          ) : null}</ExampleText>}
        </ItemTitle>
      </ItemContent>
    </Item>
  )
}

function MemberSelectionRow({ option }: { option: MemberSelectionItem }) {
  if (isNoMembersOption(option)) {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UsersGlyph className="text-muted-foreground" />
        <span className="truncate">{<ExampleText>{option.label}</ExampleText>}</span>
      </span>
    )
  }

  return <MemberListRow member={option} />
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [members, setMembers] = React.useState<TeamMember[]>(
    teamMembers.slice(0, 5)
  )

  function handleMembersChange(nextMembers: MemberSelectionItem[]) {
    if (nextMembers.some(isNoMembersOption)) {
      setMembers([])
      return
    }

    setMembers(
      nextMembers.filter(
        (member): member is TeamMember => !isNoMembersOption(member)
      )
    )
  }

  return (
    <Field className="max-w-xs">
      <Combobox
        multiple
        items={memberSelectionOptions}
        value={members}
        onValueChange={handleMembersChange}
        itemToStringValue={(item: MemberSelectionItem) =>
          isNoMembersOption(item) ? item.searchText : item.label
        }
        isItemEqualToValue={isMemberSelectionItemEqual}
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
          <ComboboxValue placeholder={copyExample("Members")}>
            {(selectedMembers: TeamMember[]) => (
              <MembersTriggerSummary selectedMembers={selectedMembers ?? []} />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder={copyExample("Select members")}
            className="mb-1"
          />
          <ComboboxEmpty>{<ExampleText>No members found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noMembersOption}>
              <MemberSelectionRow option={noMembersOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {<ExampleText>{teamMembers.map((member) => (
              <ComboboxItem key={member.id} value={member}>
                <MemberSelectionRow option={member} />
              </ComboboxItem>
            ))}</ExampleText>}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
