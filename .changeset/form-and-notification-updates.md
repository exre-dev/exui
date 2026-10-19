---
"@exre/exui": minor
---

### Breaking Changes

1. Unify schema-configured, instance-configured and composed forms under `Form`, with `FormField` for bound fields. Remove `ExForm`, `FormItem`, `ExItem` and their former public props types without compatibility aliases. Use the named `FormConfiguredSchemaProps`, `FormConfiguredInstanceProps` and `FormComposedProps` branches for wrappers; configured rendering is selected by `fields !== undefined` and switching modes requires a new React key. Compose public Field primitives for standalone settings and display rows, with explicit control IDs, labels and ARIA. Form examples now live under the canonical Form page, and standalone examples under Field; the old ExForm/ExItem pages and example IDs have been removed.
2. Remove `ExMessage`, `ExMessageContext`, and their types. Import `Toaster` and `toast` from `@exre/exui` for notifications, Promise results, and loading updates by ID. Migrate `warn` to `toast.warning`; applications now own cancellation, loading deadlines, and cleanup. `visibleToasts` limits visible notifications without reproducing the removed managed-message eviction policy. See the ExMessage migration guide for configuration and lifecycle differences.

### Fixes

1. Use the shared destructive Alert for FormErrorSummary, with a status icon, title and linked error list.
