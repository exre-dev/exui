"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { UserIcon } from "lucide-react"

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


type NoLeadOption = {
  type: "none"
  value: "none"
  label: "No lead"
}

type TeamMember = {
  type: "member"
  id: string
  value: string
  label: string
  avatar: string
  initials: string
  isCurrentUser?: boolean
}

type LeadOption = NoLeadOption | TeamMember

const noLeadOption: NoLeadOption = {
  type: "none",
  value: "none",
  label: "No lead",
}

const teamMembers: TeamMember[] = [
  {
    type: "member",
    id: "member-1",
    value: "shuhrat-saipov",
    label: "Shuhrat Saipov",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "SS",
    isCurrentUser: true,
  },
  {
    type: "member",
    id: "member-2",
    value: "nadia-karimova",
    label: "Nadia Karimova",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    initials: "NK",
  },
  {
    type: "member",
    id: "member-3",
    value: "bekzod-rakhimov",
    label: "Bekzod Rakhimov",
    avatar:
      "/examples/reui/photos/c6064767ae24420606.jpg",
    initials: "BR",
  },
  {
    type: "member",
    id: "member-4",
    value: "lina-bauer",
    label: "Lina Bauer",
    avatar:
      "/examples/reui/photos/efb8484410f45934d5.jpg",
    initials: "LB",
  },
  {
    type: "member",
    id: "member-5",
    value: "omar-haddad",
    label: "Omar Haddad",
    avatar:
      "/examples/reui/photos/b2bda5d4122155a038.jpg",
    initials: "OH",
  },
  {
    type: "member",
    id: "member-6",
    value: "priya-nand",
    label: "Priya Nand",
    avatar:
      "/examples/reui/photos/5785adb882eb815215.jpg",
    initials: "PN",
  },
  {
    type: "member",
    id: "member-7",
    value: "kenji-watan",
    label: "Kenji Watan",
    avatar:
      "/examples/reui/photos/db62bd4fecdc9df2e3.jpg",
    initials: "KW",
  },
  {
    type: "member",
    id: "member-8",
    value: "ava-sinclair",
    label: "Ava Sinclair",
    avatar:
      "/examples/reui/photos/7da2efac125ddc6e00.jpg",
    initials: "AS",
  },
  {
    type: "member",
    id: "member-9",
    value: "nia-okafor",
    label: "Nia Okafor",
    avatar:
      "/examples/reui/photos/ccbc5e77aa9f9a4b17.jpg",
    initials: "NO",
  },
  {
    type: "member",
    id: "member-10",
    value: "matteo-sosa",
    label: "Matteo Sosa",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "MS",
  },
  {
    type: "member",
    id: "member-11",
    value: "salma-rahman",
    label: "Salma Rahman",
    avatar:
      "/examples/reui/photos/36d650ee9968995d8e.jpg",
    initials: "SR",
  },
  {
    type: "member",
    id: "member-12",
    value: "jonas-meyer",
    label: "Jonas Meyer",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    initials: "JM",
  },
]

const leadOptions: LeadOption[] = [noLeadOption, ...teamMembers]

function UserGlyph({ className }: { className?: string }) {
  return (
    <UserIcon className={cn("size-4 shrink-0", className)} />
  )
}

function LeadTriggerLabel({ option }: { option: LeadOption }) {
  const { copy: copyExample } = useExampleRuntime()

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

function LeadListRow({ option }: { option: LeadOption }) {
  const { copy: copyExample } = useExampleRuntime()

  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UserGlyph className="text-muted-foreground" />
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

  const [lead, setLead] = React.useState<LeadOption | null>(noLeadOption)

  return (
    <Field className="max-w-xs">
      <Combobox
        items={leadOptions}
        value={lead}
        onValueChange={setLead}
        itemToStringValue={(item: LeadOption) => item.label}
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
          <ComboboxValue placeholder={copyExample("No lead")}>
            {(selectedLead: LeadOption | null) =>
              selectedLead ? (
                <LeadTriggerLabel option={selectedLead} />
              ) : (
                <span className="text-muted-foreground">{<ExampleText>No lead</ExampleText>}</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder={copyExample("Select lead")}
            className="mb-1"
          />
          <ComboboxEmpty>{<ExampleText>No team members found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noLeadOption}>
              <LeadListRow option={noLeadOption} />
            </ComboboxItem>

            <ComboboxGroup items={teamMembers}>
              <ComboboxLabel>{<ExampleText>Team members</ExampleText>}</ComboboxLabel>
              <ComboboxCollection>
                {(member: TeamMember) => (
                  <ComboboxItem key={member.id} value={member}>
                    <LeadListRow option={member} />
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
