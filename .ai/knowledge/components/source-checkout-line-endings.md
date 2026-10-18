# 源检查与检出换行

Windows Git 的自动换行转换可能让公开导出入口以 CRLF 检出，即使生成器写出的内容使用 LF。将检出字节直接与生成文本比较，会把没有语义变化的入口误报为导出过期；在原工作区直接运行生成器可能掩盖这个问题。

`scripts/reui-exports.mjs` 在比较入口和公开导出清单前统一为 LF。样式配方生成器也统一原始缓存和生成样式的换行，因为恢复器允许保留经过哈希验证的 CRLF 缓存。两者的检查模式都不改写检出字节，真实内容差异仍然失败。对应回归用临时源码树验证 CRLF 检出、只读检查和内容漂移，不依赖开发笔记或参考归档。

来源与适配的哈希规则见 [公共入口与构建边界](../../architectures/components/public-surface.md)；测试入口见 `scripts/reui-exports.test.mjs`。

文档源码摘录也以 LF 进行解析和比较。`scripts/docs-snippets.mjs` 在验证及重写家族摘录前归一化检出换行，避免 CRLF 让代码围栏无法匹配；`scripts/docs-snippets.test.mjs` 同时覆盖两种换行，并确认源码、示例标识和完整源码链接发生真实变化时仍然拒绝。
