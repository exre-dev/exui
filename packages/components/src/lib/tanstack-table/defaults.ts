// Provenance only, not a second scale store. DataGrid's autoSize floor treats
// caller minimums differently from the table's built-in minimum.
const implicitMinimums = new WeakSet<object>()

export function markImplicitTableMinimum<T extends object>(column: T): T {
  implicitMinimums.add(column)
  return column
}

export function hasExplicitTableMinimum(column: { minSize?: number } | undefined): boolean {
  return column?.minSize !== undefined && !implicitMinimums.has(column)
}
