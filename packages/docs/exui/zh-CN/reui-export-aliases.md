### 根入口导出冲突别名

公共根入口使用带 `Reui` 前缀的名称解决组件模块间的名称冲突。应从 `@exre/exui` 导入这些准确名称，不能假设原始模块局部名称也被导出。别名包括排程辅助函数 `ReuigetDayKey`、`ReuiexpandRecurrence`、`ReuiMAX_OCCURRENCES`，以及 `ReuiBuildIndexOptions` 等类型。完整名单以维护中的导出清单为准。

```tsx verify
import { ReuigetDayKey } from "@exre/exui"

export const getScheduleDayKey = ReuigetDayKey
```
