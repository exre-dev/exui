"use client"

import { useMemo } from "react"
import {
  createTableHook as createRawTableHook,
  useTable as useRawTable,
} from "@tanstack/react-table"
import { useRootRem } from "@/hooks/use-root-rem"
import { markImplicitTableMinimum } from "@/lib/tanstack-table/defaults"

// Keep the dependency's types, features, contexts, and low-level utilities.
// constructTable is intentionally the raw non-React pixel API: it has no
// mounted document or teardown lifecycle. React consumers use the hooks below.
export * from "@tanstack/react-table"

function withoutUndefinedSizes(value: object): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...value }
  // An optional caller property set to undefined must still inherit the
  // scaled default instead of masking it and triggering core's raw fallback.
  if (copy.size === undefined) delete copy.size
  if (copy.minSize === undefined) delete copy.minSize
  return copy
}

function normalizeColumn(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return value
  const column = withoutUndefinedSizes(value)
  if (Array.isArray(column.columns)) column.columns = column.columns.map(normalizeColumn)
  return column
}

function useRemTableOptions<TOptions extends { columns: readonly unknown[]; defaultColumn?: unknown }>(
  options: TOptions
): TOptions {
  const rem = useRootRem()
  const defaultColumn = useMemo(() => {
    const supplied = typeof options.defaultColumn === "object" && options.defaultColumn !== null
      ? options.defaultColumn : {}
    const column = { size: 9.375 * rem, minSize: 1.25 * rem, ...withoutUndefinedSizes(supplied) }
    return "minSize" in supplied && supplied.minSize !== undefined
      ? column : markImplicitTableMinimum(column)
  }, [rem, options.defaultColumn])
  // v9 caches resolved column definitions by columns identity. A changed
  // defaultColumn alone leaves getSize/getStart reading old defaults.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- invalidate v9's column definition memo when defaults change
  const columns = useMemo(() => options.columns.map(normalizeColumn), [options.columns, defaultColumn])
  return useMemo(() => ({ ...options, columns, defaultColumn }), [options, columns, defaultColumn])
}

export const useTable: typeof useRawTable = (options, selector) =>
  useRawTable(useRemTableOptions(options), selector)

export const createTableHook: typeof createRawTableHook = (options) => {
  const hooks = createRawTableHook(options)
  return {
    ...hooks,
    useAppTable: (tableOptions, selector) => {
      // Match the upstream shallow options merge, including replacement of
      // defaultColumn at the useAppTable call site, before adding our defaults.
      const merged = { ...options, ...tableOptions }
      return hooks.useAppTable(useRemTableOptions(merged), selector)
    },
  }
}
