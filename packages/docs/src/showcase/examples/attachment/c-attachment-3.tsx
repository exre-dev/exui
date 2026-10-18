"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import {
  Attachment,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@exre/exui"

type Shot = {
  id: string
  name: string
  dimensions: string
  src: string
  alt: string
}

// Thumbnails are requested at the card width and twice the density, so the
// strip never pulls a full size screenshot down to paint a 120px square.
const SHOTS: Shot[] = [
  {
    id: "gradient",
    name: "brand-gradient.png",
    dimensions: "2400 x 1600",
    src: "/examples/reui/photos/b5a8406d913545dc0c.jpg",
    alt: "Purple and orange gradient artwork",
  },
  {
    id: "mesh",
    name: "mesh-backdrop.png",
    dimensions: "1800 x 1200",
    src: "/examples/reui/photos/1350f821433b98ad15.jpg",
    alt: "Blue and violet mesh render",
  },
  {
    id: "spectrum",
    name: "spectrum-wash.jpg",
    dimensions: "3000 x 2000",
    src: "/examples/reui/photos/32316c4a6ca2376bd1.jpg",
    alt: "Soft rainbow spectrum wash",
  },
  {
    id: "waves",
    name: "wave-pattern.png",
    dimensions: "1200 x 1200",
    src: "/examples/reui/photos/4d3ac3f3881ec891b9.jpg",
    alt: "Magenta and violet wave pattern",
  },
  {
    id: "ink",
    name: "ink-render.png",
    dimensions: "2000 x 1400",
    src: "/examples/reui/photos/76562ec89257456438.jpg",
    alt: "Colourful ink dispersing in water",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Boots with nothing chosen so the first click is the thing on show, and
  // the selected shot is looked up during render rather than duplicated.
  const selected = SHOTS.find((shot) => shot.id === selectedId) ?? null

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
      <AttachmentGroup role="group" aria-label={copyExample("Screenshots in this thread")}>
        {<ExampleText>{SHOTS.map((shot) => (
          /*
           * A vertical card takes its own fixed width, so a w-full here would
           * collapse the strip into one column and kill the snap scrolling.
           */
          <ExampleRuntimeConsumer key={shot.id} render={({format: formatExample, copy: copyExample}) => (<Attachment key={shot.id} orientation="vertical">
            <AttachmentMedia variant="image">
              {/*
               * No classes on the image: variant="image" already crops every
               * child img square and covers the frame. The alt describes the
               * picture, and the title below it names the file.
               */}
              <img
                src={shot.src}
                alt={copyExample(shot.alt)}
                width={120}
                height={120}
                loading="lazy"
                decoding="async"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{<ExampleText>{shot.name}</ExampleText>}</AttachmentTitle>
            </AttachmentContent>
            {/*
             * The trigger reports aria-pressed because it selects rather than
             * navigates, and it renders below the actions slot in the stacking
             * order, so a card can carry a full card select and its own buttons.
             */}
            <AttachmentTrigger
              type="button"
              aria-label={(formatExample("Preview {name}", { name: shot.name }))}
              aria-pressed={selectedId === shot.id}
              onClick={() => setSelectedId(shot.id)}
            />
          </Attachment>)} />
        ))}</ExampleText>}
      </AttachmentGroup>
      <p className="text-muted-foreground text-xs" aria-live="polite">
        {<ExampleText>{selected ? (
          <>
            {selected.name}
            <span
              aria-hidden="true"
              className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
            />
            {selected.dimensions}
          </>
        ) : (
          "Select a shot to see its details."
        )}</ExampleText>}
      </p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
