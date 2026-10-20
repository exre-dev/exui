# Form API consolidation implementation plan

> Execute using superpowers:subagent-driven-development, sequential tasks and independent code-review gates. No commits requested.

Goal: implement Form/FormField and standalone Field, migrate this unpublished repository, and write .notes/ex-form/upgrade-guide.md.
Spec: ../specs/2026-10-19-form-api-consolidation-design.md
RFC: ../rfcs/form-api-consolidation-rfc.md

## Latest user scope override (binding)

The user explicitly says compatibility is unnecessary because the project has not shipped. Remove ExForm, FormItem, ExItem and their old public types instead of adding aliases, adapters, deprecations or migration pages. Old URLs, anchors and share IDs need not survive. Keep all useful example scenarios under new canonical ownership. Do not build the RFC compatibility mapping or freeze legacy anchors. Use only the three new named branch props; no old FormProps requirement. Provide an upgrade guide in .notes when finished. Preserve existing form state, type safety, layout, aria, async and step behavior. Keep locked upstream examples/revisions untouched. No pushes, publication or commits.

## Architecture and tools

React 19 / TypeScript, existing RHF and Standard Schema core; one native form and one owner. Node 24.22.0, pnpm 11.9.0. Build/type-producing commands sequential. Existing isolated worktree feat/blocks-optimization at ed28078; clean original baseline.


### Task 3: Consumer guidance, generated contracts and final delivery

Ownership: skills/exui, docs/exui capability source fragments and generated bounded sections, inventories/source-review, README and verified .ai form/site knowledge, Changeset, .notes upgrade-guide. Coordinate generator outputs after task 2.
- [ ] Update canonical consumer examples and Field recipe guide, no deprecated aliases. Recipe keeps 21.75rem own-item responsive rule, 9rem/12rem bases, .25/.5/.75rem gaps, content max-width and alignment, actual focus element IDs/ARIA.
- [ ] Update public-symbol capability associations and sources; inspect changes and authored notes before explicit --accept-source-review, then generate controlled outputs.
- [ ] Add release-worthy breaking Changeset following actual release conventions; no version application. Write .notes/ex-form/upgrade-guide.md with old-to-new API/type/URL mapping and working replacement patterns.
- [ ] Update verified durable .ai records through codebase-documenter; do not record intended behavior as proven.
- [ ] Run tokens:check, typecheck, lint, build, visual, pack, docs content/sharing/snippets/examples/capabilities/upstream/skill gates. Build and static/share verify root, then build and verify /exui/ output.
- [ ] Mandatory code-review working-tree covering every touched tracked/untracked/deleted/generated path and full ignored notes content. Fix blockers, rerun affected validations and re-review full set.
- [ ] Report actual evidence, remaining limitations and no commit requested.


Canonical tool messages: scripts/verify-form-browser.mjs and scripts/verify-packages.mjs still print ExForm even though maintained fixture now uses unified Form. If changing them, limit to related comments/log labels and include exact paths; no behavior rewrite. Final source-review acceptance must follow independent source/authored-note review: prepare authored registry/fragments/skill/guide first, then pause for parent review before --accept-source-review and generation (may resume same agent after approval gate). Parent is responsible for final whole-repo validation.

Settled Task2 example IDs (registry must use actual canonical owners): exui/form owns exui-form-1 (project/list), exui-form-models (independent minimal composed/configured forms), exui-form-configured (steps/review). components/field owns exui-field-settings (real label/description/error ARIA), exui-field-display, exui-field-layout. Old exui-ex-form/ex-item IDs are gone, not compatibility aliases. Total content198pages99perlocale; totalcatalog89 rawgroups86+3 and presentationgroups87+2. New standalone capability can rename standalone-ex-item to field-layout; fully migrate references/tests if doing so, do not keep it as legacy compatibility.
