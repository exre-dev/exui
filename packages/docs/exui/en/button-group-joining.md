### Connected controls

`ButtonGroup` keeps adjoining controls connected with square inner corners and one shared border, including `InputGroup`, Select triggers and captions. These seams remain connected when the application compiles its own utility stylesheet. Use `orientation="vertical"` for stacked controls.

Use `ButtonGroupText` for a noninteractive caption or count; `asChild` keeps the joining behavior on your own element. Nested `ButtonGroup` elements form separate, spaced clusters. A Select's hidden native form control does not become a visible segment or remove the last trigger's outer corners.
