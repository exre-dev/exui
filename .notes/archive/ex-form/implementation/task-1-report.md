# Task 1: Unified Form API implementation report

Date: 2026-10-19. Scope: Task 1 only, with the binding unpublished-project override (no compatibility API). No commits, pushes, publication, source-lock updates or generated declaration edits were made.

## Implemented contract

- `Form` has three explicit overloads: `FormComposedProps<I,O>`, `FormConfiguredInstanceProps<I,O>` and `FormConfiguredSchemaProps<S>`.
- Composed props explicitly exclude every configuration-only prop with `never`; the external configured branch also excludes schema/defaults/modes. `fields !== undefined` chooses the configured branch, including `[]`.
- Public `FormField`, `FormFieldProps`, `FormFieldLayout`, `FormFieldSpan`, `FormConfiguredCommonProps`, and `FormFooterArguments` replace the old names. All old ExForm/ExItem/FormItem values and their old public props/layout/span/footer types, including `FormProps`, are removed. Layout/span types are declared in the neutral form types module.
- The entry rejects non-array fields, missing sources/defaults/onSubmit, invalid external instances, conflicting source props, forbidden composed configuration props and managed native reset/validation props, with `ExUI Form:` errors.
- Changing composed/configured kind without a new React key throws. Changing external-instance/schema ownership within configured mode remains legal and remounts its source subtree.
- A private Shell owns the single native form connection. Configured rendering retains existing recursive fields/lists, steps, footer order, noValidate/reset/aria-busy handling and coordinator semantics. `FormField` retains the existing binding, control/path correlation, focus registration and description/error IDs. The private presentation shell retains DOM/CSS classes and layout inheritance but has no direct-Input inspection/cloning API.
- The standalone browser fixture now composes public Field primitives and explicitly binds real focus element IDs. It preserves the useful geometry, wrapping, form inheritance, ref/value/change, description, hydration, custom/wrapped/multiple controls, grid-span, noStyle and error placement scenarios. Legacy automatic Input association/conflict detection is intentionally replaced by explicit consumer wiring. The suite is renamed from ExItem to FieldLayout.

## Exact touched paths

Added:

- `packages/components/src/components/patterns/form-shell.tsx`
- `packages/components/src/components/patterns/form-configured.tsx`
- `packages/components/src/components/patterns/form-field.tsx`
- `packages/components/src/components/patterns/form-field-layout.tsx`
- `packages/docs/src/showcase/FormApi.vrt.test.tsx`
- `packages/docs/src/showcase/FieldLayout.vrt.test.tsx`
- `.notes/ex-form/implementation/task-1-report.md` (this ignored task report)

Modified:

- `packages/components/src/components/patterns/form.tsx`
- `packages/components/src/components/patterns/form-list.tsx`
- `packages/components/src/lib/forms/types.ts`
- `packages/components/src/index.ts`
- `scripts/form-consumer-fixture.mjs`
- `packages/docs/src/showcase/Form.vrt.test.tsx`
- `packages/docs/src/showcase/FormAsync.vrt.test.tsx`
- `packages/docs/src/showcase/FormControls.vrt.test.tsx`
- `packages/docs/src/showcase/FormSteps.vrt.test.tsx`
- `packages/docs/src/showcase/FormSurfaces.vrt.test.tsx`
- `packages/docs/src/showcase/FormSurfaceOutline.vrt.test.tsx`

Deleted:

- `packages/components/src/components/patterns/ex-form.tsx`
- `packages/components/src/components/patterns/ex-item.tsx`
- `packages/components/src/components/patterns/form-item.tsx`
- `packages/docs/src/showcase/ExItem.vrt.test.tsx` (replaced by FieldLayout suite)

No authored docs/example modules, capability data, skill files or upstream files were changed. `FormContentSizing.vrt.test.tsx` is untouched because it depends on authored Showcase examples that Task 2 must migrate.

## Actual validation evidence

All commands used Node 24.22.0 by prepending `C:/Users/grimeszhang/AppData/Local/npm-cache/_npx/387698761821791d/node_modules/node/bin` to PATH; pnpm is 11.9.0.

### Red before implementation

1. `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormApi.vrt.test.tsx`: both browser instances failed to import the new API because built `@exre/exui` had no `FormField` export. This is the expected missing public API failure.
2. Generated `createFormConsumerFiles()` under temporary `packages/docs/.form-contract-task1/`, then ran `pnpm --filter @exre/exui-docs exec tsc -p .form-contract-task1/tsconfig.json`: failed because configured `Form` schema/fields props and new named types/field export did not exist; old-API-removal directives were unused. The compiler really ran with `strict: true`, `skipLibCheck: false`.

### Implementation iterations

- The first component-only typecheck caught incomplete Shell extraction names; these were fixed before build.
- An intermediate four-suite browser run passed 82 tests but failed two runtime guard checks because foreign-instance errors still used the old internal prefix. The public entry now translates that validation failure to an `ExUI Form:` configuration error. A rebuilt package and the final full focused run below passed.

### Green

1. `pnpm --filter @exre/exui build`: passed after extraction, and again after the runtime guard fix. This includes component TypeScript checks, Vite bundle, declaration generation/internalization, token copying, notices and public artifact checks. The final artifact check reported 1143 declaration files and 428 component recipe variables.
2. Regenerated the final public fixture in the temporary directory and ran strict compiler against installed Zod **4.6.5**: `pnpm --filter @exre/exui-docs exec tsc -p .form-contract-task1/tsconfig.json` passed.
3. Ran the identical fixture against installed Zod **3.25.28** by adding only `compilerOptions.paths.zod = ["../../../node_modules/.pnpm/zod@3.25.28/node_modules/zod/index.d.ts"]` to a second tsconfig: `pnpm --filter @exre/exui-docs exec tsc -p .form-contract-task1/tsconfig.zod3.json` passed. These two checks use workspace resolution; they are not claims of fresh isolated installation or packed-consumer acceptance.
4. From that temporary fixture directory, `pnpm exec vite build --ssr server.tsx --outDir ssr` and `node smoke.mjs` passed. The maintained smoke script installs throwing `document`/`File` accessors before rendering; output was `Form SSR without browser globals passed: 15779`.
5. Final focused browser command:

   ```text
   pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormApi.vrt.test.tsx src/showcase/Form.vrt.test.tsx src/showcase/FormAsync.vrt.test.tsx src/showcase/FormSteps.vrt.test.tsx src/showcase/FormControls.vrt.test.tsx src/showcase/FormSurfaces.vrt.test.tsx src/showcase/FormSurfaceOutline.vrt.test.tsx src/showcase/FieldLayout.vrt.test.tsx
   ```

   Result: **16 test files passed, 172 tests passed**, desktop and mobile Chromium, 19.00 seconds. No visual baselines were accepted or rewritten.
6. `pnpm --filter @exre/exui lint`: exit 0, with the repository's existing-style React Fast Refresh/hook/unused-parameter warnings; this is not a zero-warning claim.
7. `git diff --check`: exit 0. Git printed only LF-to-CRLF checkout notices.

The temporary consumer directory (including generated SSR output) was removed after checking its resolved absolute path stayed at the named workspace-local target. Compiler fixtures remain maintained through `scripts/form-consumer-fixture.mjs`, consumed by the existing pack verification machinery.

## Boundaries and follow-up

- Task 2 must migrate authored docs/examples/imports to the removed public surface before whole-workspace typecheck/build, FormContentSizing, real gallery, snippets and site checks can pass. The current intermediate worktree is intentionally not a complete docs delivery.
- Task 3 owns capability/skill/.ai/Changeset updates and final full gates. No claimed packed, registry, provider, hosted or production acceptance here.
- Standalone FieldLayout validates the explicit public primitive recipe and existing CSS geometry. It does not prove the later authored Task 2 extension modules; those require their actual host/browser integration evidence.
- Full independent review remains mandatory and is run by the parent. No self-review approval is claimed.

## Independent review remediation: callable Standard Schema (P2)

Read `.notes/ex-form/implementation/task-1-review.md` and verified the reported mismatch against the structural public StandardSchemaV1 contract. Functions carrying valid `~standard` properties are accepted by the public types and existing `useForm`; rejecting them only at the owning Form entry was an unintended narrowing.

Production fix: the single schema-kind guard in `form.tsx` now permits a non-null object **or function**. The existing Standard Schema V1 version and callable `validate` checks remain. No schema/state/coordinator implementation was changed.

Additional regression coverage:

- `FormApi.vrt.test.tsx` declares a real callable structural schema whose Input is `{ name: string }` and Output is `{ length: number }`. It server-renders both owning and external-instance paths, verifies two native form roots and both draft values, then mounts the owning path in Chromium, fills its real textbox, clicks submit and checks transformed output `{ length: 7 }`.
- The same API suite now checks absent/null/primitive/plain-object/undecorated-function schemas, an invalid Standard Schema version and a callable schema with a non-function validator still throw configuration errors.
- `form-consumer-fixture.mjs` supplies a callable schema to both owning/external forms in its strict compiler source. The owning callback asserts numeric transformed output and rejects reading Input-only `name`. Its maintained SSR source renders both callable paths, and smoke checks both labels and exactly four native forms across all fixtures while `document`/`File` accessors throw.

Actual red/green evidence (same Node 24.22.0 / pnpm 11.9.0 PATH setup as above):

1. Before the guard edit, `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormApi.vrt.test.tsx` failed the new callable SSR case in **both** Chromium instances with `ExUI Form: configured forms require an ExUI form instance or a Standard Schema.`. Ten prior cases passed. One failure attachment copy also produced EBUSY after the expected assertion failure; it did not cause the schema rejection.
2. Before the guard edit, the newly extended maintained consumer passed both strict workspace compiler configurations (Zod 4.6.5 and installed 3.25.28 via the same explicit paths override described above), independently reproducing the compile/runtime discrepancy.
3. After the one-line guard fix, `pnpm --filter @exre/exui build` passed, including component TypeScript, bundle/declarations and public artifact checks.
4. Reran both strict consumer configurations against those rebuilt declarations: exit 0 for each; no unused `@ts-expect-error` directives.
5. Reran `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormApi.vrt.test.tsx`: **2 browser instance files passed / 12 tests passed**, 5.43 seconds. This is a focused remediation rerun; the earlier 172-test complete Task 1 run is not presented as a post-remediation full rerun.
6. Regenerated the maintained SSR consumer, then `pnpm exec vite build --ssr server.tsx --outDir ssr` and `node smoke.mjs`: passed, output `Form SSR without browser globals passed: 30147`, including both callable routes and four native roots.
7. `pnpm --filter @exre/exui exec oxlint src/components/patterns/form.tsx` and `git diff --check`: exit 0. No screenshots/baselines were accepted.

This remediation modifies only three already-listed paths (`form.tsx`, `FormApi.vrt.test.tsx`, `scripts/form-consumer-fixture.mjs`) plus this report. No new maintained paths, docs edits, subagents or commits. The temporary consumer was again removed after verifying its exact absolute workspace-local path. Full Task 1 path-set independent re-review remains the parent's gate; no review approval is claimed here.

## Test typing follow-up during Task 2 integration

Task 2's docs TypeScript check exposed TS2698 in the deliberate JavaScript misuse fixture: spreading `props as never` is not legal JSX spread syntax under the real docs compiler. Fixed only `packages/docs/src/showcase/FormApi.vrt.test.tsx`: a local `RuntimeForm` uses `Form as unknown as ComponentType<Record<string, unknown>>`, and each unchanged invalid-props object spreads into that test-only boundary. No `any`, suppression directive or production API change was added; all runtime rejection assertions remain.

Actual validation on Node 24.22.0 / pnpm 11.9.0:

- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormApi.vrt.test.tsx`: **2 browser instance files / 12 tests passed**, 4.50 seconds.
- `pnpm --filter @exre/exui-docs exec tsc -p tsconfig.json --noEmit`: exit 0 against the current shared docs worktree. This is the real docs application TS check, not a claim that docs:prepare, react-router typegen or tsconfig.node was rerun in this follow-up.
- `git diff --check -- packages/docs/src/showcase/FormApi.vrt.test.tsx`: exit 0.

Only this already-listed test file and this report changed in the follow-up. No component edits/build/pack, docs content edits, agents or commits. Complete final independent review remains pending with the parent.
