// Keep every Node suite in exactly one list. The discovery regression compares
// these explicit paths with packages/*/tests/**/*.test.mjs to reject omissions.
// Pure Node policies, bounded fixtures and current public-package SSR stay fast.
export const fastNodeTests = [
  "packages/icons/tests/assets.test.mjs",
  "packages/icons/tests/react.test.mjs",
  "packages/components/tests/node/module-specifiers.test.mjs",
  "packages/components/tests/node/rem.test.mjs",
  "packages/components/tests/tooling/dev.test.mjs",
  "packages/components/tests/tooling/release/npm.test.mjs",
  "packages/components/tests/tooling/release/package-contract.test.mjs",
  "packages/components/tests/tooling/run-command.test.mjs",
  "packages/components/tests/tooling/skill/inventories.test.mjs",
  "packages/components/tests/tooling/skill/sync-references.test.mjs",
  "packages/components/tests/tooling/tasks.test.mjs",
  "packages/components/tests/tooling/test-discovery.test.mjs",
  "packages/components/tests/tooling/watch.test.mjs",
  "packages/components/tests/upstream/reui-luma.test.mjs",
  "packages/components/tests/upstream/reui-restore.test.mjs",
  "packages/docs/tests/node/docs-content.test.mjs",
  "packages/docs/tests/node/docs-example-assets.test.mjs",
  "packages/docs/tests/node/docs-example-base.test.mjs",
  "packages/docs/tests/node/docs-example-copy-ssr.test.mjs",
  "packages/docs/tests/node/docs-example-copy.test.mjs",
  "packages/docs/tests/node/docs-example-styles.test.mjs",
  "packages/docs/tests/node/docs-examples.test.mjs",
  "packages/docs/tests/node/docs-pages.test.mjs",
  "packages/docs/tests/node/docs-snippets.test.mjs",
  "packages/docs/tests/node/docs-static.test.mjs",
  "packages/docs/tests/node/exui-capabilities.test.mjs",
  "packages/tokens/tests/color-contrast-policy.test.mjs",
  "packages/tokens/tests/foundation-reference-policy.test.mjs",
  "packages/tokens/tests/glass-policy.test.mjs",
  "packages/tokens/tests/reui-semantic-alias.test.mjs",
  "packages/tokens/tests/token-length-policy.test.mjs",
]

// Chromium, real Vite servers, release Git orchestration and repeated full-tree
// copies/compiler programs remain in complete verification and explicit test:node.
export const integrationNodeTests = [
  "packages/icons/tests/build.test.mjs",
  "packages/components/tests/node/chart-style.test.mjs",
  "packages/components/tests/tooling/release/runtime.test.mjs",
  "packages/components/tests/upstream/reui-exports.test.mjs",
  "packages/components/tests/upstream/reui-sync.test.mjs",
  "packages/docs/tests/node/docs-dev-sources.test.mjs",
  "packages/docs/tests/node/docs-library-reload.test.mjs",
  "packages/docs/tests/node/docs-sharing.test.mjs",
  "packages/docs/tests/node/library-build-barrier.test.mjs",
]
