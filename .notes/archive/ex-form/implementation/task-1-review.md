# Task 1 独立 working-tree 审查

日期：2026-10-19。范围：`task-1-paths.txt` 中全部 21 个精确路径，以及完整的忽略文件 `task-1-report.md`。仅审查 Task 1，不代表整个交付完成。

## 第二轮当前结论

**未发现阻塞问题；当前 P0/P1/P2/P3 findings 均为 0。规范符合性：PASS；代码质量：PASS，均仅限 Task 1。** 第一轮唯一 P2 已解决，下面第一轮记录保留为历史证据，不再代表当前状态。

本轮重新使用 code-review working-tree 模式，检查完整清单的 staged/unstaged/untracked 状态和当前实现，读取完整追加后的实施报告，并对照 HEAD 的被删除源码。staged diff 仍为空；没有仅看三条修复路径而跳过原 Task 1 变更。

### 第二轮精确覆盖

以下 21 条路径全部在本轮范围内，另包含完整 `.notes/ex-form/implementation/task-1-report.md`；删除项使用 HEAD 源码及与替代实现的归一化 diff 核查。

```text
packages/components/src/components/patterns/ex-form.tsx (deleted)
packages/components/src/components/patterns/ex-item.tsx (deleted)
packages/components/src/components/patterns/form-item.tsx (deleted)
packages/components/src/components/patterns/form-list.tsx
packages/components/src/components/patterns/form.tsx
packages/components/src/index.ts
packages/components/src/lib/forms/types.ts
packages/docs/src/showcase/ExItem.vrt.test.tsx (deleted)
packages/docs/src/showcase/Form.vrt.test.tsx
packages/docs/src/showcase/FormAsync.vrt.test.tsx
packages/docs/src/showcase/FormControls.vrt.test.tsx
packages/docs/src/showcase/FormSteps.vrt.test.tsx
packages/docs/src/showcase/FormSurfaceOutline.vrt.test.tsx
packages/docs/src/showcase/FormSurfaces.vrt.test.tsx
scripts/form-consumer-fixture.mjs
packages/components/src/components/patterns/form-configured.tsx (untracked)
packages/components/src/components/patterns/form-field-layout.tsx (untracked)
packages/components/src/components/patterns/form-field.tsx (untracked)
packages/components/src/components/patterns/form-shell.tsx (untracked)
packages/docs/src/showcase/FieldLayout.vrt.test.tsx (untracked)
packages/docs/src/showcase/FormApi.vrt.test.tsx (untracked)
```

当前范围内容摘要 SHA-256：`9349a2d23c71f016096a0de0ef1655ec3790c7f04085e2f31fd23ac408d7b392`。算法按清单顺序，再加入实施报告，依次拼接 UTF-8 路径、NUL、当前文件原始字节（删除项使用 `DELETED`）、NUL；本审查报告不在摘要内。

### 修复及测试意图核查

- `form.tsx:23` 允许非空 object 或 function，仍要求 Standard Schema V1 和可调用的 validate；没有修改 schema、字段值或 coordinator 语义。
- FormApi 的真实函数型 Schema 将字符串 Input 转换为 `{ length: number }` Output。SSR 同时覆盖 schema owning 和外部实例路线、两条 draft 值及两个原生根；浏览器实际输入后点击提交，断言 `{ length: 7 }`，避免只验证“不抛异常”。
- 畸形 Schema 反例覆盖缺失、null、原始类型、普通对象、未装饰函数、错误版本和非函数 validate；修复没有通过放弃结构检查来接受合法函数。
- 维护的 compiler fixture 对函数型 Schema 两条路线分别验证输出推导，包含 Input-only `name` 在提交结果上不可用的反例。维护的 SSR fixture 在 document/File 抛错条件下验证所有四个独立 Form 根和两条函数型路线。
- 重新核对其余类型、公开导出、FormShell、FormField、配置递归、私有布局与 FieldLayout 测试；核心绑定抽取与第一轮结论一致，六个原有 Form 行为套件相对 HEAD 只有公开名称迁移，没有放宽断言。

### 第二轮独立执行证据

Node 24.22.0 / pnpm 11.9.0：

1. 独立执行清单中的全部八个 Form/FieldLayout 浏览器套件：**16 个浏览器实例文件通过、174 个测试通过，14.85 秒**。这是修复后的完整 Task 1 目标套件结果；未接受截图或新基线。
2. 从当前 `createFormConsumerFiles()` 重新生成临时夹具，分别执行 Zod 4.6.5 和 Zod 3.25.28 的严格 workspace 编译（`strict: true`、`skipLibCheck: false`）：均 exit 0，函数型 Schema 正例及原有负例均保留。不是隔离安装或打包验收结论。
3. 在同一新夹具内执行 `pnpm exec vite build --ssr server.tsx --outDir ssr` 及 `node smoke.mjs`：exit 0，输出 `Form SSR without browser globals passed: 30147`，包括函数型 Schema 两条路线和四个原生 Form 根。
4. 全部指定路径 `git diff --check`：exit 0，只有 LF/CRLF 提示。临时夹具文件逐项清理；无生产代码、维护测试、索引或提交修改。

Task 1 的独立审查门禁通过，可继续其依赖阶段。Task 2/3、整仓类型/构建/pack、真实文档 gallery、两个部署 base 和最终全部路径 working-tree review 仍按计划执行；此处不对它们提前作通过结论。父代理正在独立执行 pack，本轮未重复它。

## 第一轮历史 Findings（P2 已修复）

- **[P2] Schema 守卫拒绝公开类型允许的函数型 Standard Schema** — `packages/components/src/components/patterns/form.tsx:23`

  `typeof schema !== "object"` 将携带合法 `~standard` 属性的函数一律拒绝。公开的 `FormSchema` / `StandardSchemaV1` 是结构类型，没有禁止可调用对象；原 `useForm`、配置渲染器和校验核心也能够使用这种 Schema。因此，同一合法 Schema 在 `<Form form={useForm(...)} fields={...}>` 路径成功，在新的 `<Form schema={...} defaultValues={...} fields={...}>` 路径却在渲染时抛出配置错误。这属于新增入口断言对既有 Schema 支持的收窄。

  独立复现使用以下 Schema，严格 TypeScript 编译通过：

  ```tsx
  const schema: StandardSchemaV1<{ name: string }, { name: string }> =
    Object.assign((value: unknown) => value, {
      "~standard": {
        version: 1 as const,
        vendor: "callable",
        validate(value: unknown) {
          return { value: value as { name: string } }
        },
      },
    })

  <Form schema={schema} defaultValues={{ name: "" }}
    fields={[{ name: "name", control: "text" }]} onSubmit={() => {}} />
  ```

  对构建后的公开包执行 `renderToString`，外部 `useForm` 实例路线得到 **1 个原生 form**；schema owning 路线抛出 `ExUI Form: configured forms require an ExUI form instance or a Standard Schema.`。最小修复是允许非空的 object 或 function，再保留 `~standard.version` / `validate` 校验；在维护的公共编译夹具和 SSR/浏览器入口测试中加入函数型 Schema 正例，防止类型与运行时再次分离。现有 Zod 3/4 均为对象型夹具，未覆盖此边界。

未发现其他有证据支持的 P0/P1/P2/P3 问题。

## 第一轮历史规范符合性结论：NACK

除上述 Standard Schema 支持回归外，Task 1 实现符合最新范围约束：

- 三个显式 Form 重载及具名分支类型存在；组合分支和外部实例分支具有明确的 `never` 排除，spread 反例没有依赖额外属性检查。
- `fields !== undefined` 分派包含空数组；组合/配置种类变化要求新 key，配置内部 schema/实例来源切换仍通过独立子树卸载及挂载完成。
- ExForm、FormItem、ExItem 及旧公开类型已移除；公共编译夹具明确验证旧名称无法导入。新布局类型位于中立类型模块，未反向引用已删除展示组件。
- FormShell 保持唯一原生 form 和 owner 接线；FormField 与原绑定实现除命名及内部导入外一致。配置递归、步骤、children 插槽次序、默认/空/函数 footer、reset、noValidate、aria-busy 接线均保持。
- coordinator、useForm、FormStepsController 没有本次修改；未引入第二份值状态。旧 ExItem 的自动 Input 检查/克隆已按最新覆盖要求移除；私有展示壳保留 DOM/CSS、布局继承和显式 ID 关联。
- 独立展示测试改用真实公开 Field primitives 组合，保留有用的几何、窄容器、ref/value/change、显式标签/描述、SSR/hydration、多控件、网格 span、错误位置和 noStyle 场景；已删除的自动注入及冲突检测断言对应被明确移除的功能。

评估依据为实施计划的最新用户覆盖要求，以及 RFC 第 3—5 节中与之相容的部分。未将旧 RFC 的兼容别名、interface 兼容或旧地址要求重新作为验收条件。

## 第一轮历史代码质量结论：NACK

阻塞项为上面的 P2。共享 Shell 的依赖方向清晰，字段绑定和配置递归的类型擦除边界沿用既有实现，没有发现新增循环依赖、状态复制或 unrelated rewrite。修复应集中于入口守卫和对应契约回归测试。

## 测试意图核查

| 关键意图 | 实际证据与覆盖判断 |
| --- | --- |
| 三分支与 Input/Output 推导 | 维护的 form-consumer-fixture：具名 props、schema/external/composed 正例、spread 禁止项、默认值/提交类型、路径/控件/枚举/list 关联反例；独立严格编译通过 |
| 新旧公开面 | 维护的编译夹具检查旧值及旧类型不可导入，FormField render/control/children 互斥；独立严格编译通过 |
| 分派与生命周期 | FormApi 浏览器测试检查空 fields、单原生根、显式组合操作、footer reset、无 key 报错、key 重挂载、配置来源双向切换；独立运行通过 |
| 原有状态和步骤 | Form/FormAsync/FormSteps 保留原有行为断言，仅迁移公开名称；与 HEAD 的抽取对照确认核心接线保持。完整 172 测试结果来自实施报告，本轮未重复全套 |
| 控件与展示 | FormControls/FormSurfaces/FormSurfaceOutline 保留原断言；FieldLayout 的几何和真实焦点关联独立运行通过，没有接受新截图 |
| SSR | 维护的 smoke 继续禁止渲染时读取 document/File；实施报告记录通过。本轮另外使用公开包 SSR 复现函数型 Schema 的成功/失败路线差异 |
| 函数型 Standard Schema | 当前维护测试缺少正例；本轮临时严格编译通过，但公开入口 SSR 失败，对应上述 P2 |

## 本轮实际执行

- 检查全部指定路径的 staged、unstaged 和 untracked 状态；staged diff 为空。完整读取新增文件及 Task 1 报告，并通过 HEAD 源码和归一化 diff 对照删除/抽取实现及旧展示测试。
- 读取根 AGENTS、TESTING、相关 `.ai/` 表单结构/生命周期资料、实施计划和 RFC；目标仓库没有 `.codegraph/`。
- `py -3 .../code-review/scripts/analyze.py <worktree> --lang node`：设置 `PYTHONIOENCODING=utf-8` 后 exit 0。脚本提示位于范围外或属于 RegExp.exec 等静态误报，未据此制造 scoped findings。
- Node 24.22.0 / pnpm 11.9.0：独立运行 `FormApi.vrt.test.tsx` 和 `FieldLayout.vrt.test.tsx`，**4 个浏览器实例文件、42 个测试通过**。
- 从维护的 `createFormConsumerFiles()` 生成临时 workspace 夹具，以 `strict: true` / `skipLibCheck: false` 分别运行已安装 Zod 4.6.5 和 Zod 3.25.28 编译：均 exit 0；额外函数型 Schema 模块亦在两个配置下通过。此证据属于 workspace resolution，不是新隔离安装或 tarball 消费验收。
- 公开包 Node SSR 的函数型 Schema 复现：外部实例路线成功，schema owning 路线稳定抛出上述错误。
- 临时编译夹具文件已逐项移除；未修改生产代码、维护测试、索引或提交。

## 范围依赖与后续门禁

Task 2 尚须迁移 authored docs/examples 中的旧名称和实际 gallery；Task 3 尚须更新 skill、capability、`.ai/`、Changeset 和升级说明，并执行完整验证。它们是已规划的后续阶段，不是本轮组件范围的缺陷。FieldLayout 的本轮通过也不代表后续真实 Field 扩展示例已经验收。

修复 P2 后应重新审查 Task 1。整个交付结束时仍须执行覆盖所有修改和忽略 notes 的完整 working-tree review。本轮没有远端 CI、打包消费者、宿主、registry 或部署验收结论。
