### 共用 Sonner 通知

从 `@exre/exui` 同时导入 `Toaster` 和 `toast`，使通知使用同一份包内 Sonner 实例。先挂载一个稳定的 `Toaster`，再触发通知。应用另装的 Sonner 实例拥有独立状态。

用 `toast.loading` 创建加载通知并保留返回的 ID；将这个 ID 传给 `toast.loading`、`toast.success` 或 `toast.error`，即可更新同一条通知。`toast.promise` 随 Promise 在加载、成功和失败之间切换。调用 `toast.dismiss(id)` 关闭通知；警告方法名为 `toast.warning`。

`visibleToasts` 限制可见条数，不淘汰旧记录。应用负责取消、截止时间、迟到回调保护和资源清理。卸载宿主不会清空通知 store；loading 的时长参数也不能替代任务截止计时。
