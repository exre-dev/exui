"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Fragment } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@exre/exui"

const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    initials: "EW",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    initials: "DK",
  },
  {
    id: "6",
    name: "Aron Thompson",
    email: "lisa@example.com",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    initials: "LT",
  },
  {
    id: "7",
    name: "James Brown",
    email: "james@example.com",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    initials: "JB",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria@example.com",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    initials: "MG",
  },
  {
    id: "9",
    name: "Nick Johnson",
    email: "nick@example.com",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    initials: "NJ",
  },
  {
    id: "10",
    name: "Liam Thompson",
    email: "liam@example.com",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    initials: "LT",
  },
]

const members = users.map((user, index) => ({
  ...user,
  position: [
    "Software Engineer",
    "Product Manager",
    "UX Designer",
    "Technical Lead",
    "CTO",
  ][index % 5],
}))

  function OriginalPattern() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="max-w-xs">
      <Combobox
        multiple
        items={members}
        itemToStringValue={(member: (typeof members)[number]) => member.name}
        defaultValue={[members[0], members[1]]}
      >
        <ComboboxChips
          ref={anchor}
          className="has-data-[slot=combobox-chip]:pl-1"
        >
          <ComboboxValue>
            {(selectedMembers: (typeof members)[number][]) => (
              <ExampleRuntimeConsumer render={({copy: copyExample}) => (<Fragment>
                {<ExampleText>{selectedMembers.map((member) => (
                  <ExampleRuntimeConsumer key={member.id} render={({copy: copyExample}) => (<ComboboxChip
                    key={member.id}
                    showRemove={true}
                    className="rounded-full gap-1.5"
                  >
                    <Avatar className="size-4">
                      <AvatarImage src={member.avatar} alt={copyExample(member.name)} />
                      <AvatarFallback className="text-[8px]">
                        {<ExampleText>{member.initials}</ExampleText>}
                      </AvatarFallback>
                    </Avatar>
                    {<ExampleText>{member.name}</ExampleText>}
                  </ComboboxChip>)} />
                ))}</ExampleText>}
                <ComboboxChipsInput placeholder={copyExample("Add members...")} />
              </Fragment>)} />
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent
          anchor={anchor}
          className="max-w-(--anchor-width) min-w-(--anchor-width)"
        >
          <ComboboxEmpty>{<ExampleText>No members found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            {(member) => (
              <ExampleRuntimeConsumer key={member.id} render={({copy: copyExample}) => (<ComboboxItem key={member.id} value={member}>
                <Item size="xs" className="p-0">
                  <Avatar className="size-6">
                    <AvatarImage src={member.avatar} alt={copyExample(member.name)} />
                    <AvatarFallback>{<ExampleText>{member.initials}</ExampleText>}</AvatarFallback>
                  </Avatar>
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">
                      {<ExampleText>{member.name}</ExampleText>}
                    </ItemTitle>
                    <ItemDescription>{<ExampleText>{member.position}</ExampleText>}</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>)} />
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
