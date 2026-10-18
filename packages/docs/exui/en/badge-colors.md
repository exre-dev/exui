### Badge migration in 1.0

`variant="ghost"` and `variant="link"` are no longer supported. Choose a supported variant such as `outline`, or use custom classes for a text-only treatment. `destructive` now has a solid fill; use `destructive-light` for a pale background.

### Readable status colors

ExUI Badge offers solid, light, and outline variants. Light
and semantic outline variants derive colored text and icons from their semantic
color and the current theme foreground. They do not reuse text intended for an
opaque status fill, so a pale red badge no longer receives white text. The
default blue and solid focus badges use deeper fills while retaining their
existing semantic foreground tokens. Other components' brand colors and
foregrounds are unchanged.

All 23 built-in variants are checked for at least **4.5:1 text contrast** on
standard page and card surfaces in light, dark and pitch-black, in both
densities. Size, typography, padding and radius remain variant-independent.
Icons using `currentColor` follow the label. Use the existing variants rather
than repeating a color-mixing style in each chart or status row.

`className`, `style`, `asChild` and semantic color overrides remain available.
The contrast guarantee covers built-in colors on standard surfaces; consumers
must validate custom palettes and backgrounds. Glass remains independently
opt-in, retains the shared material rules, and is checked on these standard
surfaces rather than arbitrary images.

```tsx verify
import { Badge } from "@exre/exui"

export function StatusBadges() {
  return <div className="flex flex-wrap gap-2">
    <Badge variant="success-light">Approved</Badge>
    <Badge variant="warning-light">Pending</Badge>
    <Badge variant="destructive-light">Declined</Badge>
    <Badge variant="destructive-outline">Needs attention</Badge>
    <Badge>New</Badge>
  </div>
}
```
