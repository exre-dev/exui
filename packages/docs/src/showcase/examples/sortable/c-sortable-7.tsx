"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GripVerticalIcon, ImageIcon } from "lucide-react"

import { useState } from "react"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@exre/exui"



interface GalleryImage {
  id: string
  name: string
  dimensions: string
  size: string
}

const defaultImages: GalleryImage[] = [
  { id: "1", name: "hero-banner.jpg", dimensions: "1920×1080", size: "2.4 MB" },
  { id: "2", name: "product-shot.png", dimensions: "800×600", size: "1.8 MB" },
  { id: "3", name: "team-photo.jpg", dimensions: "1200×800", size: "3.2 MB" },
  { id: "4", name: "logo-dark.svg", dimensions: "240×60", size: "12 KB" },
  { id: "5", name: "og-image.png", dimensions: "1200×630", size: "890 KB" },
  { id: "6", name: "favicon.ico", dimensions: "32×32", size: "4 KB" },
]

  function OriginalPattern() {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages)

  return (
    <div className="mx-auto w-full max-w-md">
      <Frame spacing="xs">
        <FrameHeader>
          <FrameTitle>{<ExampleText>Media Library</ExampleText>}</FrameTitle>
          <FrameDescription>{<ExampleText>Drag to reorder display priority</ExampleText>}</FrameDescription>
        </FrameHeader>
        <FramePanel className="p-2!">
          <Sortable
            value={images}
            onValueChange={setImages}
            getItemValue={(item) => item.id}
            strategy="grid"
            className="grid grid-cols-3 gap-2"
          >
            {<ExampleText>{images.map((image) => (
              <SortableItem key={image.id} value={image.id}>
                <div className="bg-muted group rounded-lg relative flex flex-col items-center justify-center gap-2 border p-4">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVerticalIcon className="size-3.5" />
                  </SortableItemHandle>
                  <ImageIcon className="text-muted-foreground size-5" />
                  <div className="w-full text-center">
                    <p className="truncate text-xs font-medium">{<ExampleText>{image.name}</ExampleText>}</p>
                    <p className="text-muted-foreground text-[10px]">
                      {<ExampleText>{image.dimensions}</ExampleText>} &middot; {<ExampleText>{image.size}</ExampleText>}
                    </p>
                  </div>
                </div>
              </SortableItem>
            ))}</ExampleText>}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
