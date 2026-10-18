
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
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

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const mappedUsers = users.map((user) => ({
    value: user.id,
    label: user.name,
    avatar: user.avatar,
    initials: user.initials,
  }))

  return (
    <Field className="max-w-xs">
      <Select defaultValue={mappedUsers[2].value}>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select a user")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>{<ExampleText>Select a user</ExampleText>}</SelectLabel>
            {<ExampleText>{mappedUsers.map((user) => (
              <ExampleRuntimeConsumer key={user.value} render={({copy: copyExample}) => (<SelectItem key={user.value} value={user.value}>
                <span className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={user.avatar} alt={copyExample(user.label)} />
                    <AvatarFallback>{<ExampleText>{user.initials}</ExampleText>}</AvatarFallback>
                  </Avatar>
                  <span>{<ExampleText>{user.label}</ExampleText>}</span>
                </span>
              </SelectItem>)} />
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
