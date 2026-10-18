### Compact component padding

ExUI uses `1rem` padding (16px at a 16px root) for default Card insets, all sides of `AlertDialogContent`, `SheetHeader` and `SheetFooter`, vertical padding in `CommandEmpty` and DataGrid empty-table/filter messages, all sides of Gantt's no-resource message, and bottom padding between vertical `TimelineItem` entries. Empty-state padding appears only when that state is rendered; Timeline's last item has no added bottom padding. Caller classes can override these defaults.

Card's default and `sm` sizes both use `1rem` insets. `--card-spacing` controls those insets; `--card-gap` controls the separate section gap, which remains `1.5rem` by default and `1rem` for `sm`. Header bottom and Footer top insets appear when the corresponding border is added; a leading image still removes the Card's top inset.
