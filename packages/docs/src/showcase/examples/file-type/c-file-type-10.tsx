
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  FileType,
  getFileType,
} from "@exre/exui"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"

type Revision = {
  file: string
  /** Shown in the label band in place of the extension. */
  label: string
  note: string
  date: string
  dateLabel: string
}

/* Newest first. 3 revisions are the same DOCX, so the label carries the
   version instead of repeating the extension. A longer label (SIGNED,
   CA-1042) keeps the same band and sets its text smaller to fit. */
const REVISIONS: Revision[] = [
  {
    file: "agreement-signed.pdf",
    label: "SIGNED",
    note: "Countersigned",
    date: "2026-10-04",
    dateLabel: "Oct 4",
  },
  {
    file: "agreement-v3.docx",
    label: "V3",
    note: "Counsel review",
    date: "2026-09-28",
    dateLabel: "Sep 28",
  },
  {
    file: "agreement-v2.docx",
    label: "V2",
    note: "Pricing schedule added",
    date: "2026-09-19",
    dateLabel: "Sep 19",
  },
  {
    file: "agreement-v1.docx",
    label: "V1",
    note: "First draft",
    date: "2026-09-12",
    dateLabel: "Sep 12",
  },
]

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="bg-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle"
    />
  )
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        {/* A string label joins the accessible name: "CA-1042, File". */}
        <FileType type="empty" variant="light" size="xl" label={copyExample("CA-1042")} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-sm font-medium">{<ExampleText>Supply agreement</ExampleText>}</p>
          <p className="text-muted-foreground truncate text-sm">
            {<ExampleText>Northwind Foods </ExampleText>}<Dot />
            {<ExampleText>{REVISIONS.length}</ExampleText>} {<ExampleText> revisions </ExampleText>}</p>
        </div>
      </div>
      <ItemGroup aria-label={copyExample("Revisions")}>
        {<ExampleText>{REVISIONS.map((revision) => (
          <Item key={revision.file} role="listitem" variant="outline" size="sm">
            <ItemMedia>
              {/* Light, not outline: an outlined page inside an outlined row
                  reads as a second frame. Hidden because the file name
                  beside it already reads the extension and the version. */}
              <FileType
                type={getFileType(revision.file)}
                variant="light"
                label={revision.label}
                aria-hidden="true"
              />
            </ItemMedia>
            {/* min-w-0 lets the content shrink below the name, and the span
                (not the flex title) carries the ellipsis. */}
            <ItemContent className="min-w-0">
              <ItemTitle className="max-w-full">
                <span className="truncate">{<ExampleText>{revision.file}</ExampleText>}</span>
              </ItemTitle>
              <ItemDescription>
                {<ExampleText>{revision.note}</ExampleText>}
                <Dot />
                <time dateTime={revision.date}>{<ExampleText>{revision.dateLabel}</ExampleText>}</time>
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}</ExampleText>}
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
