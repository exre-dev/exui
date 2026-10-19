# Form API consolidation implementation plan

> Execute using superpowers:subagent-driven-development, sequential tasks and independent code-review gates. No commits requested.

Goal: implement Form/FormField and standalone Field, migrate this unpublished repository, and write .notes/ex-form/upgrade-guide.md.
Spec: ../specs/2026-10-19-form-api-consolidation-design.md
RFC: ../rfcs/form-api-consolidation-rfc.md

## Latest user scope override (binding)

The user explicitly says compatibility is unnecessary because the project has not shipped. Remove ExForm, FormItem, ExItem and their old public types instead of adding aliases, adapters, deprecations or migration pages. Old URLs, anchors and share IDs need not survive. Keep all useful example scenarios under new canonical ownership. Do not build the RFC compatibility mapping or freeze legacy anchors. Use only the three new named branch props; no old FormProps requirement. Provide an upgrade guide in .notes when finished. Preserve existing form state, type safety, layout, aria, async and step behavior. Keep locked upstream examples/revisions untouched. No pushes, publication or commits.

## Architecture and tools

React 19 / TypeScript, existing RHF and Standard Schema core; one native form and one owner. Node 24.22.0, pnpm 11.9.0. Build/type-producing commands sequential. Existing isolated worktree feat/blocks-optimization at ed28078; clean original baseline.

### Task 1: Unified API and compiler/browser acceptance

Ownership: packages/components/src form pattern files, types.ts and public exports; scripts/form-consumer-fixture.mjs and existing form/ExItem browser test files. Do not touch docs examples, authored docs, capability or skill files yet.
Interfaces: FormComposedProps<I,O>, FormConfiguredCommonProps<I,O>, FormConfiguredInstanceProps<I,O>, FormConfiguredSchemaProps<S>, FormFieldProps<I,O,P>, FormFieldLayout, FormFieldSpan, FormFooterArguments<I>. No Ex-prefixed types and no FormItem/FormProps alias. Other existing form core types remain.
- [ ] Add real compiler and browser tests first; observe new API failures.
- [ ] Extract form-shell.tsx, form-configured.tsx, form-field.tsx, private form-field-layout.tsx. Remove ex-form.tsx, form-item.tsx, ex-item.tsx.
- [ ] Strict never exclusions for spread props; keep Input/Output inference, control/path/array correlation. fields !== undefined includes [] as configured. Validate runtime shape/source/props; throw when changing composed/configured branch without key, allow schema/instance source switches within configured branch.
- [ ] Preserve DOM/CSS slots and data layout, controller/coordinator and async state. Private layout needs no standalone direct-Input auto-association compatibility API; FormField already supplies explicit IDs.
- [ ] Migrate existing form browser suites to canonical Form/FormField and standalone Field recipes; add single-root/footer/guard/remount/source-switch coverage. Keep existing tests meaningful rather than deleting them.
- [ ] Build and run focused tests, return exact touched paths and validation evidence. Independent working-tree code-review before dependent work.

### Task 2: Canonical examples, docs site and source exports

Ownership: packages/docs (excluding form browser suites owned by task 1), scripts/docs-content/sharing/snippets and associated tests/static verifiers. May update TESTING.md counts and commands. No capability or skill generation yet.
Interfaces: source catalog has only canonical 89 families: 87 Components including Form and 2 Blocks. URL/module group stays exui for Form; navigationGroup can be components. Original self-contained catalog must still work in Node loadCatalog. Remove ExForm/ExItem document records/pages, no migration kind/mapping required.
- [ ] Add failing inventory/ownership/snippet tests for canonical structure.
- [ ] Aggregate composed/configured Form examples; keep independent instances and useful steps/project/list scenes. New minimum model comparison. Move standalone items to real Field extension modules with explicit labels and description/error ARIA.
- [ ] Update sharing extraction to identify Preview leaf functions independently of pages registration; no duplicate IDs; source exports use only canonical API. Normalize all examples to actual canonical host galleries.
- [ ] Filter/reclassify canonical catalog consistently for navigation, overview, breadcrumbs, search and source exports without changing module loader group. Explicit search indexes via public createSearchAPI; legacy names may remain as search hints only if useful.
- [ ] Remove old bilingual docs, update Form/Field and related guides with complete public modules. Source excerpts retain form/schema/defaultValues/fields/onSubmit and FormField form/name/control/render.
- [ ] Generate affected examples/content/snippets and verify with existing Node tests plus real ComponentExamplesHost browser evidence. Independent review.

### Task 3: Consumer guidance, generated contracts and final delivery

Ownership: skills/exui, docs/exui capability source fragments and generated bounded sections, inventories/source-review, README and verified .ai form/site knowledge, Changeset, .notes upgrade-guide. Coordinate generator outputs after task 2.
- [ ] Update canonical consumer examples and Field recipe guide, no deprecated aliases. Recipe keeps 21.75rem own-item responsive rule, 9rem/12rem bases, .25/.5/.75rem gaps, content max-width and alignment, actual focus element IDs/ARIA.
- [ ] Update public-symbol capability associations and sources; inspect changes and authored notes before explicit --accept-source-review, then generate controlled outputs.
- [ ] Add release-worthy breaking Changeset following actual release conventions; no version application. Write .notes/ex-form/upgrade-guide.md with old-to-new API/type/URL mapping and working replacement patterns.
- [ ] Update verified durable .ai records through codebase-documenter; do not record intended behavior as proven.
- [ ] Run tokens:check, typecheck, lint, build, visual, pack, docs content/sharing/snippets/examples/capabilities/upstream/skill gates. Build and static/share verify root, then build and verify /exui/ output.
- [ ] Mandatory code-review working-tree covering every touched tracked/untracked/deleted/generated path and full ignored notes content. Fix blockers, rerun affected validations and re-review full set.
- [ ] Report actual evidence, remaining limitations and no commit requested.
