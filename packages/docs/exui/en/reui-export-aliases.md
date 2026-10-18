### Root export collision aliases

The public root resolves name collisions between component modules with `Reui`-prefixed names. Import those exact names from `@exre/exui`; do not assume the original module-local name is also exported. The alias inventory includes scheduling helpers such as `ReuigetDayKey`, `ReuiexpandRecurrence`, `ReuiMAX_OCCURRENCES`, and type aliases such as `ReuiBuildIndexOptions`. The maintained export inventory is authoritative for the full set.

```tsx verify
import { ReuigetDayKey } from "@exre/exui"

export const getScheduleDayKey = ReuigetDayKey
```
