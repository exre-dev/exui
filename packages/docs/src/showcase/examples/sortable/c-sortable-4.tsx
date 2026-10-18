"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GripVerticalIcon, ListMusicIcon, MusicIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"
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



interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  plays: string
  active?: boolean
}

const defaultTracks: Track[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:03",
    plays: "1.2B",
    active: true,
  },
  {
    id: "2",
    title: "Digital Love",
    artist: "Daft Punk",
    album: "Discovery",
    duration: "4:58",
    plays: "845M",
  },
  {
    id: "3",
    title: "Starlight",
    artist: "Muse",
    album: "Black Holes",
    duration: "3:59",
    plays: "720M",
  },
  {
    id: "4",
    title: "Take On Me",
    artist: "a-ha",
    album: "Hunting High and Low",
    duration: "3:48",
    plays: "1.8B",
  },
  {
    id: "5",
    title: "Blue Monday",
    artist: "New Order",
    album: "Power, Corruption",
    duration: "7:29",
    plays: "530M",
  },
]

  function OriginalPattern() {
  const [tracks, setTracks] = useState<Track[]>(defaultTracks)

  return (
    <div className="mx-auto w-full max-w-md">
      <Frame spacing="xs">
        <FrameHeader>
          <div className="flex items-center justify-between">
            <div>
              <FrameTitle>{<ExampleText>Queue</ExampleText>}</FrameTitle>
              <FrameDescription>{<ExampleText>{tracks.length}</ExampleText>} {<ExampleText> tracks</ExampleText>}</FrameDescription>
            </div>
            <Badge variant="outline" size="sm">
              <ListMusicIcon className="size-3" />
              {<ExampleText>Playlist </ExampleText>}</Badge>
          </div>
        </FrameHeader>
        <Sortable
          value={tracks}
          onValueChange={setTracks}
          getItemValue={(item) => item.id}
          strategy="vertical"
          className="space-y-0.5"
        >
          {<ExampleText>{tracks.map((track) => (
            <SortableItem key={track.id} value={track.id}>
              <FramePanel className="p-0!">
                <div className="group flex items-center gap-3 px-3 py-2.5">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                    <GripVerticalIcon className="size-4" />
                  </SortableItemHandle>
                  <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
                    <MusicIcon className="text-muted-foreground size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${track.active ? "text-primary" : ""}`}
                    >
                      {<ExampleText>{track.title}</ExampleText>}
                      {<ExampleText>{track.active && (
                        <Badge
                          variant="primary-light"
                          size="xs"
                          className="ms-1.5 align-middle"
                        >
                          {<ExampleText>Playing </ExampleText>}</Badge>
                      )}</ExampleText>}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {<ExampleText>{track.artist}</ExampleText>} &middot; {<ExampleText>{track.album}</ExampleText>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">
                      {<ExampleText>{track.plays}</ExampleText>}
                    </span>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {<ExampleText>{track.duration}</ExampleText>}
                    </span>
                  </div>
                </div>
              </FramePanel>
            </SortableItem>
          ))}</ExampleText>}
        </Sortable>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
