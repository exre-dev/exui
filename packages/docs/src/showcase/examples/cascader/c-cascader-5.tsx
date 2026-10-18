"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Badge, type BadgeProps } from "@exre/exui"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@exre/exui"
import { CascaderItems } from "@exre/exui"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@exre/exui"
import type { CascaderNode } from "@exre/exui"

import { cn } from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"

/**
 * One ladder, not seven vocabularies.
 *
 * A role chip whose colour changes has to be colouring ONE axis, so every team
 * names its people on the same six rungs. Team-local labels like "Tier 2" or
 * "Enterprise" would put a segment on a seniority scale and the colour would
 * stop meaning anything.
 */
type Role = "Director" | "Lead" | "Principal" | "Staff" | "Senior" | "Mid"

interface Member {
  avatar: string
  role: Role
  status?: "online" | "away"
}

/**
 * Rung to chip, in one table so the colour cannot drift from the word.
 *
 * Four bands over six rungs: who owns the call (`primary`), who sets the
 * technical direction (`info`), who ships it unattended (`success`), and who
 * still wants a reviewer on the way out (`warning`). Bands, not one variant per
 * role - a scale with six colours is a palette, not a signal.
 *
 * `pin` repeats the variant's own text colour with `!`. A highlighted row
 * repaints every descendant with `text-accent-foreground`, which would grey the
 * chip out under the pointer, so each colour is pinned back the way the
 * primitive pins its own accent count.
 */
const ROLE_BADGE: Record<
  Role,
  { variant: BadgeProps["variant"]; pin: string }
> = {
  Director: { variant: "primary-outline", pin: "text-primary!" },
  Lead: { variant: "primary-outline", pin: "text-primary!" },
  Principal: { variant: "info-outline", pin: "text-info-foreground!" },
  Staff: { variant: "info-outline", pin: "text-info-foreground!" },
  Senior: { variant: "success-outline", pin: "text-success-foreground!" },
  Mid: { variant: "warning-outline", pin: "text-warning-foreground!" },
}

/**
 * The role chip. Plain `outline` is `bg-transparent` in light mode, so the
 * row's highlight washed straight through it. The semantic outline variants are
 * `bg-background` - opaque against the highlight - and they carry the rung in
 * their text colour instead of spending a second element on it.
 *
 * `shrink-0` is restated here rather than left to `badgeVariants`, which
 * already carries it. Now that the chip sits inline after the name it is the
 * class that decides WHICH of the two words gives way in a narrow panel, so it
 * is spelled out on the element whose placement depends on it: the name
 * shortens to "Owen Fitzger..." and "Principal" is never clipped to "Princi".
 */
function RoleBadge({ role }: { role: Role }) {
  const { variant, pin } = ROLE_BADGE[role]
  return (
    <Badge variant={variant} className={cn("shrink-0", pin)}>
      {<ExampleText>{role}</ExampleText>}
    </Badge>
  )
}

/** Initials are the AvatarImage fallback, not the avatar itself. */
function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

/**
 * One avatar for both surfaces. The panel row and the trigger show the same
 * member, so they render the same element at two sizes instead of two
 * hand-rolled circles that drift apart. `AvatarFallback` ships at `text-sm`,
 * which overflows anything under 28px, so the caller passes the text size down
 * with the box size rather than letting one change without the other.
 */
function MemberAvatar({
  member,
  className,
  fallbackClassName,
}: {
  member: CascaderNode<Member>
  className: string
  fallbackClassName: string
}) {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Avatar className={className}>
      <AvatarImage src={member.data?.avatar} alt={copyExample(member.label)} />
      <AvatarFallback className={fallbackClassName}>
        {<ExampleText>{initials(member.label)}</ExampleText>}
      </AvatarFallback>
    </Avatar>
  )
}

const teams: CascaderNode<Member>[] = [
  {
    value: "engineering",
    label: "Engineering",
    children: [
      {
        value: "eng.ada",
        label: "Ada Whitfield",
        data: {
          avatar:
            "/examples/reui/photos/e93553df2422635515.jpg",
          role: "Staff",
          status: "online",
        },
      },
      {
        value: "eng.marcus",
        label: "Marcus Bell",
        data: {
          avatar:
            "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
          role: "Senior",
          status: "away",
        },
      },
      {
        value: "eng.priya",
        label: "Priya Raman",
        data: {
          avatar:
            "/examples/reui/photos/4349381d8a8476edbc.jpg",
          role: "Lead",
          status: "online",
        },
      },
    ],
  },
  {
    value: "design",
    label: "Design",
    children: [
      {
        value: "design.june",
        label: "June Okafor",
        data: {
          avatar:
            "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
          role: "Principal",
          status: "online",
        },
      },
      {
        value: "design.theo",
        label: "Theo Lindqvist",
        data: {
          avatar:
            "/examples/reui/photos/973d47055c51440af7.jpg",
          role: "Mid",
          status: "away",
        },
      },
    ],
  },
  {
    value: "product",
    label: "Product",
    children: [
      {
        value: "product.samira",
        label: "Samira Haddad",
        data: {
          avatar:
            "/examples/reui/photos/df73db9a2c25069a42.jpg",
          role: "Director",
          status: "online",
        },
      },
      {
        value: "product.owen",
        label: "Owen Fitzgerald",
        data: {
          avatar:
            "/examples/reui/photos/c75592a667f30cfd44.jpg",
          role: "Senior",
          status: "away",
        },
      },
    ],
  },
  {
    value: "marketing",
    label: "Marketing",
    children: [
      {
        value: "marketing.lena",
        label: "Lena Vasquez",
        data: {
          avatar:
            "/examples/reui/photos/067c566cd567259bb9.jpg",
          role: "Lead",
          status: "online",
        },
      },
      {
        value: "marketing.dmitri",
        label: "Dmitri Sokolov",
        data: {
          avatar:
            "/examples/reui/photos/f1d4253436738aaf8f.jpg",
          role: "Mid",
          status: "away",
        },
      },
    ],
  },
  {
    value: "sales",
    label: "Sales",
    children: [
      {
        value: "sales.nadia",
        label: "Nadia Petrova",
        data: {
          avatar:
            "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
          role: "Lead",
          status: "online",
        },
      },
      {
        value: "sales.tom",
        label: "Tom Ashworth",
        data: {
          avatar:
            "/examples/reui/photos/e93553df2422635515.jpg",
          role: "Mid",
          status: "away",
        },
      },
    ],
  },
  {
    value: "support",
    label: "Support",
    children: [
      {
        value: "support.hana",
        label: "Hana Yoshida",
        data: {
          avatar:
            "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
          role: "Senior",
          status: "online",
        },
      },
      {
        value: "support.felix",
        label: "Felix Nkemelu",
        data: {
          avatar:
            "/examples/reui/photos/973d47055c51440af7.jpg",
          role: "Mid",
          status: "away",
        },
      },
    ],
  },
  {
    value: "data",
    label: "Data",
    children: [
      {
        value: "data.ines",
        label: "Ines Moreau",
        data: {
          avatar:
            "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
          role: "Senior",
          status: "online",
        },
      },
      {
        value: "data.raj",
        label: "Raj Bhatia",
        data: {
          avatar:
            "/examples/reui/photos/4349381d8a8476edbc.jpg",
          role: "Staff",
          status: "away",
        },
      },
    ],
  },
]

/**
 * Flat value to member lookup. `CascaderValue` hands its render function the
 * resolved node typed as `CascaderNode<unknown>`, so the payload is read back
 * through this map rather than cast at the call site.
 */
const membersByValue = new Map(
  teams
    .flatMap((team) => team.children ?? [])
    .map((member) => [member.value, member] as const)
)

/**
 * `renderLabel` replaces only the label block, so avatars and role badges drop
 * in while the count, chevron and selected check keep working. Use `renderItem`
 * instead when the row shares nothing with the default.
 *
 * `CascaderValue` takes a render function for the same reason one level up: the
 * trigger has to name a person, and a name without a face is the one thing an
 * assignee field cannot afford. It replaces the WHOLE display, placeholder
 * included, so the empty state is spelled out here rather than passed as a
 * `placeholder` prop that would never be reached.
 *
 * Neither surface carries an alignment class. Both rows are already flex with
 * `items-center`, and both keep the avatar box under the label's line box - 20px
 * against 20px in the trigger, 24px in the wider panel row - so the circle and
 * the name share one centre line instead of the taller of the two dragging the
 * row around it.
 *
 * The role chip sits INLINE, straight after the name, and the name is the only
 * thing in the row that truncates.
 *
 * It used to trail the row, where it read as misplaced for a reason that has
 * nothing to do with the chip: a selectable leaf reserves an inline-end gutter
 * for the check mark, so the chip stopped a full gutter short of the panel edge
 * and lined up with nothing - not the edge, not the name it qualifies. Bound to
 * the name instead, "who, and at what rung" is one phrase read in one pass, and
 * the chip is out of reach of a gutter whose width is a different number in
 * every style.
 *
 * Below the name was the other option and was not taken. It would double every
 * row's height to carry one word, and a second line in a row that already has
 * an avatar reads as a description - a job title, a team, an email - rather
 * than as a chip qualifying the name above it.
 *
 * The mechanics are one class: the name is `min-w-0 truncate` and NOT `flex-1`.
 * A growing name would push the chip back to the trailing edge and take the
 * problem with it; a name sized to its own content leaves the slack AFTER the
 * chip, which is where the check gutter already is. Nothing else moved - the
 * check still marks the selected member on its own column, and the trigger
 * still names them with a face.
 *
 * The chip is a SEMANTIC outline variant, one per seniority band. Plain
 * `outline` is `bg-transparent` in light mode, so the row's highlight washed
 * straight through it, while `primary-outline` and its siblings are
 * `bg-background` - a real fill against the highlight - and spend their colour
 * on the rung rather than on decoration. See `ROLE_BADGE` for the mapping and
 * for why every one of them pins its text colour back.
 */
  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [value, setValue] = useState("")

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader labels={exampleLocales.cascader}
        items={teams}
        value={value}
        onValueChange={setValue}
        renderLabel={(node, state) =>
          state.branch ? (
            <span className="w-full truncate text-start font-medium">
              {<ExampleText>{node.label}</ExampleText>}
            </span>
          ) : (
            <span className="flex w-full min-w-0 items-center gap-2">
              <span className="relative shrink-0">
                <MemberAvatar
                  member={node}
                  className="size-6"
                  fallbackClassName="text-[10px]"
                />
                <span
                  aria-hidden="true"
                  className={`ring-popover absolute -end-0.5 -bottom-0.5 size-2 rounded-full ring-2 ${
                    node.data?.status === "online"
                      ? "bg-success"
                      : "bg-muted-foreground/40"
                  }`}
                />
              </span>
              {/* No `flex-1`. The name takes the width it needs and gives it
                  back first; the chip that follows stays glued to it and the
                  leftover space - including the check gutter - lands after
                  both, instead of between them. */}
              <span className="min-w-0 truncate text-start">{<ExampleText>{node.label}</ExampleText>}</span>
              {<ExampleText>{node.data ? <RoleBadge role={node.data.role} /> : null}</ExampleText>}
            </span>
          )
        }
      >
        <CascaderTrigger
          aria-label={copyExample("Assignee")}
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue className="gap-2">
            {(selected) => {
              const node = selected[0]
              if (!node) {
                return (
                  <span className="text-muted-foreground truncate">
                    {<ExampleText>Assign to someone </ExampleText>}</span>
                )
              }
              const member = membersByValue.get(node.value)
              return (
                <>
                  {member ? (
                    <MemberAvatar
                      member={member}
                      className="size-5"
                      fallbackClassName="text-[9px]"
                    />
                  ) : null}
                  <span className="truncate">{<ExampleText>{node.label}</ExampleText>}</span>
                </>
              )
            }}
          </CascaderValue>
        </CascaderTrigger>

        <CascaderContent className="w-80">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
