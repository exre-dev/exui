### Trace status and disclosure

ExUI exports `Trace`, `TraceLine`, `TraceIcon`, `TraceTitle`, `TraceDescription`, `TraceCollapsible`, `TraceCollapsibleTrigger`, and `TraceCollapsibleContent` from `@exre/exui`. Compose a `TraceLine` inside each row or trigger; it is a plain span until a surrounding link or button gives it an action. `TraceIcon` is decorative, so put running, failed, or pending status in the `TraceTitle` words as well as the `TraceLine` status color.

Use `defaultOpen` for independent disclosure, or pass `open` with `onOpenChange` for controlled disclosure. Nested rows keep their own state. ExUI's Radix Luma recipe supplies row spacing and focus treatment; running shimmer, content expansion, and the disclosure arrow transition are limited to motion-safe environments.
