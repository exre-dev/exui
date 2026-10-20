# FieldLabel 的选中背景联动

最后更新：2026-10-17

`FieldLabel` 的通用 checked 后代选择器会匹配嵌套的多个控件类型；只排除 Checkbox 和 Switch 不会同时排除 Radio。Radio 自身的品牌色圆点仍正常时，外层标签也可能意外出现灰底，容易误判为 RadioGroupItem 的配色问题。标签使用内容宽度时，这层灰底还会表现为只覆盖行的一部分。

排查时应同时读取控件与最近标签的计算背景，再通过点击标签及键盘改变选择验证两个绘制层。Radio、Checkbox 和 Switch 的默认选中表达由各自控件承担，标签不自动染色；应用显式设置的行或卡片背景仍由应用控制。消费约定见 [setup](../../../skills/exui/references/exui/setup.md#radio-field-appearance)，浏览器行为回归见 [`RadioGroup.vrt.test.tsx`](../../../packages/docs/tests/browser/RadioGroup.vrt.test.tsx) 和 [`Checkbox.vrt.test.tsx`](../../../packages/docs/tests/browser/Checkbox.vrt.test.tsx)。
