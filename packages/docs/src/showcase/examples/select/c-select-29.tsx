
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

const members = [
  {
    value: "sarah",
    label: "Sarah Chen",
    initials: "SC",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  },
  {
    value: "alex",
    label: "Alex Kim",
    initials: "AK",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
  },
  {
    value: "maria",
    label: "Maria Garcia",
    initials: "MG",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
  },
  {
    value: "james",
    label: "James Wilson",
    initials: "JW",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={members[0].value}>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select member")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>{<ExampleText>Assign to</ExampleText>}</SelectLabel>
            {<ExampleText>{members.map((member) => (
              <ExampleRuntimeConsumer key={member.value} render={({copy: copyExample}) => (<SelectItem key={member.value} value={member.value}>
                <span className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={member.avatar} alt={copyExample(member.label)} />
                    <AvatarFallback className="text-xs">
                      {<ExampleText>{member.initials}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <span>{<ExampleText>{member.label}</ExampleText>}</span>
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
