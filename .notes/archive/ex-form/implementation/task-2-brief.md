# Form API consolidation implementation plan

> Execute using superpowers:subagent-driven-development, sequential tasks and independent code-review gates. No commits requested.

Goal: implement Form/FormField and standalone Field, migrate this unpublished repository, and write .notes/ex-form/upgrade-guide.md.
Spec: ../specs/2026-10-19-form-api-consolidation-design.md
RFC: ../rfcs/form-api-consolidation-rfc.md

## Latest user scope override (binding)

The user explicitly says compatibility is unnecessary because the project has not shipped. Remove ExForm, FormItem, ExItem and their old public types instead of adding aliases, adapters, deprecations or migration pages. Old URLs, anchors and share IDs need not survive. Keep all useful example scenarios under new canonical ownership. Do not build the RFC compatibility mapping or freeze legacy anchors. Use only the three new named branch props; no old FormProps requirement. Provide an upgrade guide in .notes when finished. Preserve existing form state, type safety, layout, aria, async and step behavior. Keep locked upstream examples/revisions untouched. No pushes, publication or commits.

## Architecture and tools

React 19 / TypeScript, existing RHF and Standard Schema core; one native form and one owner. Node 24.22.0, pnpm 11.9.0. Build/type-producing commands sequential. Existing isolated worktree feat/blocks-optimization at ed28078; clean original baseline.


### Task 2: Canonical examples, docs site and source exports

Ownership: packages/docs (excluding form browser suites owned by task 1), scripts/docs-content/sharing/snippets and associated tests/static verifiers. May update TESTING.md counts and commands. No capability or skill generation yet.
Interfaces: source catalog has only canonical 89 families: 87 Components including Form and 2 Blocks. URL/module group stays exui for Form; navigationGroup can be components. Original self-contained catalog must still work in Node loadCatalog. Remove ExForm/ExItem document records/pages, no migration kind/mapping required.
- [ ] Add failing inventory/ownership/snippet tests for canonical structure.
- [ ] Aggregate composed/configured Form examples; keep independent instances and useful steps/project/list scenes. New minimum model comparison. Move standalone items to real Field extension modules with explicit labels and description/error ARIA.
- [ ] Update sharing extraction to identify Preview leaf functions independently of pages registration; no duplicate IDs; source exports use only canonical API. Normalize all examples to actual canonical host galleries.
- [ ] Filter/reclassify canonical catalog consistently for navigation, overview, breadcrumbs, search and source exports without changing module loader group. Explicit search indexes via public createSearchAPI; legacy names may remain as search hints only if useful.
- [ ] Remove old bilingual docs, update Form/Field and related guides with complete public modules. Source excerpts retain form/schema/defaultValues/fields/onSubmit and FormField form/name/control/render.
- [ ] Generate affected examples/content/snippets and verify with existing Node tests plus real ComponentExamplesHost browser evidence. Independent review.



Clarification: 89 is total retained raw catalog families. Keep raw/module/URL group=exui for Form, so raw groups after deletion are 86 components and 3 exui. The 87 Components / 2 Blocks counts are PRESENTATION navigation groups (Form moves only in presentation). A separate derived catalog module may read a pure navigation helper in site-contract; keep catalog.ts self-contained for loadCatalog. No migration kinds or backward compatibility maps needed.
