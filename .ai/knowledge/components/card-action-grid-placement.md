# CardAction 在文档站样式层中的网格定位

CardAction 原本同时携带 `row-start-1` 和 `row-span-2`。文档站将公开组件样式放在 `exui` 层，应用工具类放在更高的 `utilities` 层；应用生成的 `row-span-2` 使用 `grid-row` 简写，会覆盖公开层的起始行，让操作区失去第一行定位。

Questionnaire 将标题和说明分别通过 CardTitle、CardDescription 渲染后，最终 `data-slot` 仍属于 Questionnaire。此时自动放置可能将说明移到第二列，中文标题被挤成窄列，进度也会下移。仅测试公共样式表无法发现应用层覆盖。

CardAction 现在以单个 `row-[1/span_2]` 表达起始行和跨度。`packages/docs/tests/browser/Questionnaire.vrt.test.tsx` 加载完整文档站样式，检查七个真实示例中的可见卡片标题区和普通 Card，覆盖中英文、三种主题、两档密度及桌面/移动视口，并通过真实选择和 Next 检查第一个示例的全部步骤。断言检查标题与说明上下对齐、右侧操作位置和边界，不记录截图基线。
